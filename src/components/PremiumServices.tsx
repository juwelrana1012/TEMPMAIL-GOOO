import React from 'react';
import { ShoppingCart, Mail, Key, Cookie, ShieldCheck, Sparkles } from 'lucide-react';

interface PremiumServicesProps {
  onSelectService: (serviceName: string) => void;
  onQuickGetCode: () => void;
}

export const PremiumServices: React.FC<PremiumServicesProps> = ({
  onSelectService,
  onQuickGetCode,
}) => {
  return (
    <section className="w-full mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <div className="flex items-center gap-2 text-white font-semibold text-sm sm:text-base">
            <ShoppingCart className="w-4 h-4 text-slate-400" />
            <span>Premium Services</span>
            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              Live
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-0.5">Choose your service</p>
        </div>
      </div>

      {/* Grid of 4 Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Mail Buy */}
        <button
          type="button"
          onClick={() => onSelectService('Mail Buy')}
          className="col-span-2 flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-b from-[#151c2e] to-[#0d121f] border border-slate-800/80 hover:border-slate-700 transition-all duration-200 active:scale-[0.98] shadow-lg shadow-black/20"
        >
          <div className="w-12 h-12 rounded-full bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-300 mb-2">
            <Mail className="w-6 h-6 text-slate-300" />
          </div>
          <span className="text-white font-medium text-sm">Mail Buy</span>
        </button>

        {/* Get Code (with Key icon & 0.08 badge) */}
        <button
          type="button"
          onClick={onQuickGetCode}
          className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-[#151c2e] to-[#0d121f] border border-amber-500/20 hover:border-amber-500/50 transition-all duration-200 active:scale-[0.97] shadow-lg shadow-black/20 relative group"
        >
          <div className="w-11 h-11 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-105 transition-transform">
            <Key className="w-5 h-5 text-amber-400" />
          </div>
          <span className="text-white font-medium text-xs sm:text-sm">Get Code</span>
          <span className="mt-1 text-[10px] text-amber-400 font-mono bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
            $0.08
          </span>
        </button>

        {/* Get Cookie */}
        <button
          type="button"
          onClick={() => onSelectService('Get Cookie')}
          className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-[#151c2e] to-[#0d121f] border border-slate-800/80 hover:border-slate-700 transition-all duration-200 active:scale-[0.97] shadow-lg shadow-black/20 group"
        >
          <div className="w-11 h-11 rounded-full bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-300 mb-2 group-hover:scale-105 transition-transform">
            <Cookie className="w-5 h-5 text-amber-300/80" />
          </div>
          <span className="text-white font-medium text-xs sm:text-sm">Get Cookie</span>
          <span className="mt-1 text-[10px] text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded-full">
            $0.05
          </span>
        </button>

        {/* HM Code */}
        <button
          type="button"
          onClick={() => onSelectService('HM Code')}
          className="col-span-2 flex items-center justify-between px-5 py-3.5 rounded-2xl bg-gradient-to-r from-[#151c2e] to-[#0d121f] border border-slate-800/80 hover:border-slate-700 transition-all duration-200 active:scale-[0.99] shadow-lg shadow-black/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-white font-medium text-xs sm:text-sm block">HM Code Service</span>
              <span className="text-slate-500 text-[11px]">Instant Token Verification</span>
            </div>
          </div>
          <span className="text-[11px] text-indigo-400 font-mono bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
            $0.08
          </span>
        </button>
      </div>
    </section>
  );
};
