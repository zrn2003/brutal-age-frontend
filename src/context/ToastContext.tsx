import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextType {
  showToast: (title: string, type?: ToastType, description?: string) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((title: string, type: ToastType = 'info', description?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { id, type, title, description };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const success = (title: string, description?: string) => showToast(title, 'success', description);
  const error = (title: string, description?: string) => showToast(title, 'error', description);
  const info = (title: string, description?: string) => showToast(title, 'info', description);
  const warning = (title: string, description?: string) => showToast(title, 'warning', description);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}

      {/* Overlay Toast Stack Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => {
          let bgColors = 'bg-slate-900 border-slate-700 text-white';
          let Icon = Info;
          let iconColor = 'text-indigo-400';

          if (toast.type === 'success') {
            bgColors = 'bg-emerald-950 border-emerald-700 text-emerald-100';
            Icon = CheckCircle2;
            iconColor = 'text-emerald-400';
          } else if (toast.type === 'error') {
            bgColors = 'bg-red-950 border-red-700 text-red-100';
            Icon = AlertCircle;
            iconColor = 'text-red-400';
          } else if (toast.type === 'warning') {
            bgColors = 'bg-amber-950 border-amber-700 text-amber-100';
            Icon = AlertTriangle;
            iconColor = 'text-amber-400';
          } else if (toast.type === 'info') {
            bgColors = 'bg-indigo-950 border-indigo-700 text-indigo-100';
            Icon = Info;
            iconColor = 'text-indigo-400';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 border rounded-none shadow-2xl flex items-start gap-3 transition-all animate-in slide-in-from-bottom-3 duration-200 ${bgColors}`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
              
              <div className="flex-1 min-w-0">
                <h5 className="text-xs font-black uppercase tracking-wide font-heading">
                  {toast.title}
                </h5>
                {toast.description && (
                  <p className="text-[11px] font-medium opacity-90 leading-tight mt-0.5">
                    {toast.description}
                  </p>
                )}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="opacity-70 hover:opacity-100 transition-opacity p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
