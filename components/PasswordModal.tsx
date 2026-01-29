
import React, { useState } from 'react';

interface PasswordModalProps {
  onConfirm: (password: string) => void;
  onCancel: () => void;
  title?: string;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ onConfirm, onCancel, title = "安全验证" }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(password);
  };

  return (
    <div className="fixed inset-0 z-[500] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800">
        <h3 className="text-xl font-bold mb-2 dark:text-white">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">该操作受保护，请输入管理密码以继续。</p>
        
        <form onSubmit={handleSubmit}>
          <input 
            autoFocus
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white mb-6"
            placeholder="请输入密码..."
          />
          
          <div className="flex gap-3">
            <button 
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 text-slate-500 font-bold hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            >
              取消
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100 dark:shadow-none"
            >
              确认
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
