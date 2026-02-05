
export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface Step {
  title: string;
  text: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  rating: number;
  reviews: number;
  prepTime: number;
  cookTime: number;
  calories: number;
  difficulty: string;
  image: string;
  ingredients: Ingredient[];
  steps: Step[];
  category: string;
  tags: string[];
  authorId?: string; // ID do usuário que enviou a receita
}

export interface User {
  id: string;
  name: string;
  email: string;
  favorites: string[];
  playlists?: Record<string, string[]>; // Nome da playlist -> IDs de receitas
  provider?: 'google' | 'apple' | 'email';
  isVerified: boolean;
}

export interface ShoppingItem {
  name: string;
  amount: string;
  checked: boolean;
}

export interface Comment {
  id: string;
  recipeId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}
