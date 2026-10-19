import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';

interface AppOpenSplashScreenProps {
  onComplete: () => void;
}

export const AppOpenSplashScreen: React.FC<AppOpenSplashScreenProps> = ({ onComplete }) => {
  const [isDismissing, setIsDismissing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    // Progress animation to simulate app loading
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 8;
      });
    }, 90);

    // Auto-dismiss after 2.1 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 2200);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  const handleClose = () => {
    if (isDismissing) return;
    setIsDismissing(true);
    setTimeout(() => {
      onComplete();
    }, 400);
  };

  return (
    <AnimatePresence>
      {!isDismissing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-between bg-gradient-to-b from-[#091533] via-[#123B92] to-[#2B0E68] text-white select-none px-6 py-10 overflow-hidden"
        >
          {/* Subtle Ambient Glow Effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-purple-500/15 blur-2xl pointer-events-none" />

          {/* Top Skip Button */}
          <div className="w-full flex justify-end relative z-10">
            <button
              type="button"
              onClick={handleClose}
              aria-label="Skip to App"
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 text-white/80 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-xs"
            >
              <span>Skip</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Central Section: App Icon + Website Name Directly Beneath */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center max-w-sm w-full">
            {/* The Official App Icon */}
            <motion.div
              initial={{ scale: 0.75, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
                delay: 0.1,
              }}
              className="relative group"
            >
              {/* Outer Glow Ring */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-60 blur-md group-hover:opacity-100 transition-opacity" />

              {/* The Squircle Icon Container */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl p-3 bg-white shadow-2xl border-2 border-white/60 flex items-center justify-center overflow-hidden">
                <img
                  src="/app-icon.png"
                  alt="TempMailGo Icon"
                  className="w-full h-full object-contain block select-none"
                  loading="eager"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.triedBackup) {
                      target.dataset.triedBackup = 'true';
                      target.src = '/pwa-512x512.png';
                    }
                  }}
                />
              </div>

              {/* Verified Mini Badge */}
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-[#123B92] flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-4 h-4 text-white stroke-[2.5]" />
              </div>
            </motion.div>

            {/* The Official Website Name Written Directly Below The App Icon */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="mt-5 flex flex-col items-center"
            >
              {/* Large, Bold Website Name */}
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
                TempMailGo
              </h1>

              {/* Tagline / Description */}
              <p className="text-xs sm:text-sm font-semibold text-sky-200/90 mt-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>Instant Disposable Mail & 2FA</span>
              </p>

              {/* Official Status */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-semibold text-sky-100 mt-3 backdrop-blur-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Official Application Ready
              </span>
            </motion.div>

            {/* Loading / Progress Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="w-44 mt-6 flex flex-col items-center gap-2"
            >
              <div className="w-full h-1.5 bg-white/15 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300 rounded-full transition-all duration-150 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] text-sky-200/70 font-mono">
                {progress < 100 ? 'Starting TempMailGo...' : 'Welcome!'}
              </span>
            </motion.div>
          </div>

          {/* Footer Copyright */}
          <div className="relative z-10 text-center">
            <p className="text-[11px] font-medium text-sky-200/60">
              TempMailGo • Fast • Secure • Privacy-First
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
