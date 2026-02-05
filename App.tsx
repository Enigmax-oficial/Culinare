
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { api } from './services/api';
import { Recipe, User } from './types';
import { Loader2, Database, ShieldCheck, Zap, Server, Shield, Lock } from 'lucide-react';

const Home = lazy(() => import('./components/Home').then(m => ({ default: m.Home })));
const RecipeView = lazy(() => import('./components/RecipeView').then(m => ({ default: m.RecipeView })));
const Auth = lazy(() => import('./components/Auth').then(m => ({ default: m.Auth })));
const Profile = lazy(() => import('./components/Profile').then(m => ({ default: m.Profile })));
const Playlists = lazy(() => import('./components/Playlists').then(m => ({ default: m.Playlists })));
const CreateRecipe = lazy(() => import('./components/CreateRecipe').then(m => ({ default: m.CreateRecipe })));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-24 animate-pulse">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="animate-spin text-orange-500" size={40} />
      <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">Preparando sua Cozinha...</span>
    </div>
  </div>
);

export default function App() {
  const [view, setView] = useState<'home' | 'recipe' | 'profile' | 'playlists'>('home');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submittingRecipe, setSubmittingRecipe] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const data = await api.getRecipes();
      setRecipes(data);
      setFilteredRecipes(data);
      
      const storedUserStr = localStorage.getItem('chef_current_user_v2');
      if (storedUserStr) {
        try {
          const storedUser = JSON.parse(storedUserStr);
          setUser(storedUser);
        } catch (e) {
          console.error("Falha ao recuperar sessão local");
        }
      }
      
      // Verificar URL hash para navegação
      const hash = window.location.hash;
      if (hash.startsWith('#recipe/')) {
        const recipeId = hash.substring(8);
        setSelectedRecipeId(recipeId);
        setView('recipe');
      } else if (hash === '#profile') {
        setView('profile');
      } else if (hash === '#playlists') {
        setView('playlists');
      }
      
      setLoading(false);
    };
    init();
  }, []);

  const handleFilter = (cat: string | null) => {
    setActiveCategory(cat);
    setView('home');
    window.location.hash = '';
    if (!cat) {
      setFilteredRecipes(recipes);
    } else if (cat === 'popular') {
      setFilteredRecipes([...recipes].sort((a, b) => b.rating - a.rating));
    } else {
      setFilteredRecipes(recipes.filter(r => r.category === cat));
    }
  };

  const handleSelectRecipe = (id: string) => {
    setSelectedRecipeId(id);
    setView('recipe');
    window.location.hash = `recipe/${id}`;
    window.scrollTo(0, 0);
  };

  const handleLoginSuccess = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('chef_current_user_v2', JSON.stringify(newUser));
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('chef_current_user_v2');
    setView('home');
  };

  const handleSaveRecipe = async (recipe: Partial<Recipe>) => {
    if (!user) return;
    setSubmittingRecipe(true);
    try {
      const saved = await api.createRecipe({ ...recipe, authorId: user.id });
      setRecipes([saved, ...recipes]);
      setFilteredRecipes([saved, ...filteredRecipes]);
      setIsCreateOpen(false);
      handleSelectRecipe(saved.id);
    } finally {
      setSubmittingRecipe(false);
    }
  };

  const handleRefreshUser = async () => {
    if (user) {
      const updated = await api.login(user.email);
      if (updated) {
        setUser(updated);
        localStorage.setItem('chef_current_user_v2', JSON.stringify(updated));
      }
    }
  };

  const activeRecipe = recipes.find(r => r.id === selectedRecipeId);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50">
        <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
        <span className="font-black text-[10px] uppercase tracking-widest text-stone-400">ChefEmCasa Pro</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 selection:bg-orange-100 selection:text-orange-900">
      <Navbar 
        user={user} 
        onOpenAuth={() => setIsAuthOpen(true)} 
        onLogout={handleLogout}
        onOpenCreate={() => setIsCreateOpen(true)}
        activeView={view}
        onNavigate={(v) => {
          setView(v as any);
          if (v === 'home') {
            setSelectedRecipeId(null);
            setActiveCategory(null);
            setFilteredRecipes(recipes);
          }
        }}
        onFilterCategory={handleFilter}
      />

      <main className="min-h-[70vh]">
        <Suspense fallback={<LoadingSpinner />}>
          {view === 'home' && (
            <div className="animate-in fade-in duration-500">
              {activeCategory && (
                <div className="max-w-7xl mx-auto px-4 mt-8">
                  <div className="flex items-center gap-2 text-sm font-bold text-orange-500 bg-orange-50 w-fit px-4 py-2 rounded-full uppercase tracking-widest">
                    Filtro: {activeCategory === 'popular' ? 'Mais Populares' : activeCategory}
                  </div>
                </div>
              )}
              <Home 
                recipes={filteredRecipes} 
                user={user} 
                onSelectRecipe={handleSelectRecipe}
                onOpenAuth={() => setIsAuthOpen(true)}
              />
            </div>
          )}

          {view === 'recipe' && activeRecipe && (
            <div className="animate-in slide-in-from-right-8 duration-500">
              <RecipeView 
                recipe={activeRecipe} 
                user={user} 
                onRefreshUser={handleRefreshUser}
              />
            </div>
          )}

          {view === 'profile' && user && (
            <Profile 
              user={user} 
              onLogout={handleLogout} 
              onBack={() => setView('home')} 
              favoriteCount={user.favorites.length}
            />
          )}

          {view === 'playlists' && user && (
            <Playlists 
              user={user} 
              recipes={recipes} 
              onSelectRecipe={handleSelectRecipe}
              onBack={() => setView('home')}
            />
          )}
        </Suspense>
      </main>

      <Suspense fallback={null}>
        {isAuthOpen && (
          <Auth 
            onClose={() => setIsAuthOpen(false)} 
            onLoginSuccess={handleLoginSuccess} 
          />
        )}

        {isCreateOpen && (
          <CreateRecipe 
            onClose={() => setIsCreateOpen(false)}
            onSave={handleSaveRecipe}
            loading={submittingRecipe}
          />
        )}
      </Suspense>

      <footer className="bg-stone-900 text-stone-400 py-28 mt-20 no-print overflow-hidden relative">
        {/* Glow Backgrounds */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]"></div>

        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 relative z-10 pt-12">
            <div className="col-span-1 md:col-span-2">
              <span className="font-extrabold text-4xl tracking-tighter text-white block mb-8">
                Chef<span className="text-orange-500">EmCasa</span>
                <span className="text-stone-700 ml-3 font-black text-sm uppercase tracking-tighter">Pro</span>
              </span>
              <p className="max-w-md leading-relaxed text-stone-400 text-xl font-medium">
                Sua central gastronômica privativa e ultra-veloz. 
                Desenvolvida por <span className="text-white">Enigmax-oficial</span> para rodar 100% no seu navegador.
              </p>
            </div>
            <div>
              <p className="font-black text-white text-[11px] uppercase tracking-[0.4em] mb-10 border-b border-white/5 pb-2 w-fit">Explorar</p>
              <ul className="space-y-5 text-sm font-bold">
                <li><button onClick={() => setView('home')} className="hover:text-orange-500 transition-all hover:translate-x-1 inline-block">Home</button></li>
                <li><button onClick={() => setView('playlists')} className="hover:text-orange-500 transition-all hover:translate-x-1 inline-block">Minhas Playlists</button></li>
                <li><button onClick={() => setIsAuthOpen(true)} className="hover:text-orange-500 transition-all hover:translate-x-1 inline-block">Sincronização Local</button></li>
              </ul>
            </div>
            <div>
              <p className="font-black text-white text-[11px] uppercase tracking-[0.4em] mb-10 border-b border-white/5 pb-2 w-fit">Deployment</p>
              <ul className="space-y-5 text-sm font-bold">
                <li className="flex items-center gap-4 text-stone-300"><Server size={18} className="text-blue-500" /> GitHub Pages Pro</li>
                <li className="flex items-center gap-4 text-stone-300"><ShieldCheck size={18} className="text-green-500" /> AES-256 Browser Cache</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-32 pt-14 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex flex-col gap-2 text-center md:text-left">
              <p className="text-[11px] uppercase tracking-[0.5em] font-black text-stone-600">
                © 2024 CULINARE • OPTIMIZED STATIC BUILD
              </p>
              <p className="text-[10px] text-stone-700 uppercase tracking-[0.2em] font-bold">
                Repository: Enigmax-oficial/Culinare • Release v2.5.0
              </p>
            </div>
            <div className="flex gap-6 items-center">
              <div className="h-1 w-16 bg-stone-800 rounded-full"></div>
              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-stone-600 border border-white/5">
                <Zap size={16} />
              </div>
              <div className="h-1 w-16 bg-stone-800 rounded-full"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
