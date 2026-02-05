
import React from 'react';
import { ChefHat, Search, Menu, X, User as UserIcon, LogOut, Heart, ShoppingBag, CheckCircle2, Settings, PlusSquare } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenCreate: () => void;
  activeView: string;
  onNavigate: (view: string) => void;
  onFilterCategory?: (category: string | null) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onOpenAuth, onLogout, onOpenCreate, activeView, onNavigate, onFilterCategory }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);

  const categories = ["Café da Manhã", "Almoço/Jantar", "Sobremesas", "Lanches"];

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-stone-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { onNavigate('home'); onFilterCategory?.(null); }}>
            <div className="bg-orange-500 p-2.5 rounded-2xl text-white shadow-lg shadow-orange-100 group-hover:scale-105 transition-transform">
              <ChefHat size={26} />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-stone-900 hidden sm:block">
              Chef<span className="text-orange-500">EmCasa</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-stone-500 font-bold text-sm uppercase tracking-wide">
            <button onClick={() => { onNavigate('home'); onFilterCategory?.(null); window.location.hash = ''; }} className={`hover:text-orange-500 transition ${activeView === 'home' ? 'text-orange-500 border-b-2 border-orange-500 pb-1' : ''}`}>Início</button>
            <button onClick={() => { onNavigate('playlists'); window.location.hash = '#playlists'; }} className={`hover:text-orange-500 transition ${activeView === 'playlists' ? 'text-orange-500 border-b-2 border-orange-500 pb-1' : ''}`}>Salvos</button>
            <div className="relative group/cat">
              <button className="hover:text-orange-500 transition">Categorias</button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 hidden group-hover/cat:block">
                <div className="bg-white border border-stone-100 shadow-2xl rounded-2xl p-4 min-w-[200px] grid grid-cols-1 gap-2">
                  {categories.map(c => (
                    <button key={c} onClick={() => { onNavigate('home'); onFilterCategory?.(c); window.location.hash = ''; }} className="text-left px-4 py-2 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors whitespace-nowrap">
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <button onClick={() => setShowSearch(!showSearch)} className="p-2 text-stone-400 hover:text-stone-900 transition-colors">
              <Search size={22} />
            </button>
            
            {user ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={onOpenCreate}
                  className="hidden lg:flex items-center gap-2 bg-stone-50 text-stone-900 border border-stone-200 px-5 py-2.5 rounded-2xl font-black text-xs uppercase hover:bg-stone-900 hover:text-white transition-all shadow-sm"
                >
                  <PlusSquare size={16} /> Enviar Receita
                </button>

                <div className="relative group/user">
                  <div className="relative">
                    <div className="w-10 h-10 bg-stone-900 rounded-2xl flex items-center justify-center text-white font-black shadow-lg cursor-pointer hover:scale-105 transition-transform">
                      {user.name[0]}
                    </div>
                    {user.isVerified && (
                      <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                        <CheckCircle2 size={12} className="text-blue-500 fill-blue-50" />
                      </div>
                    )}
                  </div>
                  
                  <div className="absolute top-full right-0 pt-4 hidden group-hover/user:block w-56 animate-in fade-in slide-in-from-top-2">
                    <div className="bg-white border border-stone-100 shadow-2xl rounded-[32px] overflow-hidden">
                      <div className="p-6 border-b border-stone-50 bg-stone-50/50">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-black text-stone-900 truncate">{user.name}</p>
                          {user.isVerified && <CheckCircle2 size={14} className="text-blue-500" />}
                        </div>
                        {/* FIX: Case-sensitive email */}
                        <p className="text-[10px] text-stone-400 font-bold truncate lowercase">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <button 
                          onClick={() => { onNavigate('profile'); window.location.hash = '#profile'; }}
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-stone-600 hover:bg-orange-50 hover:text-orange-600 rounded-2xl transition-all font-bold"
                        >
                          <Settings size={16} /> Perfil do Chef
                        </button>
                        <button 
                          onClick={() => { onNavigate('playlists'); window.location.hash = '#playlists'; }}
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-stone-600 hover:bg-orange-50 hover:text-orange-600 rounded-2xl transition-all font-bold"
                        >
                          <Heart size={16} /> Playlists
                        </button>
                        <div className="h-px bg-stone-50 my-1 mx-2"></div>
                        <button onClick={onLogout} className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-2xl transition-all font-bold">
                          <LogOut size={16} /> Sair
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <button onClick={onOpenAuth} className="bg-stone-900 text-white px-6 py-3 rounded-2xl text-sm font-black hover:bg-stone-700 transition-all shadow-lg active:scale-95">
                Entrar
              </button>
            )}

            <button className="md:hidden text-stone-600 p-2" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {showSearch && (
        <div className="bg-white border-b border-stone-100 p-4 animate-in slide-in-from-top-4">
          <div className="max-w-3xl mx-auto flex items-center bg-stone-50 rounded-2xl px-6 py-4">
            <Search className="text-stone-400 mr-4" size={20} />
            <input type="text" placeholder="Qual ingrediente você tem na geladeira?" className="bg-transparent border-none outline-none text-lg w-full font-medium" autoFocus />
            <button onClick={() => setShowSearch(false)} className="text-stone-400"><X size={20}/></button>
          </div>
        </div>
      )}
      
      {isOpen && (
        <div className="md:hidden bg-white border-t border-stone-100 p-6 space-y-6 shadow-2xl animate-in slide-in-from-top-8">
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => { onNavigate('home'); setIsOpen(false); }} className="p-4 bg-stone-50 rounded-2xl font-bold text-stone-900 text-center">Início</button>
            <button onClick={() => { onNavigate('playlists'); setIsOpen(false); }} className="p-4 bg-stone-50 rounded-2xl font-bold text-stone-900 text-center">Salvos</button>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-black text-stone-400 uppercase ml-2">Categorias</p>
            {categories.map(c => (
              <button key={c} onClick={() => { onNavigate('home'); onFilterCategory?.(c); setIsOpen(false); }} className="block w-full text-left p-4 hover:bg-orange-50 rounded-2xl font-bold transition-colors">{c}</button>
            ))}
          </div>
          {user && (
            <div className="space-y-3">
              <button onClick={onOpenCreate} className="w-full bg-stone-900 text-white py-4 rounded-2xl font-black">Enviar Nova Receita</button>
              <button onClick={() => { onNavigate('profile'); setIsOpen(false); }} className="w-full flex items-center justify-center gap-3 p-4 border border-stone-100 rounded-2xl font-bold">Configurações</button>
            </div>
          )}
          {!user && (
            <button onClick={onOpenAuth} className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-orange-100">Criar Conta Grátis</button>
          )}
        </div>
      )}
    </nav>
  );
};
