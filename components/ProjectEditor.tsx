
import React, { useState, useRef } from 'react';
import { Project, MediaType, ProjectMedia } from '../types.ts';

interface ProjectEditorProps {
  project?: Project;
  onSave: (p: Project) => void;
  onCancel: () => void;
}

const ProjectEditor: React.FC<ProjectEditorProps> = ({ project, onSave, onCancel }) => {
  const [title, setTitle] = useState(project?.title || '');
  const [client, setClient] = useState(project?.client || '');
  const [category, setCategory] = useState(project?.category || '品牌设计');
  const [description, setDescription] = useState(project?.description || '');
  const [thumbnail, setThumbnail] = useState(project?.thumbnail || 'https://images.unsplash.com/photo-1541462608141-ad8557b6857f?auto=format&fit=crop&q=80&w=800&h=600');
  const [backgroundVideoUrl, setBackgroundVideoUrl] = useState(project?.backgroundVideoUrl || '');
  const [media, setMedia] = useState<ProjectMedia[]>(project?.media || []);

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const bgVideoInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'thumbnail' | 'bgVideo' | 'media') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (type === 'thumbnail') {
          setThumbnail(base64);
        } else if (type === 'bgVideo') {
          setBackgroundVideoUrl(base64);
        } else {
          const newMedia: ProjectMedia = {
            id: Math.random().toString(36).substr(2, 9),
            type: file.type.startsWith('video') ? MediaType.VIDEO : MediaType.IMAGE,
            url: base64,
            caption: ''
          };
          setMedia([...media, newMedia]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = (id: string) => {
    setMedia(media.filter(m => m.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return alert('请输入项目标题');
    const updatedProject: Project = {
      id: project?.id || Math.random().toString(36).substr(2, 9),
      title,
      client,
      category,
      description,
      thumbnail,
      backgroundVideoUrl,
      media,
      createdAt: project?.createdAt || Date.now()
    };
    onSave(updatedProject);
  };

  return (
    <div className="max-w-4xl mx-auto p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold dark:text-white">{project ? '编辑项目模板' : '创建新模板'}</h2>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-transform active:scale-90">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">项目标题</label>
              <input 
                value={title} onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                placeholder="例如：智慧城市 3D 可视化大屏"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">客户/公司名称</label>
              <input 
                value={client} onChange={e => setClient(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                placeholder="例如：数峦云科技"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">作品分类</label>
              <select 
                value={category} onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
              >
                <option>品牌设计</option>
                <option>UI/UX 设计</option>
                <option>3D 设计</option>
                <option>动效设计</option>
                <option>数字孪生</option>
                <option>可视化大屏</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">列表封面图</label>
              <div 
                className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition-colors group cursor-pointer"
                onClick={() => thumbnailInputRef.current?.click()}
              >
                <img src={thumbnail} className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" alt="预览" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="bg-white dark:bg-slate-700 px-4 py-2 rounded-lg text-sm font-semibold shadow-lg transition-transform group-hover:scale-110 dark:text-white">上传封面</span>
                </div>
                <input type="file" ref={thumbnailInputRef} onChange={e => handleFileUpload(e, 'thumbnail')} className="hidden" accept="image/*" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">详情页动态背景视频 (可选)</label>
              <div 
                className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition-colors group cursor-pointer"
                onClick={() => bgVideoInputRef.current?.click()}
              >
                {backgroundVideoUrl ? (
                  <video className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" src={backgroundVideoUrl} muted loop autoPlay />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                    <span className="text-xs">点击上传背景视频</span>
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                   <span className="bg-white dark:bg-slate-700 px-4 py-2 rounded-lg text-sm font-semibold shadow-lg dark:text-white">更改背景</span>
                </div>
                <input type="file" ref={bgVideoInputRef} onChange={e => handleFileUpload(e, 'bgVideo')} className="hidden" accept="video/*" />
              </div>
              {backgroundVideoUrl && (
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setBackgroundVideoUrl(''); }}
                  className="mt-2 text-xs text-red-500 font-bold hover:underline"
                >
                  移除视频背景
                </button>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">项目详细描述</label>
          <textarea 
            rows={6}
            value={description} onChange={e => setDescription(e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
            placeholder="请输入项目的详细介绍、设计理念或技术实现..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">项目素材 (展示图 & 演示视频)</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {media.map(m => (
              <div key={m.id} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 group border border-slate-200 dark:border-slate-700">
                {m.type === MediaType.VIDEO ? (
                   <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-white gap-2">
                     <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                     <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">视频素材</span>
                   </div>
                ) : (
                  <img src={m.url} className="w-full h-full object-cover" alt="媒体素材" />
                )}
                <button 
                  type="button"
                  onClick={() => removeMedia(m.id)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            ))}
            <button 
              type="button"
              onClick={() => mediaInputRef.current?.click()}
              className="aspect-square flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all text-slate-400 hover:text-indigo-500"
            >
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
              <span className="text-xs font-semibold">添加素材</span>
              <input type="file" ref={mediaInputRef} onChange={e => handleFileUpload(e, 'media')} className="hidden" multiple accept="image/*,video/*" />
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-8 border-t border-slate-100 dark:border-slate-800">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-8 py-3 text-slate-600 dark:text-slate-400 font-semibold hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            取消
          </button>
          <button 
            type="submit"
            className="px-10 py-3 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 dark:shadow-none transition-all active:scale-95"
          >
            保存项目
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectEditor;
