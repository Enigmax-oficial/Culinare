
import React, { useState } from 'react';
import { X, Plus, Trash2, Save, ChefHat, Image as ImageIcon } from 'lucide-react';
import { Recipe, Ingredient, Step } from '../types';

interface CreateRecipeProps {
  onClose: () => void;
  onSave: (recipe: Partial<Recipe>) => void;
  loading: boolean;
}

export const CreateRecipe: React.FC<CreateRecipeProps> = ({ onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Almoço/Jantar',
    difficulty: 'Fácil',
    prepTime: 20,
    cookTime: 30,
    calories: 450,
    image: '',
  });

  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: '', amount: 1, unit: 'unid.' }]);
  const [steps, setSteps] = useState<Step[]>([{ title: 'Preparo', text: '' }]);

  const addIngredient = () => setIngredients([...ingredients, { name: '', amount: 1, unit: 'unid.' }]);
  const removeIngredient = (idx: number) => setIngredients(ingredients.filter((_, i) => i !== idx));

  const addStep = () => setSteps([...steps, { title: `Passo ${steps.length + 1}`, text: '' }]);
  const removeStep = (idx: number) => setSteps(steps.filter((_, i) => i !== idx));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      ingredients,
      steps,
      rating: 5.0,
      reviews: 0,
      tags: [formData.category, formData.difficulty]
    });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-lg animate-in fade-in">
      <div className="bg-white w-full max-w-4xl h-[90vh] rounded-[40px] overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom-8">
        <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-xl text-white">
              <ChefHat size={24} />
            </div>
            <h2 className="text-2xl font-black text-stone-900 uppercase tracking-tight">Publicar Receita</h2>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-900 transition-colors"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 sm:p-12 space-y-12">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Título da Receita</label>
                <input required type="text" placeholder="Ex: Risoto de Cogumelos" className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Descrição</label>
                <textarea rows={3} placeholder="Conte um pouco sobre essa delícia..." className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Link da Imagem</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                  <input required type="url" placeholder="https://..." className="w-full bg-stone-50 border border-stone-100 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                 <div>
                   <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Categoria</label>
                   <select className="w-full bg-stone-50 border border-stone-100 rounded-xl px-2 py-3 text-xs font-bold" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                     <option>Café da Manhã</option>
                     <option>Almoço/Jantar</option>
                     <option>Sobremesas</option>
                     <option>Lanches</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Dificuldade</label>
                   <select className="w-full bg-stone-50 border border-stone-100 rounded-xl px-2 py-3 text-xs font-bold" value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})}>
                     <option>Fácil</option>
                     <option>Média</option>
                     <option>Difícil</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">KCal</label>
                   <input type="number" className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-xs font-bold" value={formData.calories} onChange={e => setFormData({...formData, calories: Number(e.target.value)})} />
                 </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-stone-900 uppercase tracking-tight">Ingredientes</h3>
              <button type="button" onClick={addIngredient} className="text-orange-600 font-black text-xs uppercase flex items-center gap-1 hover:text-orange-700"><Plus size={16}/> Adicionar</button>
            </div>
            <div className="space-y-4">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <input placeholder="Qtd" type="number" className="w-20 bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 font-bold text-center" value={ing.amount} onChange={e => {
                    const newIng = [...ingredients];
                    newIng[idx].amount = Number(e.target.value);
                    setIngredients(newIng);
                  }} />
                  <input placeholder="Unidade" className="w-32 bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 font-bold" value={ing.unit} onChange={e => {
                    const newIng = [...ingredients];
                    newIng[idx].unit = e.target.value;
                    setIngredients(newIng);
                  }} />
                  <input placeholder="Nome do ingrediente" className="flex-1 bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 font-bold" value={ing.name} onChange={e => {
                    const newIng = [...ingredients];
                    newIng[idx].name = e.target.value;
                    setIngredients(newIng);
                  }} />
                  <button type="button" onClick={() => removeIngredient(idx)} className="text-stone-300 hover:text-red-500 transition-colors"><Trash2 size={20}/></button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-stone-900 uppercase tracking-tight">Modo de Preparo</h3>
              <button type="button" onClick={addStep} className="text-orange-600 font-black text-xs uppercase flex items-center gap-1 hover:text-orange-700"><Plus size={16}/> Adicionar Passo</button>
            </div>
            <div className="space-y-8">
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-6 items-start">
                  <div className="w-10 h-10 bg-stone-900 text-white rounded-xl flex items-center justify-center font-black flex-shrink-0">{idx + 1}</div>
                  <div className="flex-1 space-y-3">
                    <input placeholder="Título do passo" className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 font-bold text-sm" value={step.title} onChange={e => {
                      const newSteps = [...steps];
                      newSteps[idx].title = e.target.value;
                      setSteps(newSteps);
                    }} />
                    <textarea placeholder="O que fazer?" className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 font-medium text-sm" value={step.text} onChange={e => {
                      const newSteps = [...steps];
                      newSteps[idx].text = e.target.value;
                      setSteps(newSteps);
                    }} />
                  </div>
                  <button type="button" onClick={() => removeStep(idx)} className="text-stone-300 hover:text-red-500 transition-colors mt-2"><Trash2 size={20}/></button>
                </div>
              ))}
            </div>
          </section>
        </form>

        <div className="p-8 bg-stone-50 border-t border-stone-100 flex justify-end gap-4">
          <button onClick={onClose} className="px-8 py-4 text-stone-500 font-black text-sm uppercase">Cancelar</button>
          <button 
            onClick={handleSubmit} disabled={loading}
            className="bg-orange-500 text-white px-12 py-4 rounded-2xl font-black text-sm uppercase shadow-xl hover:bg-orange-600 transition-all flex items-center gap-2"
          >
            {loading ? <Plus className="animate-spin" /> : <Save size={18} />}
            Salvar na Minha Coleção
          </button>
        </div>
      </div>
    </div>
  );
};
