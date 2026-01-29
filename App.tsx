
import React, { useState, useEffect } from 'react';
import { Project, MediaType, ProjectMedia, AppConfig } from './types';
import Sidebar from './components/Sidebar';
import ProjectGrid from './components/ProjectGrid';
import ProjectEditor from './components/ProjectEditor';
import ProjectViewer from './components/ProjectViewer';
import SettingsModal from './components/SettingsModal';
import PasswordModal from './components/PasswordModal';

const STORAGE_KEY = 'showcase_projects_data';
const CONFIG_KEY = 'showcase_app_config';
const DEFAULT_PASS = '0701';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  message: string;
  type: ToastType;
}

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [config, setConfig] = useState<AppConfig>({
    title: '数峦云可视化模板库',
    logoText: 'SL',
    theme: 'light',
    password: DEFAULT_PASS
  });
  const [view, setView] = useState<'grid' | 'edit' | 'view'>('grid');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const [toast, setToast] = useState<Toast | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // 密码弹窗控制
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordAction, setPasswordAction] = useState<{ type: 'edit' | 'delete', id: string | null } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (config.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [config.theme]);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    const savedConfig = localStorage.getItem(CONFIG_KEY);
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        if (!parsed.password) parsed.password = DEFAULT_PASS;
        setConfig(parsed);
      } catch (e) {
        console.error("Failed to parse config", e);
      }
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse storage", e);
      }
    } else {
      const mock: Project[] = [
        {
          id: '1',
          title: 'Arctica 极地品牌视觉系统',
          description: '为一家可持续时尚品牌设计的极简、高对比度品牌标识系统。',
          client: '极地集合 (Arctica Collective)',
          category: '品牌设计',
          thumbnail: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800&h=600',
          media: [
            { id: 'm1', type: MediaType.IMAGE, url: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=1200', caption: 'Logo 应用' }
          ],
          createdAt: Date.now()
        }
      ];
      setProjects(mock);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mock));
    }
  }, []);

  const saveConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
    localStorage.setItem(CONFIG_KEY, JSON.stringify(newConfig));
    showToast('配置已保存');
  };

  const handlePasswordConfirm = (pass: string) => {
    if (pass === config.password) {
      setIsPasswordModalOpen(false);
      if (passwordAction?.type === 'edit') {
        setSelectedProjectId(passwordAction.id);
        setView('edit');
      } else if (passwordAction?.type === 'delete' && passwordAction.id) {
        if (confirm('确定要删除这个项目吗？')) {
          const updated = projects.filter(p => p.id !== passwordAction.id);
          setProjects(updated);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          showToast('项目已成功删除', 'info');
        }
      }
      setPasswordAction(null);
    } else {
      showToast('密码错误', 'error');
    }
  };

  const handleEditRequest = (id: string | null) => {
    if (id !== null) {
      setPasswordAction({ type: 'edit', id });
      setIsPasswordModalOpen(true);
    } else {
      setSelectedProjectId(null);
      setView('edit');
    }
  };

  const handleDeleteProject = (id: string) => {
    setPasswordAction({ type: 'delete', id });
    setIsPasswordModalOpen(true);
  };

  const onSave = (project: Project) => {
    const existingIndex = projects.findIndex(p => p.id === project.id);
    let updated;
    if (existingIndex > -1) {
      updated = [...projects];
      updated[existingIndex] = project;
      showToast('项目更新成功');
    } else {
      updated = [project, ...projects];
      showToast('新项目已创建');
    }
    setProjects(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setView('grid');
  };

  const filteredProjects = activeCategory === '全部' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  const categories = ['全部', ...Array.from(new Set(projects.map(p => p.category)))];

  return (
    <div className="flex h-screen overflow-hidden text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <Sidebar 
        config={config}
        categories={categories} 
        activeCategory={activeCategory} 
        onSelectCategory={setActiveCategory}
        onAddProject={() => handleEditRequest(null)}
        onHome={() => setView('grid')}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      
      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 relative custom-scrollbar transition-colors duration-300">
        {view === 'grid' && (
          <ProjectGrid 
            title={config.title}
            projects={filteredProjects} 
            onEdit={(id) => handleEditRequest(id)} 
            onView={(id) => { setSelectedProjectId(id); setView('view'); }}
            onDelete={handleDeleteProject}
          />
        )}
        
        {view === 'edit' && (
          <ProjectEditor 
            project={projects.find(p => p.id === selectedProjectId)} 
            onSave={onSave}
            onCancel={() => setView('grid')}
          />
        )}

        {view === 'view' && selectedProjectId && (
          <ProjectViewer 
            project={projects.find(p => p.id === selectedProjectId)!}
            onClose={() => setView('grid')}
            onEdit={() => handleEditRequest(selectedProjectId)}
            onNotify={(msg, type) => showToast(msg, type)}
          />
        )}

        {toast && (
          <div className="fixed bottom-8 right-8 z-[200] animate-in slide-in-from-right-10 fade-in duration-300">
            <div className={`glass px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${
              toast.type === 'success' ? 'border-green-100 dark:border-green-900/30' : 
              toast.type === 'error' ? 'border-red-100 dark:border-red-900/30' : 'border-blue-100 dark:border-blue-900/30'
            }`}>
              {toast.type === 'success' && <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">✓</div>}
              {toast.type === 'error' && <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center">✕</div>}
              <p className="font-semibold">{toast.message}</p>
            </div>
          </div>
        )}

        {isSettingsOpen && (
          <SettingsModal 
            config={config} 
            onSave={saveConfig} 
            onClose={() => setIsSettingsOpen(false)} 
          />
        )}

        {isPasswordModalOpen && (
          <PasswordModal 
            onConfirm={handlePasswordConfirm}
            onCancel={() => { setIsPasswordModalOpen(false); setPasswordAction(null); }}
          />
        )}
      </main>
    </div>
  );
};

export default App;
