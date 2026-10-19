import React from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { sounds } from '../utils/audio';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: 'light' | 'dark';
  onToggleTheme: (mode: 'light' | 'dark') => void;
  onOpenUsageGuide?: (topicId?: string) => void;
  selectedDomain?: string;
  onOpenDomainModal?: () => void;
  onTriggerToast?: (msg: string, type?: 'success' | 'info' | 'code') => void;
  onOpenSplash?: () => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  isOpen,
  onClose,
  themeMode,
  onToggleTheme,
  onTriggerToast = () => {},
}) => {
  const { isInstalled, isIOS, install } = usePWAInstall();

  if (!isOpen) return null;

  const isDark = themeMode === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex select-none animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={() => {
          sounds.playClick();
          onClose();
        }}
      />

      {/* Slide-in Menu Panel */}
      <div
        className={`relative z-10 w-full max-w-xs sm:max-w-sm h-full flex flex-col justify-between shadow-2xl transition-all duration-300 border-r ${
          isDark
            ? 'bg-gradient-to-b from-[#123B92] via-[#222A82] to-[#3E168E] text-white border-blue-400/30'
            : 'bg-gradient-to-b from-[#DCEBFF] via-[#E2E5FF] to-[#EDE1FF] text-[#123B92] border-[#BACBF5]'
        }`}
      >
        {/* Top Header: Brand on Left, Theme Mode Text Button + Close on Right */}
        <div className="p-3.5 sm:p-4 border-b border-white/15 flex items-center justify-between gap-2">
          {/* Brand Left */}
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-9 h-9 p-1 rounded-xl border flex items-center justify-center overflow-hidden shrink-0 ${
                isDark ? 'bg-[#0A1A40]/90 border-blue-400/40' : 'bg-white border-[#BACBF5]'
              }`}
            >
              <img
                src="/app-icon.png"
                alt="TempMailGo Logo"
                className="w-full h-full object-contain block"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.triedBackup) {
                    target.dataset.triedBackup = 'true';
                    target.src = '/pwa-192x192.png';
                  }
                }}
              />
            </div>
            <span
              className={`text-sm font-black tracking-tight leading-none truncate ${
                isDark ? 'text-white' : 'text-[#123B92]'
              }`}
            >
              TempMailGo
            </span>
          </div>

          {/* Right Corner: Theme Mode Text Button + Close Button */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Pure text button for Dark Mode / Light Mode without icons */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onToggleTheme(isDark ? 'light' : 'dark');
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 border-white/25 text-white'
                  : 'bg-white hover:bg-slate-50 border-[#BACBF5] text-[#123B92]'
              }`}
              title="Toggle Theme Mode"
            >
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className={`p-1.5 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                  : 'bg-white/80 hover:bg-white border-[#BACBF5] text-[#123B92]'
              }`}
              title="Close Menu"
              aria-label="Close"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Scrollable Body: Settings-Style Serial List */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-2.5 no-scrollbar">
          {/* Compact Install Row */}
          <button
            type="button"
            id="btn-hamburger-install"
            onClick={async () => {
              sounds.playClick();
              if (isInstalled) {
                onTriggerToast('TempMailGo is already installed on your device!', 'info');
                return;
              }

              const success = await install();
              if (success) {
                sounds.playSuccessChime();
                onTriggerToast('Installing TempMailGo to your device...', 'success');
                try {
                  localStorage.setItem('tempmailgo_first_launch_after_install', 'true');
                } catch {}
                onClose();
              } else {
                if (isIOS) {
                  onTriggerToast('On iPhone Safari: Tap Share (⎋) ➔ Add to Home Screen', 'info');
                } else {
                  onTriggerToast('Tap Chrome menu (⋮) ➔ "Install app" to add TempMailGo', 'info');
                }
              }
            }}
            className={`w-full py-2.5 px-3.5 rounded-xl border font-bold text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer shadow-xs active:scale-[0.98] ${
              isInstalled
                ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30 cursor-default'
                : isDark
                ? 'bg-white/10 hover:bg-white/15 border-white/20 text-white'
                : 'bg-white hover:bg-slate-50 border-[#BACBF5] text-[#123B92]'
            }`}
          >
            <span>Install</span>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                isInstalled
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : isDark
                  ? 'bg-sky-500/20 text-sky-200'
                  : 'bg-blue-50 text-blue-700'
              }`}
            >
              {isInstalled ? 'Installed' : 'App'}
            </span>
          </button>
        </div>

        {/* Minimal Footer */}
        <div className="p-3.5 border-t border-white/15 flex items-center justify-between text-[11px] opacity-75">
          <span className="flex items-center gap-1 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            TempMailGo
          </span>
          <span className="font-mono">Secure</span>
        </div>
      </div>
    </div>
  );
};

