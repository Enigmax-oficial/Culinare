import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { api } from './services/api';
import { Recipe, User } from './types';
import { Loader2 } from 'lucide-react';

const Home = React.lazy(() => import('./components/Home').then(m => ({ default: m.Home })));
const RecipeView = React.lazy(() => import('./components/RecipeView').then(m => ({ default: m.RecipeView })));
const Auth = React.lazy(() => import('./components/Auth').then(m => ({ default: m.Auth })));
const Profile = React.lazy(() => import('./components/Profile').then(m => ({ default: m.Profile })));
const Playlists = React.lazy(() => import('./components/Playlists').then(m => ({ default: m.Playlists })));
const CreateRecipe = React.lazy(() => import('./components/CreateRecipe').then(m => ({ default: m.CreateRecipe })));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-24">
    <Loader2 className="animate-spin text-orange-500" size={40} />
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

  // Função para sincronizar hash com estado
  const syncHashWithView = (hash: string = window.location.hash, recipesData: Recipe[]) => {
    if (hash.startsWith('#recipe/')) {
      const recipeId = hash.substring(8);
      const recipeExists = recipesData.some(r => r.id === recipeId);
      if (!recipeExists) {
        console.warn(`Receita ${recipeId} não encontrada`);
        setView('home');
        setSelectedRecipeId(null);
        window.location.hash = '';
        return;
      }
      setSelectedRecipeId(recipeId);
      setView('recipe');
    } else if (hash === '#profile') {
      setView('profile');
      setSelectedRecipeId(null);
    } else if (hash === '#playlists') {
      setView('playlists');
      setSelectedRecipeId(null);
    } else {
      setView('home');
      setSelectedRecipeId(null);
    }
  };

  // Carregar dados no init
  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getRecipes();
        setRecipes(data);
        setFilteredRecipes(data);
        
        const userStr = localStorage.getItem('chef_current_user_v2');
        if (userStr) {
          try {
            setUser(JSON.parse(userStr));
          } catch (e) {
            console.error(e);
          }
        }
        
        // Sincronizar com hash atual após carregar dados
        const hash = window.location.hash;
        syncHashWithView(hash, data);
        setLoading(false);
      } catch (e) {
        console.error('Erro ao carregar dados:', e);
        setLoading(false);
      }
    };
    load();
  }, []);

  // Listener para mudanças de hash
  useEffect(() => {
    const handleHashChange = () => {
      syncHashWithView();
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [syncHashWithView]);

  const handleSelectRecipe = (id: string) => {
    const recipe = recipes.find(r => r.id === id);
    if (recipe) {
      window.location.hash = `recipe/${id}`;
    } else {
      console.warn(`Receita ${id} não encontrada`);
    }
  };

  const handleBackHome = () => {
    window.location.hash = '';
    window.scrollTo(0, 0);
  };

  const handleFilter = (cat: string | null) => {
    setActiveCategory(cat);
    window.location.hash = '';
    window.scrollTo(0, 0);
    
    if (!cat) {
      setFilteredRecipes(recipes);
    } else if (cat === 'popular') {
      setFilteredRecipes([...recipes].sort((a, b) => b.rating - a.rating));
    } else {
      setFilteredRecipes(recipes.filter(r => r.category === cat));
    }
  };

  const handleLoginSuccess = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('chef_current_user_v2', JSON.stringify(newUser));
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('chef_current_user_v2');
    window.location.hash = '';
    setView('home');
  };

  const handleSaveRecipe = async (recipe: Partial<Recipe>) => {
    if (!user) return;
    setSubmittingRecipe(true);
    try {
      const saved = await api.createRecipe({ ...recipe, authorId: user.id });
      const newRecipes = [saved, ...recipes];
      setRecipes(newRecipes);
      setFilteredRecipes(newRecipes);
      setIsCreateOpen(false);
      handleSelectRecipe(saved.id);
    } catch (e) {
      console.error(e);
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

  if (loading) return <LoadingSpinner />;

  const activeRecipe = recipes.find(r => r.id === selectedRecipeId);

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenCreate={user ? () => setIsCreateOpen(true) : () => setIsAuthOpen(true)}
        activeView={view}
        onNavigate={(v) => {
          if (v === 'home') {
            window.location.hash = '';
          } else if (v === 'profile') {
            window.location.hash = 'profile';
          } else if (v === 'playlists') {
            window.location.hash = 'playlists';
          }
          window.scrollTo(0, 0);
        }}
        onFilterCategory={handleFilter}
      />

      <main>
        <React.Suspense fallback={<LoadingSpinner />}>
          {view === 'home' && (
            <>
              {activeCategory && (
                <div className="max-w-7xl mx-auto px-4 mt-8">
                  <div className="text-sm font-bold text-orange-500 bg-orange-50 w-fit px-4 py-2 rounded-full">
                    Filtro: {activeCategory === 'popular' ? 'Populares' : activeCategory}
                  </div>
                </div>
              )}
              <Home recipes={filteredRecipes} user={user} onSelectRecipe={handleSelectRecipe} onOpenAuth={() => setIsAuthOpen(true)} />
            </>
          )}

          {view === 'recipe' && activeRecipe && (
            <div>
              <div className="max-w-5xl mx-auto px-4 py-8">
                <button onClick={handleBackHome} className="text-sm font-bold text-orange-500">← Voltar</button>
              </div>
              <RecipeView recipe={activeRecipe} user={user} onRefreshUser={handleRefreshUser} />
            </div>
          )}

          {view === 'profile' && (user ? <Profile user={user} onLogout={handleLogout} /> : <div className="text-center py-20"><p>Faça login</p></div>)}

          {view === 'playlists' && (user ? <Playlists user={user} recipes={recipes} /> : <div className="text-center py-20"><p>Faça login</p></div>)}
        </React.Suspense>
      </main>

      {isAuthOpen && <Auth onClose={() => setIsAuthOpen(false)} onLoginSuccess={handleLoginSuccess} />}
      {isCreateOpen && user && <CreateRecipe onClose={() => setIsCreateOpen(false)} onSave={handleSaveRecipe} loading={submittingRecipe} />}
    </div>
  );
}
