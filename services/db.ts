
import { Recipe, User, ShoppingItem } from '../types';

class SQLBackend {
  private STORAGE_KEY = 'chefemcasa_db_v2';

  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const initialData = {
        users: [],
        credentials: {}, // WebAuthn credentials storage
        recipes: [
          {
            id: '1',
            title: "Panquecas Americanas Fofinhas",
            description: "A receita definitiva para o café da manhã perfeito. Massa leve, aerada e dourada.",
            rating: 4.9,
            reviews: 128,
            prepTime: 10,
            cookTime: 15,
            calories: 230,
            difficulty: "Fácil",
            category: "Café da Manhã",
            image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1000&q=80",
            tags: ["Café da Manhã", "Americano", "Fácil"],
            ingredients: [
              { name: "Farinha de trigo", amount: 1.5, unit: "xícaras" },
              { name: "Açúcar refinado", amount: 2, unit: "colheres (sopa)" },
              { name: "Fermento em pó", amount: 1, unit: "colher (sopa)" },
              { name: "Sal", amount: 0.5, unit: "colher (chá)" },
              { name: "Leite integral", amount: 1.25, unit: "xícaras" },
              { name: "Manteiga derretida", amount: 3, unit: "colheres (sopa)" },
              { name: "Ovo grande", amount: 1, unit: "unidade" },
              { name: "Essência de baunilha", amount: 1, unit: "colher (chá)" },
            ],
            steps: [
              { title: "Misture os secos", text: "Em uma tigela grande, peneire a farinha, o açúcar, o fermento e o sal." },
              { title: "Prepare os líquidos", text: "Em outro recipiente, bata levemente o ovo com leite, manteiga e baunilha." },
              { title: "União suave", text: "Incorpore os líquidos aos secos sem bater demais." },
              { title: "Cozimento", text: "Frite em fogo médio-baixo até surgirem bolhas." }
            ]
          },
          {
             id: '2',
             title: "Bowl de Açaí Energético",
             description: "O lanche pós-treino ideal, rico em antioxidantes e sabor natural.",
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
               { name: "Banana", amount: 1, unit: "unidade" },
               { name: "Granola", amount: 0.5, unit: "xícara" },
               { name: "Mel ou Agave", amount: 1, unit: "colher (sopa)" }
             ],
             steps: [
               { title: "Bater", text: "Bata o açaí congelado com metade da banana até ficar cremoso." },
               { title: "Montar", text: "Coloque em um bowl e cubra com o restante das frutas e granola." }
             ]
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
            steps: [
              { title: "Cozinhar", text: "Cozinhe o macarrão em água salgada." },
              { title: "Preparar bacon", text: "Frite o bacon até ficar crocante." },
              { title: "Misturar", text: "Misture o macarrão quente com os ovos batidos e o bacon." }
            ]
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
              { name: "Azeite", amount: 3, unit: "colheres (sopa)" },
              { name: "Sal e pimenta", amount: 1, unit: "a gosto" }
            ],
            steps: [
              { title: "Preparar", text: "Tempere o salmão com sal, pimenta e limão." },
              { title: "Grelhar", text: "Grelhe em fogo alto por 12-15 minutos de cada lado." },
              { title: "Servir", text: "decore com rodelas de limão frescos." }
            ]
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
              { name: "Leite integral", amount: 1, unit: "xícara" },
              { name: "Chocolate em pó", amount: 2, unit: "colheres (sopa)" },
              { name: "Açúcar refinado", amount: 1, unit: "colher (sopa)" },
              { name: "Malte em pó (opcional)", amount: 1, unit: "colher (sopa)" }
            ],
            steps: [
              { title: "Aquecer", text: "Despeje o leite em uma panela e aqueça." },
              { title: "Misturar", text: "Adicione o chocolate em pó e mexa bem." },
              { title: "Servir", text: "Despeje em xícara e sirva quente." }
            ]
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
              { name: "Cogumelos frescos", amount: 300, unit: "g" },
              { name: "Vinho branco seco", amount: 1, unit: "xícara" },
              { name: "Caldo vegetais", amount: 4, unit: "xícaras" },
              { name: "Queijo parmesão", amount: 50, unit: "g" }
            ],
            steps: [
              { title: "Preparar", text: "Refogue cebola e alho. Adicione os cogumelos cortados." },
              { title: "Cozinhar arroz", text: "Adicione o arroz e mexa por 2 minutos." },
              { title: "Adicionar líquido", text: "Despeje o vinho e vá adicionando caldo quente aos poucos, mexendo sempre." },
              { title: "Finalizar", text: "Quando o arroz estiver cremoso, retire do fogo e adicione queijo." }
            ]
          }
        ],
        shoppingList: {}
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialData));
    }
  }

  private getData() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
  }

  private setData(data: any) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  async getRecipes(): Promise<Recipe[]> {
    return this.getData().recipes;
  }

  async createUser(name: string, email: string, provider: 'google' | 'apple' | 'email' = 'email'): Promise<User> {
    const data = this.getData();
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      favorites: [],
      provider,
      isVerified: true
    };
    data.users.push(newUser);
    this.setData(data);
    return newUser;
  }

  async login(email: string): Promise<User | null> {
    const data = this.getData();
    return data.users.find((u: User) => u.email === email) || null;
  }

  // Fix: Added verifyUser method to handle user verification and resolve the error in services/api.ts
  async verifyUser(email: string): Promise<User | null> {
    const data = this.getData();
    const user = data.users.find((u: User) => u.email === email);
    if (user) {
      user.isVerified = true;
      this.setData(data);
      return user;
    }
    return null;
  }

  async toggleFavorite(userId: string, recipeId: string): Promise<string[]> {
    const data = this.getData();
    const user = data.users.find((u: any) => u.id === userId);
    if (!user) return [];
    user.favorites = user.favorites.includes(recipeId) 
      ? user.favorites.filter((id: string) => id !== recipeId)
      : [...user.favorites, recipeId];
    this.setData(data);
    return user.favorites;
  }

  async addToShoppingList(userId: string, items: ShoppingItem[]) {
    const data = this.getData();
    if (!data.shoppingList[userId]) data.shoppingList[userId] = [];
    data.shoppingList[userId] = [...data.shoppingList[userId], ...items];
    this.setData(data);
  }

  async getShoppingList(userId: string): Promise<ShoppingItem[]> {
    return this.getData().shoppingList[userId] || [];
  }
}

export const db = new SQLBackend();
