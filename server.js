
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`Servidor ChefEmCasa rodando em http://localhost:${PORT}`);
});
