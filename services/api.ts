
import { Recipe, User, ShoppingItem } from '../types';
import { db } from './db';

/**
 * APIService (Static Version)
 * Gerencia a comunicação com o banco de dados local.
 * Como o app é estático, não há chamadas fetch para servidores próprios.
 */
class APIService {
  // Mantido para compatibilidade com o componente de status da UI
  public isOnline: boolean = true;

  private async delay(ms: number = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getRecipes(): Promise<Recipe[]> {
    await this.delay();
    return await db.getRecipes();
  }

  async createRecipe(recipe: Partial<Recipe>): Promise<Recipe> {
    await this.delay(600);
    const newRecipe = {
      ...recipe,
      id: Math.random().toString(36).substr(2, 9),
      rating: 5,
      reviews: 0,
      createdAt: new Date().toISOString()
    } as Recipe;
    
    const rawData = JSON.parse(localStorage.getItem('chefemcasa_db_v2') || '{}');
    rawData.recipes.unshift(newRecipe);
    localStorage.setItem('chefemcasa_db_v2', JSON.stringify(rawData));
    
    return newRecipe;
  }

  async createUser(name: string, email: string, provider: 'google' | 'apple' | 'email' = 'email'): Promise<User> {
    await this.delay(400);
    return await db.createUser(name, email, provider);
  }

  async login(email: string): Promise<User | null> {
    await this.delay(300);
    return await db.login(email);
  }

  async verifyUser(email: string): Promise<User | null> {
    return await db.verifyUser(email);
  }

  async toggleFavorite(userId: string, recipeId: string): Promise<string[]> {
    return await db.toggleFavorite(userId, recipeId);
  }
}

export const api = new APIService();
