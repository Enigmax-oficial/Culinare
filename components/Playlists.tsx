
import React from 'react';
import { Heart, Hash, FolderHeart, ArrowRight, Play, Star, Clock } from 'lucide-react';
import { Recipe, User } from '../types';

interface PlaylistsProps {
  user: User;
  recipes: Recipe[];
  onSelectRecipe: (id: string) => void;
  onBack: () => void;
}

export const Playlists: React.FC<PlaylistsProps> = ({ user, recipes, onSelectRecipe, onBack }) => {
  const favoriteRecipes = recipes.filter(r => user.favorites.includes(r.id));
  
  // Categorias "Playlist" dinâmicas baseadas nos favoritos
  const categories = Array.from(new Set(favoriteRecipes.map(r => r.category)));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="text-5xl font-black text-stone-900 tracking-tight mb-2">Suas Playlists</h2>
          <p className="text-stone-500 text-lg font-medium">Suas curadorias gastronômicas organizadas por categoria.</p>
        </div>
        <div className="bg-orange-50 px-6 py-3 rounded-2xl text-orange-600 font-black text-sm uppercase tracking-widest flex items-center gap-2">
          <FolderHeart size={18} /> {favoriteRecipes.length} Receitas Salvas
        </div>
      </div>

      {favoriteRecipes.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-stone-100 rounded-[40px] p-20 text-center">
          <Heart size={48} className="text-stone-200 mx-auto mb-6" />
          <h3 className="text-2xl font-black text-stone-900 mb-2">Sua biblioteca está vazia</h3>
          <p className="text-stone-400 mb-8">Navegue pelas receitas e clique no coração para salvá-las aqui.</p>
          <button onClick={onBack} className="bg-stone-900 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase shadow-xl hover:bg-orange-500 transition-all">Explorar Receitas</button>
        </div>
      ) : (
        <div className="space-y-16">
          {categories.map(cat => (
            <section key={cat}>
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-stone-900 text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest">{cat}</div>
                <div className="h-px flex-1 bg-stone-100"></div>
                <button className="text-stone-400 hover:text-orange-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-1 transition-colors">
                  Ver Tudo <ArrowRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {favoriteRecipes.filter(r => r.category === cat).map(recipe => (
                  <div 
                    key={recipe.id} 
                    onClick={() => onSelectRecipe(recipe.id)}
                    className="group relative bg-white rounded-[32px] overflow-hidden border border-stone-100 hover:shadow-2xl transition-all duration-500 cursor-pointer"
                  >
                    <div className="aspect-[16/10] relative overflow-hidden">
                      <img src={recipe.image} alt={recipe.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <div className="bg-white p-4 rounded-full text-stone-900 transform scale-75 group-hover:scale-100 transition-transform">
                           <Play size={24} fill="currentColor" />
                         </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-black text-stone-900 mb-3 group-hover:text-orange-500 transition-colors">{recipe.title}</h3>
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <div className="flex items-center gap-1 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                             <Star size={12} className="text-yellow-400" fill="currentColor" /> {recipe.rating}
                           </div>
                           <div className="flex items-center gap-1 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                             <Clock size={12} /> {recipe.prepTime + recipe.cookTime}m
                           </div>
                         </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};
