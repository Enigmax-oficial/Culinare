
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const app = express();
const PORT = 3001;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(cors());
app.use(express.json());

// Configuração OAuth2 do Google
const oauth2Client = new google.auth.OAuth2(
  '309962205395-c36qhp6n9qold6kcd5ii3d4t3q04qvt9.apps.googleusercontent.com',
  process.env.GOOGLE_CLIENT_SECRET || '',
  'http://localhost:3001/api/auth/google/callback'
);

// Inicializa o banco de dados se não existir
if (!fs.existsSync(DB_FILE)) {
  const initialData = {
    users: [],
    shoppingLists: {},
    recipes: [
      {
        id: '1',
        title: "Panquecas Americanas Fofinhas",
        description: "A receita definitiva para o café da manhã perfeito.",
        rating: 4.9,
        reviews: 128,
        prepTime: 10,
        cookTime: 15,
        calories: 230,
        difficulty: "Fácil",
        category: "Café da Manhã",
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1000&q=80",
        tags: ["Café da Manhã", "Americano"],
        ingredients: [
          { name: "Farinha de trigo", amount: 1.5, unit: "xícaras" },
          { name: "Açúcar", amount: 2, unit: "colheres" }
        ],
        steps: [{ title: "Misturar", text: "Misture tudo." }]
      },
      {
        id: '2',
        title: "Bowl de Açaí Energético",
        description: "O lanche pós-treino ideal, rico em antioxidantes.",
        rating: 4.7,
        reviews: 85,
        prepTime: 5,
        cookTime: 0,
        calories: 310,
        difficulty: "Muito Fácil",
        category: "Lanche",
        image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=1000&q=80",
        tags: ["Saudável", "Energia", "Vegano"],
        ingredients: [
          { name: "Polpa de açaí", amount: 200, unit: "g" },
          { name: "Banana", amount: 1, unit: "unidade" }
        ],
        steps: [{ title: "Bater", text: "Bata o açaí com banana até ficar cremoso." }]
      },
      {
        id: '3',
        title: "Pasta à Carbonara Autêntica",
        description: "Receita italiana tradicional com ovos, bacon e queijo.",
        rating: 4.8,
        reviews: 156,
        prepTime: 10,
        cookTime: 20,
        calories: 520,
        difficulty: "Médio",
        category: "Almoço/Jantar",
        image: "https://images.unsplash.com/photo-1612874742237-6526221fcf4f?auto=format&fit=crop&w=1000&q=80",
        tags: ["Italiana", "Almoço", "Massa"],
        ingredients: [
          { name: "Macarrão", amount: 400, unit: "g" },
          { name: "Bacon", amount: 200, unit: "g" },
          { name: "Ovos", amount: 2, unit: "unidades" },
          { name: "Queijo parmesão", amount: 100, unit: "g" }
        ],
        steps: [{ title: "Preparar", text: "Cozinhe a pasta, frite o bacon e misture tudo com os ovos." }]
      },
      {
        id: '4',
        title: "Salmão Grelhado com Limão",
        description: "Prato elegante e saudável, rico em ômega 3.",
        rating: 4.9,
        reviews: 203,
        prepTime: 15,
        cookTime: 25,
        calories: 450,
        difficulty: "Médio",
        category: "Almoço/Jantar",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80",
        tags: ["Peixe", "Saudável", "Gourmet"],
        ingredients: [
          { name: "Filé de salmão", amount: 500, unit: "g" },
          { name: "Limão", amount: 2, unit: "unidades" },
          { name: "Azeite", amount: 3, unit: "colheres (sopa)" }
        ],
        steps: [{ title: "Grelhar", text: "Grelhe o salmão em fogo alto com limão e azeite." }]
      },
      {
        id: '5',
        title: "Chocolate Quente Cremoso",
        description: "Bebida perfeita para os dias frios.",
        rating: 4.6,
        reviews: 92,
        prepTime: 5,
        cookTime: 10,
        calories: 280,
        difficulty: "Muito Fácil",
        category: "Bebidas",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80",
        tags: ["Quente", "Doce", "Café da Manhã"],
        ingredients: [
          { name: "Leite", amount: 1, unit: "xícara" },
          { name: "Chocolate em pó", amount: 2, unit: "colheres (sopa)" },
          { name: "Açúcar", amount: 1, unit: "colher (sopa)" }
        ],
        steps: [{ title: "Misturar", text: "Despeje ingredientes em panela quente e mexa bem." }]
      },
      {
        id: '6',
        title: "Risoto de Cogumelos",
        description: "Prato cremoso e sofisticado.",
        rating: 4.8,
        reviews: 134,
        prepTime: 20,
        cookTime: 30,
        calories: 480,
        difficulty: "Médio",
        category: "Almoço/Jantar",
        image: "https://images.unsplash.com/photo-1574080526500-b54688d2ff25?auto=format&fit=crop&w=1000&q=80",
        tags: ["Italiana", "Vegetariano"],
        ingredients: [
          { name: "Arroz arbório", amount: 300, unit: "g" },
          { name: "Cogumelos", amount: 300, unit: "g" },
          { name: "Vinho branco", amount: 1, unit: "xícara" }
        ],
        steps: [{ title: "Preparar", text: "Refogue arroz e vá adicionando caldo quente aos poucos." }]
      }
    ]
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
}

const getDb = () => JSON.parse(fs.readFileSync(DB_FILE));
const saveDb = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// Rotas da API
app.get('/api/recipes', (req, res) => {
  const db = getDb();
  res.json(db.recipes);
});

app.post('/api/users', (req, res) => {
  const { name, email, provider } = req.body;
  const db = getDb();
  
  let user = db.users.find(u => u.email === email);
  if (!user) {
    user = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      favorites: [],
      provider: provider || 'email',
      isVerified: provider !== 'email'
    };
    db.users.push(user);
    saveDb(db);
  }
  res.status(201).json(user);
});

