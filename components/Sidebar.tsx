
import React from 'react';
import { AppConfig } from '../types.ts';

interface SidebarProps {
  config: AppConfig;
  categories: string[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  onAddProject: () => void;
  onHome: () => void;
  onOpenSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ config, categories, activeCategory, onSelectCategory, onAddProject, onHome, onOpenSettings }) => {
  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full transition-colors duration-300">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h1 
          className="text-xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400 cursor-pointer flex items-center gap-3"
          onClick={onHome}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-[12px] font-black overflow-hidden shrink-0 transition-transform hover:scale-105 active:scale-95 ${config.logoUrl ? '' : 'bg-indigo-600 dark:bg-indigo-500 shadow-lg shadow-indigo-100 dark:shadow-none'}`}>
            {config.logoUrl ? (
              <img src={config.logoUrl} className="w-full h-full object-contain" alt="Logo" />
            ) : (
              config.logoText
            )}
          </div>
          <span className="truncate leading-tight text-lg">{config.title.length > 8 ? config.title.slice(0, 8) + '...' : config.title}</span>
        </h1>
      </div>
      
      <div className="p-4 flex-1">
        <button 
          onClick={onAddProject}
          className="w-full mb-8 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-2 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/></svg>
          新增模板
        </button>

        <nav className="custom-scrollbar overflow-y-auto max-h-[calc(100vh-320px)] pr-1">
          <h2 className="px-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">模板分类</h2>
          <ul className="space-y-1.5">
            {categories.map(cat => (
              <li key={cat}>
                <button
                  onClick={() => onSelectCategory(cat)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl transition-all duration-200 ${
                    activeCategory === cat 
                      ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="p-4 space-y-2 border-t border-slate-100 dark:border-slate-800">
        <button 
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all text-sm font-semibold active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          模板库设置
        </button>
        
        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-2 ring-white dark:ring-slate-800">
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100" alt="Avatar" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate dark:text-slate-100">管理员</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate uppercase tracking-widest">{config.logoText}·PROFESSIONAL</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
