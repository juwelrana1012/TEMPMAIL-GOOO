import React from 'react';
import { Check, Key, Info, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'code';
}

interface ToastNotificationProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  toasts,
  onDismiss,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-2.5 sm:top-3.5 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-1 pointer-events-none w-auto max-w-[92vw] px-2 select-none"
    >
      {toasts.map((toast) => {
        const isCode = toast.type === 'code';
        const isSuccess = toast.type === 'success';

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full shadow-md backdrop-blur-xl border transition-all duration-200 animate-in fade-in slide-in-from-top-2 ${
              isCode
                ? 'bg-[#062418]/95 border-emerald-400/50 text-emerald-100 shadow-[0_4px_16px_rgba(5,150,105,0.35)]'
                : isSuccess
                ? 'bg-[#081C38]/95 border-sky-400/50 text-sky-100 shadow-[0_4px_16px_rgba(14,165,233,0.3)]'
                : 'bg-[#0F172A]/95 border-slate-700/80 text-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.5)]'
            }`}
          >
            {/* Slim Icon */}
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                isCode
                  ? 'bg-emerald-500 text-white'
                  : isSuccess
                  ? 'bg-sky-500 text-white'
                  : 'bg-indigo-500 text-white'
              }`}
            >
              {isCode ? (
                <Key className="w-2.5 h-2.5 stroke-[2.8]" />
              ) : isSuccess ? (
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              ) : (
                <Info className="w-2.5 h-2.5 stroke-[2.8]" />
              )}
            </div>

            {/* Concise Single-Line Message */}
            <span className="font-semibold text-[11.5px] xs:text-xs tracking-tight truncate max-w-[260px] sm:max-w-xs text-white">
              {toast.message}
            </span>

            {/* Tiny Dismiss Button */}
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="text-white/60 hover:text-white p-0.5 rounded-full hover:bg-white/10 transition-colors shrink-0 cursor-pointer active:scale-90 ml-0.5"
              aria-label="Dismiss"
            >
              <X className="w-3 h-3 stroke-[2.5]" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

