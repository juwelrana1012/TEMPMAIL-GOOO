import React, { useState } from 'react';
import { Check, X, Mail, Globe, Sparkles } from 'lucide-react';
import { ALL_SERIAL_DOMAINS } from '../data/domains';
import { DomainItem } from '../types';
import { sounds } from '../utils/audio';

interface SelectOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDomain: string;
  onSelectDomain: (domain: string, username?: string) => void;
  isLoading?: boolean;
  themeMode?: 'light' | 'dark';
}

export const SelectOptionsModal: React.FC<SelectOptionsModalProps> = ({
  isOpen,
  onClose,
  currentDomain,
  onSelectDomain,
  isLoading = false,
  themeMode = 'light',
}) => {
  const isDark = themeMode === 'dark';
  const [selectedDomain, setSelectedDomain] = useState<string>(currentDomain || 'mailto.plus');
  const [customUser, setCustomUser] = useState<string>('');

  if (!isOpen) return null;

  const handlePickDomain = (domain: string) => {
    sounds.playClick();
    setSelectedDomain(domain);
  };

  const handleConfirm = () => {
    sounds.playSuccessChime();
    onSelectDomain(selectedDomain, customUser.trim() || undefined);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-2xl sm:max-w-3xl rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-150 border ${
          isDark
            ? 'bg-gradient-to-b from-[#123B92] via-[#222A82] to-[#3E168E] text-white border-blue-400/35'
            : 'bg-white border-[#BACBF5] text-[#0A0A2C]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient Top Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#2F69F8] via-[#743FFA] to-[#AF1AFC]" />

        {/* Modal Header */}
        <div className={`px-4 sm:px-6 py-2.5 sm:py-3 border-b flex items-center justify-between ${
          isDark ? 'bg-[#09152E]/90 border-blue-400/20' : 'bg-slate-50/70 border-slate-100'
        }`}>
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#1870E9] via-[#6865E3] to-[#9D50EA] text-white flex items-center justify-center shadow-xs shrink-0">
              <Globe className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-2 truncate">
              <h2 className={`text-xs sm:text-sm font-bold truncate ${isDark ? 'text-white' : 'text-[#0A0A2C]'}`}>
                Select Mail Domain
              </h2>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border shrink-0 ${
                isDark ? 'bg-sky-500/20 text-sky-200 border-sky-400/30' : 'bg-blue-50 text-[#1870E9] border-blue-200/60'
              }`}>
                {ALL_SERIAL_DOMAINS.length} Domains
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`w-7 h-7 rounded-full border flex items-center justify-center transition-colors shadow-xs cursor-pointer shrink-0 ${
              isDark
                ? 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
                : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Custom Username Input */}
        <div className={`px-4 sm:px-6 py-2 border-b ${isDark ? 'bg-[#0B1736] border-blue-400/20' : 'bg-white border-slate-100'}`}>
          <div className="relative flex items-center">
            <input
              type="text"
              value={customUser}
              onChange={(e) => setCustomUser(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ''))}
              placeholder="Custom username (optional)"
              className={`w-full px-3 py-1.5 rounded-xl border text-xs shadow-xs focus:outline-none ${
                isDark
                  ? 'bg-[#081229] border-blue-400/40 text-white placeholder-slate-400 focus:border-sky-400'
                  : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500'
              }`}
            />
            {selectedDomain && (
              <span className={`absolute right-3 text-xs font-normal-typing font-normal pointer-events-none ${
                isDark ? 'text-sky-300' : 'text-[#1870E9]'
              }`}>
                @{selectedDomain}
              </span>
            )}
          </div>
        </div>

        {/* Serial Domain Grid */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-2">
            {ALL_SERIAL_DOMAINS.map((item: DomainItem) => {
              const isSelected = selectedDomain === item.domain;

              return (
                <div
                  key={item.domain}
                  onClick={() => handlePickDomain(item.domain)}
                  className={`px-2.5 py-1.5 rounded-xl border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'border-[#1870E9] bg-gradient-to-r from-blue-500/20 via-indigo-500/15 to-purple-500/20 shadow-xs'
                      : isDark
                      ? 'border-blue-400/25 bg-[#0D1A3F] hover:border-blue-400/60 text-white'
                      : 'border-slate-200/90 hover:border-blue-400/50 hover:bg-slate-50 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Globe
                      className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                        isSelected ? 'text-sky-400' : isDark ? 'text-sky-300/60' : 'text-slate-400'
                      }`}
                    />

                    {/* Domain Name with natural keyboard typing style */}
                    <span
                      className={`text-xs sm:text-[13px] font-normal-typing font-normal truncate leading-tight select-all ${
                        isSelected
                          ? isDark ? 'text-sky-300 font-medium' : 'text-[#1870E9] font-medium'
                          : isDark ? 'text-white' : 'text-slate-800'
                      }`}
                    >
                      @{item.domain}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Status indicator */}
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 border ${
                        item.isLive
                          ? isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                          : isDark ? 'bg-purple-500/20 text-purple-300 border-purple-400/30' : 'bg-purple-50 text-purple-700 border-purple-200/80'
                      }`}
                    >
                      {item.isLive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
                      <span>{item.tag}</span>
                    </span>

                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-[#1870E9] text-white flex items-center justify-center shadow-xs">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className={`p-4 sm:p-5 border-t flex items-center justify-between gap-3 ${
          isDark ? 'bg-[#09152E]/90 border-blue-400/20' : 'bg-slate-50 border-slate-100'
        }`}>
          <button
            type="button"
            onClick={onClose}
            className={`px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              isDark
                ? 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
                : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
            }`}
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={handleConfirm}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#2F69F8] via-[#743FFA] to-[#AF1AFC] hover:opacity-95 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-500/25 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Select @{selectedDomain}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
