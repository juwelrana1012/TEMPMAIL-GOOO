import React from 'react';
import { Mail, ShieldAlert, Plus, Zap } from 'lucide-react';

interface QuickActionsProps {
  onOpenTempMail: () => void;
  onOpenTotpManager: () => void;
  onOpenNewAccount: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onOpenTempMail,
  onOpenTotpManager,
  onOpenNewAccount,
}) => {
  return (
    <section className="w-full mt-5">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1.5 text-white font-semibold text-sm sm:text-base">
          <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>Quick Actions</span>
        </div>
        <button
          type="button"
          onClick={onOpenTempMail}
          className="text-slate-400 hover:text-white text-xs font-medium transition-colors"
        >
          See All
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Get code mail */}
        <button
          type="button"
          onClick={onOpenTempMail}
          className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-blue-950/40 to-slate-900/80 border border-blue-900/40 hover:border-blue-500/60 hover:from-blue-900/40 transition-all duration-200 active:scale-95 shadow-md shadow-black/30"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2 group-hover:scale-105 transition-transform">
            <Mail className="w-6 h-6" />
          </div>
          <span className="text-white text-xs font-medium text-center line-clamp-1">
            Get code mail
          </span>
        </button>

        {/* Webmail (The one clicked in video) */}
        <button
          type="button"
          onClick={onOpenTempMail}
          className="group relative flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-emerald-950/40 to-slate-900/80 border border-emerald-900/40 hover:border-emerald-500/60 hover:from-emerald-900/40 transition-all duration-200 active:scale-95 shadow-md shadow-black/30"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2 group-hover:scale-105 transition-transform">
            <Mail className="w-6 h-6" />
          </div>
          <span className="text-white text-xs font-medium text-center line-clamp-1">
            Webmail
          </span>
          {/* Active indicator dot */}
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>

        {/* Create Acc */}
        <button
          type="button"
          onClick={onOpenNewAccount}
          className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-purple-950/40 to-slate-900/80 border border-purple-900/40 hover:border-purple-500/60 hover:from-purple-900/40 transition-all duration-200 active:scale-95 shadow-md shadow-black/30"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-2 group-hover:scale-105 transition-transform">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-white text-xs font-medium text-center line-clamp-1">
            Create Acc
          </span>
        </button>
      </div>
    </section>
  );
};
