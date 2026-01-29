
import React, { useState } from 'react';
import { Project, MediaType } from '../types.ts';

interface ProjectViewerProps {
  project: Project;
  onClose: () => void;
  onEdit: () => void;
  onNotify?: (msg: string, type: 'success' | 'error' | 'info') => void;
}

type LayoutMode = 'single' | 'double' | 'gallery';

const ProjectViewer: React.FC<ProjectViewerProps> = ({ project, onClose, onEdit, onNotify }) => {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('single');
  
  // 导出与编辑交互状态
  const [isPreparingExport, setIsPreparingExport] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const startExportWorkflow = () => {
    setIsPreparingExport(true);
    setExportProgress(0);
    
    // 模拟文档准备过程
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleFinalPrint = () => {
    setIsPreparingExport(false);
    if (onNotify) onNotify('正在启动打印程序...', 'info');
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    if (onNotify) onNotify('项目链接已复制到剪贴板', 'success');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getGridClass = () => {
    switch (layoutMode) {
      case 'double': return 'grid-cols-1 md:grid-cols-2 gap-8';
      case 'gallery': return 'grid-cols-1 md:grid-cols-3 gap-6';
      default: return 'grid-cols-1 gap-12';
    }
  };

  return (
    <div className="min-h-full bg-white dark:bg-slate-950 transition-colors duration-300 print:bg-white">
      {/* 顶部固定栏 */}
      <div className="sticky top-0 z-50 glass dark:bg-slate-900/80 border-b border-slate-100 dark:border-slate-800 px-8 py-4 flex flex-wrap justify-between items-center gap-4 print:hidden">
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            返回列表
          </button>
          
          <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
          
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(['single', 'double', 'gallery'] as LayoutMode[]).map((mode) => (
              <button 
                key={mode}
                onClick={() => setLayoutMode(mode)}
                className={`p-1.5 rounded-lg transition-all ${layoutMode === mode ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {mode === 'single' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>}
                {mode === 'double' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h7m-7 6h7m-7 6h7m4-12h7m-7 6h7m-7 6h7"/></svg>}
                {mode === 'gallery' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={startExportWorkflow}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-700 dark:text-slate-300 active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            导出 PDF
          </button>
          <button 
            onClick={() => setShowEditConfirm(true)} 
            className="px-4 py-2 text-sm font-semibold border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all dark:text-slate-300 active:scale-95"
          >
            编辑模板
          </button>
          <button 
            onClick={handleShare}
            className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg shadow-md transition-all active:scale-95 ${isCopied ? 'bg-green-500 text-white' : 'bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700'}`}
          >
            {isCopied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                链接已复制
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                发送给客户
              </>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 pt-16 pb-32 print:pt-0 print:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-24 print:mb-12">
          {/* 大标题和描述区域 */}
          <div className={`lg:col-span-2 relative rounded-3xl overflow-hidden min-h-[400px] flex flex-col justify-end p-10 ${project.backgroundVideoUrl ? 'text-white' : ''}`}>
            {project.backgroundVideoUrl && (
              <>
                <video 
                  className="absolute inset-0 w-full h-full object-cover z-0" 
                  src={project.backgroundVideoUrl} 
                  muted 
                  loop 
                  autoPlay 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
              </>
            )}
            
            <div className="relative z-20">
              <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full mb-6 print:border ${project.backgroundVideoUrl ? 'bg-indigo-500/20 border border-indigo-400/30 text-indigo-200' : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 print:border-indigo-200'}`}>
                {project.category}
              </span>
              <h1 className={`text-5xl font-extrabold mb-8 leading-tight print:text-4xl ${project.backgroundVideoUrl ? 'text-white drop-shadow-lg' : 'text-slate-900 dark:text-white'}`}>
                {project.title}
              </h1>
              <div className={`prose prose-lg max-w-none leading-relaxed print:text-base ${project.backgroundVideoUrl ? 'text-slate-100 drop-shadow' : 'text-slate-600 dark:text-slate-400'}`}>
                {project.description.split('\n').map((para, i) => (
                  <p key={i} className="mb-4">{para}</p>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl h-fit border border-slate-100 dark:border-slate-800 print:bg-white print:border-slate-200">
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">项目客户</p>
                <p className="font-semibold text-slate-900 dark:text-white">{project.client || '数道展示'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">发布年份</p>
                <p className="font-semibold text-slate-900 dark:text-white">{new Date(project.createdAt).getFullYear()}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">关键词</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['极简主义', '数字孪生', '可视化'].map(tag => (
                    <span key={tag} className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-[10px] text-slate-500 dark:text-slate-400">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 媒体展示区域 - 动态布局 */}
        <div className={`grid transition-all duration-500 ease-in-out ${getGridClass()} print:grid-cols-1 print:gap-12`}>
          {project.media.map((item, idx) => (
            <div key={item.id} className="group flex flex-col gap-4 print:break-inside-avoid animate-in fade-in duration-700">
              <div className={`relative rounded-3xl overflow-hidden shadow-2xl shadow-indigo-50/50 dark:shadow-indigo-900/10 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 print:shadow-none print:rounded-xl group ${layoutMode === 'gallery' ? 'rounded-2xl' : ''}`}>
                {item.type === MediaType.VIDEO ? (
                  <video controls className={`w-full h-auto object-contain bg-black ${layoutMode !== 'single' ? 'aspect-video' : 'max-h-[80vh]'}`}>
                    <source src={item.url} type="video/mp4" />
                    您的浏览器不支持视频播放。
                  </video>
                ) : (
                  <img 
                    src={item.url} 
                    alt={item.caption} 
                    className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.03]" 
                  />
                )}
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 px-2">
                <div className="max-w-xl">
                  {item.caption && <p className={`text-slate-500 dark:text-slate-400 font-medium italic ${layoutMode === 'gallery' ? 'text-xs' : 'text-sm'}`}>{item.caption}</p>}
                </div>
                {layoutMode === 'single' && (
                  <div className="text-slate-400 dark:text-slate-600 text-[10px] font-mono tracking-widest uppercase">
                    模板资产 0{idx + 1} / 0{project.media.length}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 导出准备弹窗 (二次确认 + 进度) */}
        {isPreparingExport && (
          <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-8 print:hidden animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 max-md w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100 dark:border-slate-800 text-center">
              <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              </div>
              <h3 className="text-2xl font-bold mb-2 dark:text-white">正在准备展示文档</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8">优化视觉布局以确保 PDF 导出效果最佳</p>
              
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-8">
                <div 
                  className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-300 ease-out"
                  style={{ width: `${exportProgress}%` }}
                ></div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsPreparingExport(false)}
                  className="flex-1 py-3 text-slate-500 font-bold hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={handleFinalPrint}
                  disabled={exportProgress < 100}
                  className={`flex-2 px-8 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95 ${exportProgress < 100 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                >
                  确认打印/导出
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 编辑确认弹窗 */}
        {showEditConfirm && (
          <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-8 print:hidden animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100 dark:border-slate-800 text-center">
              <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">管理模式确认</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">进入管理模式需要验证身份密码，确认继续？</p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowEditConfirm(false)}
                  className="flex-1 py-3 text-slate-500 font-bold hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={() => { setShowEditConfirm(false); onEdit(); }}
                  className="flex-1 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
                >
                  确认进入
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes progress {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.7); }
          100% { transform: scaleX(1); }
        }
        @media print {
          @page { margin: 15mm; size: a4; }
          body { background: white !important; }
          .custom-scrollbar { overflow: visible !important; }
          main { overflow: visible !important; }
        }
      `}</style>
    </div>
  );
};

export default ProjectViewer;
