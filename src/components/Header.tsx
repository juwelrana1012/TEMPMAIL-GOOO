import React from 'react';
import { LogOut, Clock, Package, Trophy } from 'lucide-react';

interface HeaderProps {
  mailCount: number;
  balance?: string;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mailCount = 16,
  balance = '$0.80',
}) => {
  return (
    <header className="w-full bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-pink-200 shadow-md shadow-pink-100">
      {/* Top User Profile Row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* User Profile Avatar / Logo (Large, 100% Round & Complete) */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#1870E9] via-[#6865E3] to-[#9D50EA] shadow-md shadow-[#1870E9]/20 flex items-center justify-center shrink-0 aspect-square">
            <div className="w-full h-full rounded-full bg-white overflow-hidden p-0.5 flex items-center justify-center relative">
              <img
                src={`/api/proxy-image?url=${encodeURIComponent('https://i.ibb.co.com/KjmTxY09/file-00000000845c821184731e7792b8d137.png')}`}
                alt="MD Juwel Rana"
                className="w-full h-full object-cover object-center rounded-full block aspect-square"
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.triedDirect) {
                    target.dataset.triedDirect = 'true';
                    target.src = 'https://i.ibb.co.com/KjmTxY09/file-00000000845c821184731e7792b8d137.png';
                  } else {
                    target.style.display = 'none';
                  }
                }}
              />
              {/* Fallback initials badge if image is blocked by ISP */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#1870E9] to-[#6865E3] -z-10 flex items-center justify-center text-white font-black text-base select-none">
                JR
              </div>
            </div>
          </div>
          <div className="min-w-0">
            <h1 className="text-pink-950 font-bold text-base sm:text-lg truncate">
              Welcome, MD Juwel Rana
            </h1>
            <p className="text-pink-700 font-medium text-xs sm:text-sm truncate">
              mdjuwelranajx127133@gmail.com
            </p>
          </div>
        </div>

        {/* Exit/Logout Icon */}
        <button
          type="button"
          aria-label="Logout"
          className="p-2 text-pink-400 hover:text-rose-600 rounded-xl hover:bg-pink-50 transition-colors"
        >
          <LogOut className="w-5 h-5 rotate-180" />
        </button>
      </div>

      {/* Balance and Clock Row */}
      <div className="mt-4 flex items-center justify-between border-t border-pink-100 pt-3">
        <div className="flex items-center gap-2">
          <span className="text-emerald-700 font-black text-2xl tracking-tight">
            {balance}
          </span>
        </div>

        <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
          <Clock className="w-5 h-5" />
        </div>
      </div>

      {/* Stats row: Mails and Level */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="flex flex-col items-center justify-center py-2 px-3 rounded-xl bg-pink-50/70 border border-pink-100">
          <Package className="w-4 h-4 text-pink-600 mb-1" />
          <span className="text-pink-950 font-bold text-sm">{mailCount}</span>
          <span className="text-pink-600 text-[11px] font-semibold">Mails</span>
        </div>

        <div className="flex flex-col items-center justify-center py-2 px-3 rounded-xl bg-pink-50/70 border border-pink-100">
          <Trophy className="w-4 h-4 text-pink-600 mb-1" />
          <span className="text-pink-950 font-bold text-sm">Bronze</span>
          <span className="text-pink-600 text-[11px] font-semibold">Level</span>
        </div>
      </div>
    </header>
  );
};
