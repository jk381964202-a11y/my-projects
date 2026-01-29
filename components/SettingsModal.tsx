
import React, { useState, useRef } from 'react';
import { AppConfig } from '../types.ts';
import PasswordModal from './PasswordModal.tsx';

interface SettingsModalProps {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ config, onSave, onClose }) => {
  const [title, setTitle] = useState(config.title);
  const [logoText, setLogoText] = useState(config.logoText);
  const [logoUrl, setLogoUrl] = useState(config.logoUrl || '');
  const [theme, setTheme] = useState(config.theme);
  const [password, setPassword] = useState(config.password || '0701');
  
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onSave({ title, logoText, logoUrl, theme, password });
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerifyPassword = (inputPass: string) => {
    if (inputPass === config.password) {
      setIsVerifyingPassword(false);
      setIsPasswordEditable(true);
    } else {
      alert("密码验证失败");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[300] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold dark:text-white">库全局配置</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-transform active:scale-90">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <div className="space-y-6 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">库展示大标题</label>
              <input 
                value={title} onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                placeholder="输入大标题..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">品牌标识 (Logo)</label>
              <div className="flex gap-4 items-center mb-4">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors overflow-hidden group relative`}
                >
                  {logoUrl ? (
                    <>
                      <img src={logoUrl} className="w-full h-full object-contain" alt="Logo Preview" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-white font-bold transition-opacity">更换</div>
                    </>
                  ) : (
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                </div>
                <div className="flex-1">
                  <input 
                    value={logoText} onChange={e => setLogoText(e.target.value)}
                    maxLength={3}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white font-black uppercase"
                    placeholder="缩写"
                  />
                </div>
                {logoUrl && (
                  <button 
                    onClick={() => setLogoUrl('')}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v2m-3 7h12"/></svg>
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">管理密码</label>
              <div className="flex gap-2">
                <input 
                  type={isPasswordEditable ? "text" : "password"}
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  disabled={!isPasswordEditable}
                  className={`flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white ${!isPasswordEditable ? 'opacity-70 cursor-not-allowed' : ''}`}
                />
                {!isPasswordEditable && (
                  <button 
                    onClick={() => setIsVerifyingPassword(true)}
                    className="px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 transition-colors"
                  >
                    修改
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">界面主题</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setTheme('light')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${theme === 'light' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'}`}
                >
                  <div className="w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                  </div>
                  <span className="text-xs font-bold dark:text-white">浅色</span>
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${theme === 'dark' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'}`}
                >
                  <div className="w-8 h-8 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center text-indigo-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
                  </div>
                  <span className="text-xs font-bold dark:text-white">深色</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 flex gap-3 border-t border-slate-100 dark:border-slate-800 pt-6">
            <button onClick={onClose} className="flex-1 py-3 text-slate-500 font-bold hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">取消</button>
            <button onClick={handleSave} className="flex-2 px-10 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all active:scale-95">保存配置</button>
          </div>
        </div>
      </div>

      {isVerifyingPassword && (
        <PasswordModal 
          title="验证当前密码"
          onConfirm={handleVerifyPassword}
          onCancel={() => setIsVerifyingPassword(false)}
        />
      )}
    </>
  );
};

export default SettingsModal;
