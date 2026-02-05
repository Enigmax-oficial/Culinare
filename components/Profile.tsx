
import React from 'react';
import { 
  User as UserIcon, Mail, ShieldCheck, Calendar, 
  Award, ArrowLeft, LogOut, CheckCircle2, Download, Upload, Database
} from 'lucide-react';
import { User } from '../types';

interface ProfileProps {
  user: User;
  onLogout: () => void;
  onBack: () => void;
  favoriteCount: number;
}

export const Profile: React.FC<ProfileProps> = ({ user, onLogout, onBack, favoriteCount }) => {
  
  const handleExportData = () => {
    const data = localStorage.getItem('chefemcasa_db_v2');
    if (!data) return;
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chefemcasa-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        JSON.parse(json); // Validação
        localStorage.setItem('chefemcasa_db_v2', json);
        alert("Dados importados com sucesso! Recarregue a página para ver as mudanças.");
        window.location.reload();
      } catch (err) {
        alert("Arquivo de backup inválido.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-stone-400 hover:text-orange-500 font-bold mb-10 transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Voltar para as Receitas
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-[40px] p-8 border border-stone-100 shadow-xl text-center relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-24 h-24 bg-stone-900 rounded-[32px] flex items-center justify-center text-white text-4xl font-black mx-auto mb-6 shadow-2xl">
                {user.name[0]}
              </div>
              <h2 className="text-2xl font-black text-stone-900 mb-1">{user.name}</h2>
              <div className="flex items-center justify-center gap-1.5 text-orange-500 mb-6">
                <Award size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Membro Pro</span>
              </div>
              
              <button 
                onClick={onLogout}
                className="w-full py-4 rounded-2xl bg-red-50 text-red-500 font-black text-sm hover:bg-red-100 transition-all flex items-center justify-center gap-2"
              >
                <LogOut size={16} /> Sair do Perfil
              </button>
            </div>
          </div>

          <div className="bg-stone-900 rounded-[32px] p-6 text-white space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">Gestão de Dados</p>
            <button 
              onClick={handleExportData}
              className="w-full flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-xs font-bold"
            >
              <Download size={16} className="text-orange-500" /> Exportar Biblioteca
            </button>
            <label className="w-full flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-xs font-bold cursor-pointer">
              <Upload size={16} className="text-blue-500" /> 
              Importar Backup
              <input type="file" className="hidden" accept=".json" onChange={handleImportData} />
            </label>
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-[40px] p-10 border border-stone-100 shadow-sm">
            <h3 className="text-xl font-black text-stone-900 mb-8 flex items-center gap-3">
              Configurações
              <div className="h-px flex-1 bg-stone-50"></div>
            </h3>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-stone-50 rounded-2xl text-stone-400">
                  <UserIcon size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Nome</p>
                  <p className="text-lg font-bold text-stone-900">{user.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="p-4 bg-stone-50 rounded-2xl text-stone-400">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">E-mail</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-stone-900 lowercase">{user.email}</p>
                    {user.isVerified && (
                      <div className="bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 uppercase">
                        <CheckCircle2 size={10} /> Ativo
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="p-4 bg-stone-50 rounded-2xl text-stone-400">
                  <Database size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Privacidade de Dados</p>
                  <p className="text-lg font-bold text-stone-900">Armazenamento 100% Local</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-orange-50 rounded-[32px] p-8 border border-orange-100">
              <p className="text-3xl font-black text-orange-600 mb-1">{favoriteCount}</p>
              <p className="text-xs font-black text-orange-400 uppercase tracking-widest">Favoritos</p>
            </div>
            <div className="bg-stone-50 rounded-[32px] p-8 border border-stone-100">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <ShieldCheck size={20} />
                <p className="text-xl font-black uppercase">Seguro</p>
              </div>
              <p className="text-xs font-black text-stone-400 uppercase tracking-widest">Modo Estático</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
