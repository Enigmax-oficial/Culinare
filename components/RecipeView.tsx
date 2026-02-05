
import React, { useState, useEffect } from 'react';
import { 
  Clock, Users, Flame, Heart, Printer, Share2, 
  Check, Star, Minus, Plus, ChefHat, MessageCircle, Send, Loader2, ShoppingCart
} from 'lucide-react';
import { Recipe, User, ShoppingItem } from '../types';
import { api } from '../services/api'; // Alterado de db para api
import { getChefAdvice } from '../services/ai';

interface RecipeViewProps {
  recipe: Recipe;
  user: User | null;
  onRefreshUser: () => void;
}

export const RecipeView: React.FC<RecipeViewProps> = ({ recipe, user, onRefreshUser }) => {
  const [servings, setServings] = useState(2);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [isLiking, setIsLiking] = useState(false);
  const [isAddingList, setIsAddingList] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [userQuestion, setUserQuestion] = useState("");
  const [showToast, setShowToast] = useState<string | null>(null);

  const isLiked = user?.favorites.includes(recipe.id);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleServingsChange = (delta: number) => {
    setServings(prev => Math.max(1, Math.min(10, prev + delta)));
  };

  const handleLike = async () => {
    if (!user) {
      setShowToast("Entre para salvar receitas!");
      return;
    }
    setIsLiking(true);
    try {
      await api.toggleFavorite(user.id, recipe.id);
      onRefreshUser();
      setShowToast(isLiked ? "Removido dos favoritos" : "Salvo nos favoritos!");
    } catch (e) {
      setShowToast("Erro ao salvar favorito.");
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: recipe.title,
      text: recipe.description,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error(err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowToast("Link copiado!");
    }
  };

  const handleAddShoppingList = async () => {
    if (!user) {
      setShowToast("Entre para criar sua lista!");
      return;
    }
    setIsAddingList(true);
    const items: ShoppingItem[] = recipe.ingredients.map(ing => ({
      name: ing.name,
      amount: `${(ing.amount * (servings / 2)).toFixed(2).replace('.00', '')} ${ing.unit}`,
      checked: false
    }));
    // Note: Usamos o db aqui diretamente para a lista de compras pois o api ainda não expõe este método
    // mas na prática api.ts e db.ts agora trabalham juntos.
    const { db } = await import('../services/db');
    await db.addToShoppingList(user.id, items);
    setIsAddingList(false);
    setShowToast("Adicionado à sua lista de compras!");
  };

  const askChef = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;
    setAiLoading(true);
    const advice = await getChefAdvice(recipe.title, userQuestion);
    setAiMessage(advice || "");
    setAiLoading(false);
    setUserQuestion("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-stone-900 text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-bold animate-in slide-in-from-bottom-4">
          {showToast}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
        <div className="order-2 lg:order-1">
          <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-widest mb-4">
            <Flame size={14} /> {recipe.category}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-stone-900 mb-6 leading-tight">
            {recipe.title}
          </h1>
          <p className="text-lg text-stone-500 mb-8 leading-relaxed max-w-xl">
            {recipe.description}
          </p>
          
          <div className="flex flex-wrap gap-4 md:gap-8 mb-10 pb-8 border-b border-stone-200">
            <div className="flex items-center gap-3">
              <div className="bg-orange-50 p-2.5 rounded-xl text-orange-600">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-xs text-stone-400 font-bold uppercase">Tempo</p>
                <p className="font-extrabold text-stone-800">{recipe.prepTime + recipe.cookTime} min</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-orange-50 p-2.5 rounded-xl text-orange-600">
                <Users size={20} />
              </div>
              <div>
                <p className="text-xs text-stone-400 font-bold uppercase">Rendimento</p>
                <p className="font-extrabold text-stone-800">{servings} pessoas</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-orange-50 p-2.5 rounded-xl text-orange-600">
                <Star size={20} />
              </div>
              <div>
                <p className="text-xs text-stone-400 font-bold uppercase">Nota</p>
                <p className="font-extrabold text-stone-800">{recipe.rating}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 no-print">
            <button 
              onClick={handleLike} disabled={isLiking}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all shadow-md ${isLiked ? 'bg-red-50 text-red-500 border-red-100 border' : 'bg-stone-900 text-white hover:bg-stone-700'}`}
            >
              <Heart className={isLiked ? "fill-current" : ""} size={20} />
              {isLiked ? "Favorito" : "Salvar"}
            </button>
            <button 
              onClick={() => window.print()}
              title="Imprimir Receita"
              className="flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-stone-900 rounded-2xl text-stone-900 hover:bg-stone-900 hover:text-white transition-all shadow-sm font-bold"
            >
              <Printer size={20} /> <span className="hidden sm:inline">Imprimir</span>
            </button>
            <button 
              onClick={handleShare}
              className="p-4 bg-white border border-stone-200 rounded-2xl text-stone-600 hover:bg-stone-50 transition-colors shadow-sm"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
        
        <div className="order-1 lg:order-2">
          <div className="relative aspect-video lg:aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl group">
             <img src={recipe.image} alt={recipe.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-2xl text-sm font-black text-stone-900 shadow-xl border border-white/50">
              {recipe.calories} KCAL
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-stone-100 sticky top-28">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-stone-900">Ingredientes</h2>
              <div className="flex items-center gap-2 bg-stone-50 p-1.5 rounded-xl border border-stone-100 no-print">
                <button onClick={() => handleServingsChange(-1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-stone-400 hover:text-orange-500 transition-all" disabled={servings <= 1}><Minus size={16} /></button>
                <span className="font-bold text-stone-900 w-6 text-center text-sm">{servings}</span>
                <button onClick={() => handleServingsChange(1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-stone-400 hover:text-orange-500 transition-all"><Plus size={16} /></button>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {recipe.ingredients.map((ing, index) => {
                const amount = (ing.amount * (servings / 2)).toFixed(2).replace('.00', '');
                const isChecked = checkedIngredients[index];
                return (
                  <li key={index} className={`flex items-start gap-4 p-3 rounded-2xl transition cursor-pointer select-none group ${isChecked ? 'opacity-40' : 'hover:bg-orange-50/50'}`} onClick={() => setCheckedIngredients(prev => ({...prev, [index]: !prev[index]}))}>
                    <div className={`mt-0.5 min-w-[22px] h-[22px] rounded-lg border-2 flex items-center justify-center transition-all ${isChecked ? 'bg-green-500 border-green-500' : 'border-stone-200 bg-white group-hover:border-orange-300'}`}>
                      {isChecked && <Check size={14} strokeWidth={4} className="text-white" />}
                    </div>
                    <span className={`text-[15px] ${isChecked ? 'line-through' : 'text-stone-700'}`}>
                      <span className="font-black text-stone-900">{amount} {ing.unit}</span> de {ing.name}
                    </span>
                  </li>
                );
              })}
            </ul>
            
            <button 
              onClick={handleAddShoppingList} disabled={isAddingList}
              className="w-full bg-orange-50 text-orange-600 font-bold py-4 rounded-2xl hover:bg-orange-100 transition-colors flex items-center justify-center gap-2 no-print"
            >
              {isAddingList ? <Loader2 className="animate-spin" /> : <ShoppingCart size={20} />}
              Lista de Compras
            </button>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-black text-stone-900">Passo a Passo</h2>
            <div className="flex-1 h-px bg-stone-100"></div>
          </div>
          
          <div className="space-y-12">
            {recipe.steps.map((step, index) => (
              <div key={index} className="flex gap-4 sm:gap-8 group">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-stone-900 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg group-hover:bg-orange-500 transition-all duration-300">
                    {index + 1}
                  </div>
                </div>
                <div className="pt-2 pb-8 border-b border-stone-100 w-full group-last:border-0">
                  <h3 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-orange-500 transition-colors">{step.title}</h3>
                  <p className="text-stone-500 leading-relaxed text-base sm:text-lg">{step.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-stone-900 rounded-[40px] p-6 sm:p-10 text-white relative overflow-hidden no-print">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-orange-500 p-3 rounded-2xl"><MessageCircle size={28} className="text-white" /></div>
                <div>
                  <h3 className="text-2xl font-black">Mestre Cucal AI</h3>
                  <p className="text-stone-400 text-sm">Dúvidas? Pergunte ao chef!</p>
                </div>
              </div>
              {aiMessage && (
                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-500 p-2 rounded-xl text-white mt-1"><ChefHat size={18} /></div>
                    <p className="text-stone-100 italic leading-relaxed">{aiMessage}</p>
                  </div>
                </div>
              )}
              <form onSubmit={askChef} className="flex flex-col sm:flex-row gap-3">
                <input type="text" value={userQuestion} onChange={(e) => setUserQuestion(e.target.value)} placeholder="Posso substituir manteiga por óleo?" className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-500 transition-all outline-none" />
                <button type="submit" disabled={aiLoading} className="bg-orange-500 hover:bg-orange-600 disabled:bg-stone-700 p-4 rounded-2xl transition-all shadow-xl flex items-center justify-center sm:min-w-[60px]">
                  {aiLoading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                </button>
              </form>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
