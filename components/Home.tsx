import React from 'react';
import { Star, Clock, Heart, Flame, ArrowRight, ChefHat } from 'lucide-react';
import { Recipe, User } from '../types';

interface HomeProps {
  recipes: Recipe[];
  user: User | null;
  onSelectRecipe: (id: string) => void;
  onOpenAuth: () => void;
}

export const Home: React.FC<HomeProps> = ({ recipes, user, onSelectRecipe, onOpenAuth }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-stone-900 mb-4 tracking-tight">
          Olá{user ? `, ${user.name}` : ''}! 👋
        </h1>
        <p className="text-lg text-stone-500">O que vamos cozinhar hoje?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map((recipe) => (
          <div 
            key={recipe.id}
            onClick={() => onSelectRecipe(recipe.id)}
            className="group bg-white rounded-[32px] overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img 
                src={recipe.image} 
                alt={recipe.title} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-stone-900 shadow-sm">
                {recipe.calories} kcal
              </div>
              <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm">
                {recipe.category}
              </div>
              {user?.favorites.includes(recipe.id) && (
                <div className="absolute bottom-4 right-4 bg-red-500 p-2 rounded-full text-white shadow-lg">
                  <Heart size={16} fill="white" />
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-yellow-400">
                  <Star size={14} fill="currentColor" />
                </div>
                <span className="text-xs font-bold text-stone-500">{recipe.rating} ({recipe.reviews} reviews)</span>
              </div>
              
              <h3 className="text-xl font-black text-stone-900 mb-3 group-hover:text-orange-500 transition-colors">
                {recipe.title}
              </h3>
              
              <div className="flex items-center gap-4 text-stone-400">
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <Clock size={14} />
                  {recipe.prepTime + recipe.cookTime} MIN
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <Flame size={14} />
                  {recipe.difficulty}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {!user && (
        <div className="mt-20 bg-stone-900 rounded-[40px] p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <div className="inline-flex bg-orange-500 p-4 rounded-3xl mb-6 shadow-xl shadow-orange-500/20">
              <ChefHat size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4">Entre para a nossa Comunidade</h2>
            <p className="text-stone-400 mb-8 max-w-xl mx-auto text-lg font-medium leading-relaxed">
              Crie uma conta gratuita para salvar suas playlists de receitas, publicar suas próprias criações e ter acesso às dicas exclusivas do Mestre Cucal AI.
            </p>
            <div className="flex justify-center">
              <button 
                onClick={onOpenAuth}
                className="bg-orange-500 text-white px-10 py-5 rounded-2xl font-black hover:bg-orange-600 transition-all shadow-lg active:scale-95 flex items-center gap-3 uppercase tracking-widest text-sm"
              >
                Começar agora <ArrowRight size={20} />
              </button>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -ml-32 -mt-32"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mb-40 -mr-40"></div>
        </div>
      )}
    </div>
  );
};