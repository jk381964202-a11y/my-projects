import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- 1. 类型与配置 ---

enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

interface ProjectMedia {
  id: string;
  type: MediaType;
  url: string;
  caption?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  client: string;
  category: string;
  thumbnail: string;
  media: ProjectMedia[];
  createdAt: number;
  backgroundVideoUrl?: string;
}

interface AppConfig {
  title: string;
  logoText: string;
  logoUrl?: string;
  theme: 'light' | 'dark';
  password?: string;
}

const STORAGE_KEY = 'sl_projects_data_v4';
const CONFIG_KEY = 'sl_app_config_v4';
const DEFAULT_PASS = '0701';

// --- 2. UI 组件 ---

const Sidebar = ({ config, categories, activeCategory, onSelectCategory, onAddProject, onHome, onOpenSettings }) => (
  <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full shrink-0 transition-colors duration-300 print:hidden">
    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
      <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer flex items-center gap-3" onClick={onHome}>
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-[12px] font-black shadow-lg">
          {config.logoText}
        </div>
        <span className="truncate leading-tight text-lg">{config.title.slice(0, 10)}</span>
      </h1>
    </div>
    <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
      <button onClick={onAddProject} className="w-full mb-8 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-indigo-100">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/></svg>
        新增模板
      </button>
      <nav className="space-y-1.5">
        <h2 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">资产分类</h2>
        {categories.map(cat => (
          <button key={cat} onClick={() => onSelectCategory(cat)} 
            className={`w-full text-left px-4 py-2.5 rounded-xl transition-all ${activeCategory === cat ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
            {cat}
          </button>
        ))}
      </nav>
    </div>
    <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
      <button onClick={onOpenSettings} className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-sm font-bold">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        系统设置
      </button>
      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold dark:text-white">管理员</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Pro Admin</p>
          </div>
      </div>
    </div>
  </aside>
);

const ProjectGrid = ({ title, projects, onEdit, onView, onDelete }) => (
  <div className="p-8 max-w-7xl mx-auto">
    <header className="mb-12">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">{title}</h1>
      <p className="text-slate-500 dark:text-slate-400">展示并管理您的数字孪生可视化资产库。</p>
    </header>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map(p => (
        <div key={p.id} className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-2xl transition-all duration-500">
          <div className="aspect-[4/3] relative cursor-pointer overflow-hidden" onClick={() => onView(p.id)}>
            <img src={p.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={p.title} />
            <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="bg-white/90 backdrop-blur px-6 py-2 rounded-full text-sm font-bold shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform">预览资产</span>
            </div>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded">{p.category}</span>
              <div className="flex gap-2">
                <button onClick={() => onEdit(p.id)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
                <button onClick={() => onDelete(p.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v2m-3 7h12"/></svg></button>
              </div>
            </div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-white truncate">{p.title}</h3>
            <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">{p.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PasswordModal = ({ onConfirm, onCancel, title = "权限验证" }) => {
  const [pass, setPass] = useState('');
  return (
    <div className="fixed inset-0 z-[600] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100 dark:border-slate-800 text-center">
        <h3 className="text-xl font-bold mb-2 dark:text-white">{title}</h3>
        <p className="text-sm text-slate-500 mb-6">请输入管理员密码以继续操作。</p>
        <form onSubmit={(e) => { e.preventDefault(); onConfirm(pass); }}>
          <input autoFocus type="password" value={pass} onChange={(e) => setPass(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white mb-6"
            placeholder="请输入密码..." />
          <div className="flex gap-3">
            <button type="button" onClick={onCancel} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl">取消</button>
            <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100">确认</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const App = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [config, setConfig] = useState<AppConfig>({ title: '数峦云交付库', logoText: 'SL', theme: 'light', password: DEFAULT_PASS });
  const [view, setView] = useState<'grid' | 'edit' | 'view'>('grid');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{type: 'edit' | 'add' | 'delete' | 'settings', id: string | null} | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const savedConfig = localStorage.getItem(CONFIG_KEY);
    if (savedConfig) setConfig(JSON.parse(savedConfig));
    const savedProjects = localStorage.getItem(STORAGE_KEY);
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      const demo: Project[] = [{
        id: '1', title: '智慧城市 3D 可视化系统', client: '数峦科技', category: '数字孪生',
        description: '基于 WebGL 的大尺度城市级别数字孪生平台。集成了交通流分析、热力图监测与实时监控接入。',
        thumbnail: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800',
        media: [{ id: 'm1', type: MediaType.IMAGE, url: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1200' }],
        createdAt: Date.now()
      }];
      setProjects(demo);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
    }
  }, []);

  useEffect(() => {
    if (config.theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [config.theme]);

  const categories = useMemo(() => ['全部', ...Array.from(new Set(projects.map(p => p.category)))], [projects]);
  const filteredProjects = useMemo(() => activeCategory === '全部' ? projects : projects.filter(p => p.category === activeCategory), [projects, activeCategory]);

  const handlePasswordConfirm = (pass: string) => {
    if (pass === (config.password || DEFAULT_PASS)) {
      setIsPasswordModalOpen(false);
      if (pendingAction?.type === 'add') { setSelectedId(null); setView('edit'); }
      else if (pendingAction?.type === 'edit') { setSelectedId(pendingAction.id); setView('edit'); }
      else if (pendingAction?.type === 'settings') { setIsSettingsOpen(true); }
      else if (pendingAction?.type === 'delete' && pendingAction.id) {
        const updated = projects.filter(p => p.id !== pendingAction.id);
        setProjects(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      setPendingAction(null);
    } else {
      alert('密码错误');
    }
  };

  const currentProject = useMemo(() => projects.find(p => p.id === selectedId), [projects, selectedId]);

  return (
    <div className={`flex h-screen overflow-hidden ${config.theme === 'dark' ? 'dark' : ''}`}>
      <Sidebar 
        config={config} categories={categories} activeCategory={activeCategory} 
        onSelectCategory={setActiveCategory} onHome={() => setView('grid')}
        onAddProject={() => { setPendingAction({type: 'add', id: null}); setIsPasswordModalOpen(true); }}
        onOpenSettings={() => { setPendingAction({type: 'settings', id: null}); setIsPasswordModalOpen(true); }}
      />
      
      <main className="flex-1 bg-slate-50 dark:bg-slate-950 overflow-y-auto relative custom-scrollbar">
        {view === 'grid' && (
          <ProjectGrid title={config.title} projects={filteredProjects} 
            onView={id => { setSelectedId(id); setView('view'); }} 
            onEdit={id => { setPendingAction({type: 'edit', id}); setIsPasswordModalOpen(true); }}
            onDelete={id => { setPendingAction({type: 'delete', id}); setIsPasswordModalOpen(true); }}
          />
        )}

        {view === 'view' && currentProject && (
          <div className="p-8 max-w-6xl mx-auto pb-32 animate-in fade-in duration-500">
             <button onClick={() => setView('grid')} className="mb-10 flex items-center gap-2 text-indigo-600 font-bold hover:-translate-x-1 transition-transform print-hidden">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
                返回资产库
             </button>
             <header className="mb-16">
               <span className="text-xs font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">{currentProject.category}</span>
               <h1 className="text-5xl font-black mt-4 mb-6 dark:text-white leading-tight">{currentProject.title}</h1>
               <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl font-medium">{currentProject.description}</p>
             </header>
             <div className="grid gap-16">
                {currentProject.media.map(m => (
                  <div key={m.id} className="rounded-[40px] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-2">
                    {m.type === MediaType.VIDEO ? (
                      <video controls src={m.url} className="w-full rounded-[34px]" />
                    ) : (
                      <img src={m.url} className="w-full h-auto rounded-[34px]" alt={currentProject.title} />
                    )}
                  </div>
                ))}
             </div>
          </div>
        )}

        {view === 'edit' && (
          <div className="p-12 max-w-4xl mx-auto mt-8 bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-800 mb-20 animate-in slide-in-from-bottom-8 duration-500">
            <h2 className="text-3xl font-black mb-10 dark:text-white">{selectedId ? '编辑交付项目' : '创建新模板'}</h2>
            <div className="space-y-8">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">项目标题</label>
                <input id="in-title" className="w-full p-4 border-2 border-slate-50 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:border-indigo-500" defaultValue={currentProject?.title} />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">分类</label>
                  <input id="in-cat" className="w-full p-4 border-2 border-slate-50 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white" defaultValue={currentProject?.category || '数字孪生'} />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">主图 URL</label>
                  <input id="in-thumb" className="w-full p-4 border-2 border-slate-50 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white" defaultValue={currentProject?.thumbnail} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">详细介绍</label>
                <textarea id="in-desc" rows={6} className="w-full p-4 border-2 border-slate-50 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white" defaultValue={currentProject?.description} />
              </div>
              <div className="flex gap-4 pt-8 border-t border-slate-50">
                <button onClick={() => setView('grid')} className="px-8 py-4 font-bold text-slate-400 hover:text-slate-600">取消</button>
                <button onClick={() => {
                  const titleInput = document.getElementById('in-title') as HTMLInputElement;
                  const categoryInput = document.getElementById('in-cat') as HTMLInputElement;
                  const thumbnailInput = document.getElementById('in-thumb') as HTMLInputElement;
                  const descriptionInput = document.getElementById('in-desc') as HTMLTextAreaElement;
                  
                  if(!titleInput.value || !thumbnailInput.value) return alert('信息不完整');
                  const updated: Project = {
                    id: selectedId || Date.now().toString(),
                    title: titleInput.value,
                    category: categoryInput.value,
                    thumbnail: thumbnailInput.value,
                    description: descriptionInput.value,
                    client: '数峦科技', createdAt: Date.now(),
                    media: currentProject?.media || [{id: 'm1', type: MediaType.IMAGE, url: thumbnailInput.value}]
                  };
                  const all = projects.some(p => p.id === updated.id) ? projects.map(p => p.id === updated.id ? updated : p) : [updated, ...projects];
                  setProjects(all);
                  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
                  setView('grid');
                }} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl active:scale-95">保存并发布资产</button>
              </div>
            </div>
          </div>
        )}
      </main>

      {isPasswordModalOpen && <PasswordModal onConfirm={handlePasswordConfirm} onCancel={() => setIsPasswordModalOpen(false)} />}
      
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[500] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 max-w-md w-full shadow-2xl">
              <h2 className="text-2xl font-black mb-8 dark:text-white">全局设置</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">站点大标题</label>
                  <input id="set-title" className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white" defaultValue={config.title} />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">管理密码</label>
                  <input id="set-pass" type="password" className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white" defaultValue={config.password} />
                </div>
                <div className="flex gap-4 pt-6">
                   <button onClick={() => setIsSettingsOpen(false)} className="px-6 py-3 text-slate-400 font-bold">取消</button>
                   <button onClick={() => {
                     const titleInput = document.getElementById('set-title') as HTMLInputElement;
                     const passInput = document.getElementById('set-pass') as HTMLInputElement;
                     const newConfig = { ...config, title: titleInput.value, password: passInput.value };
                     setConfig(newConfig);
                     localStorage.setItem(CONFIG_KEY, JSON.stringify(newConfig));
                     setIsSettingsOpen(false);
                   }} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg">保存</button>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// --- 5. 渲染入口 ---

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(<App />);
}