app.get('/api/users/:email', (req, res) => {
  const db = getDb();
  const user = db.users.find(u => u.email === req.params.email);
  if (user) res.json(user);
  else res.status(404).send('Not found');
});

app.post('/api/users/verify', (req, res) => {
  const { email } = req.body;
  const db = getDb();
  const user = db.users.find(u => u.email === email);
  if (user) {
    user.isVerified = true;
    saveDb(db);
    res.json(user);
  } else {
    res.status(404).send('User not found');
  }
});

// Autenticação OAuth2 Google
app.get('/api/auth/google', (req, res) => {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ];

  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });

  res.json({ authorizationUrl });
});

app.post('/api/auth/google/callback', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Código de autorização não fornecido' });
    }

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const service = google.oauth2('v2');
    const result = await service.userinfo.get({ auth: oauth2Client });

    const { email, name, picture } = result.data;
    const db = getDb();

    let user = db.users.find(u => u.email === email);
    if (!user) {
      user = {
        id: Math.random().toString(36).substr(2, 9),
        name: name || 'Usuário Google',
        email,
        favorites: [],
        provider: 'google',
        isVerified: true,
        picture: picture || null
      };
      db.users.push(user);
      saveDb(db);
    }

    res.json({
      user,
      tokens
    });
  } catch (error) {
    console.error('Erro na autenticação Google:', error);
    res.status(500).json({ error: 'Erro ao autenticar com Google' });
  }
});

// Endpoint para validar token do Google
app.post('/api/auth/verify-token', (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: 'Token não fornecido' });
  }

  // Validar token com Google
  const { OAuth2Client } = require('google-auth-library');
  const client = new OAuth2Client('309962205395-c36qhp6n9qold6kcd5ii3d4t3q04qvt9.apps.googleusercontent.com');

  client
    .verifyIdToken({
      idToken: idToken,
      audience: '309962205395-c36qhp6n9qold6kcd5ii3d4t3q04qvt9.apps.googleusercontent.com'
    })
    .then(ticket => {
      const payload = ticket.getPayload();
      const db = getDb();

      let user = db.users.find(u => u.email === payload.email);
      if (!user) {
        user = {
          id: Math.random().toString(36).substr(2, 9),
          name: payload.name || 'Usuário Google',
          email: payload.email,
          favorites: [],
          provider: 'google',
          isVerified: true,
          picture: payload.picture || null
        };
        db.users.push(user);
        saveDb(db);
      }

      res.json({ user, isValid: true });
    })
    .catch(error => {
      console.error('Erro ao validar token:', error);
      res.status(401).json({ error: 'Token inválido' });
    });
});

app.listen(PORT, () => {
  console.log(`Servidor ChefEmCasa rodando em http://localhost:${PORT}`);
});
