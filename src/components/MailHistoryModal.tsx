import React, { useState } from 'react';
import { MailHistoryItem } from '../types';
import { copyToClipboard } from '../utils/clipboard';
import { sounds } from '../utils/audio';
import { Clock, Check, Trash2, X, History, Mail, ArrowLeft, Copy, Search } from 'lucide-react';

interface MailHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: MailHistoryItem[];
  onClearHistory: () => void;
  onDeleteHistoryItem?: (id: string) => void;
  onTriggerToast: (msg: string, type?: 'success' | 'info' | 'code') => void;
  themeMode?: 'light' | 'dark';
}

export const MailHistoryModal: React.FC<MailHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onDeleteHistoryItem,
  onTriggerToast,
  themeMode = 'light',
}) => {
  const isDark = themeMode === 'dark';
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isConfirmingClear, setIsConfirmingClear] = useState<boolean>(false);
  const [isSearchPageOpen, setIsSearchPageOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const handleCopyHistoryItem = async (item: MailHistoryItem) => {
    sounds.playClick();
    const ok = await copyToClipboard(item.address);
    if (ok) {
      sounds.playSuccessChime();
      setCopiedId(item.id);
      onTriggerToast(`Copied: ${item.address}`, 'success');
      setTimeout(() => setCopiedId(null), 1500);
    }
  };

  const handleConfirmClear = () => {
    sounds.playClick();
    onClearHistory();
    setIsConfirmingClear(false);
    onTriggerToast('Mail history cleared', 'info');
  };

  const filteredHistory = history.filter((item) => {
    if (!searchQuery.trim()) return true;
    return item.address.toLowerCase().includes(searchQuery.trim().toLowerCase());
  });

  // Dedicated Full-Screen Search Page
  if (isSearchPageOpen) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        className={`fixed inset-0 z-50 flex flex-col w-full h-full overflow-y-auto animate-in fade-in duration-150 pb-20 sm:pb-24 transition-colors ${
          isDark
            ? 'bg-gradient-to-b from-[#123B92] via-[#222A82] to-[#3E168E] text-white'
            : 'bg-gradient-to-b from-[#DCEBFF] via-[#E2E5FF] to-[#EDE1FF] text-[#0A0A2C]'
        }`}
      >
        {/* Search Page Navigation Header */}
        <header
          className={`sticky top-0 z-20 backdrop-blur-md border-b px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs ${
            isDark
              ? 'bg-[#09152E]/95 border-blue-400/25 text-white'
              : 'bg-white/95 border-slate-200 text-[#0A0A2C]'
          }`}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setIsSearchPageOpen(false);
              }}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border flex items-center gap-1 text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
              title="Back to Mail History"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Search className="w-4 h-4" />
              </div>
              <h1 className={`text-sm sm:text-base font-bold ${isDark ? 'text-white' : 'text-[#0A0A2C]'}`}>
                Search Mail History
              </h1>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                isDark ? 'bg-white/15 text-sky-200 border-white/20' : 'bg-slate-100 text-slate-600 border-slate-200/80'
              }`}>
                {filteredHistory.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setIsSearchPageOpen(false);
                onClose();
              }}
              aria-label="Close"
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors shadow-2xs cursor-pointer ${
                isDark
                  ? 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Prominent Search Input Bar */}
        <div
          className={`sticky top-[53px] z-10 px-4 sm:px-8 py-3 border-b backdrop-blur-md transition-colors ${
            isDark
              ? 'bg-[#09152E]/90 border-blue-400/20'
              : 'bg-white/90 border-slate-200'
          }`}
        >
          <div className="max-w-2xl mx-auto relative flex items-center">
            <Search className={`w-4 h-4 absolute left-3.5 pointer-events-none ${isDark ? 'text-sky-400' : 'text-slate-400'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search email address or initial letters..."
              autoFocus
              className={`w-full pl-10 pr-9 py-2.5 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
                isDark
                  ? 'bg-[#0D1A3F] border-blue-400/30 text-white placeholder-slate-400 focus:border-sky-400 focus:ring-1 focus:ring-sky-400'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results List */}
        <main className="max-w-2xl mx-auto w-full p-4 sm:p-6 flex-1 flex flex-col space-y-2.5">
          {history.length === 0 ? (
            <div className={`my-auto py-12 text-center rounded-2xl border shadow-xs p-6 space-y-2 ${
              isDark ? 'bg-[#0F1E4A]/80 border-blue-400/30 text-white' : 'bg-white rounded-2xl border-slate-200/90 text-slate-600'
            }`}>
              <Mail className={`w-8 h-8 mx-auto ${isDark ? 'text-sky-300' : 'text-slate-300'}`} />
              <p className={`text-xs font-semibold ${isDark ? 'text-sky-200' : 'text-slate-500'}`}>
                No mail history saved yet.
              </p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className={`my-auto py-12 text-center rounded-2xl border shadow-xs p-6 space-y-2 ${
              isDark ? 'bg-[#0F1E4A]/80 border-blue-400/30 text-white' : 'bg-white rounded-2xl border-slate-200/90 text-slate-600'
            }`}>
              <Search className={`w-8 h-8 mx-auto ${isDark ? 'text-sky-300' : 'text-slate-300'}`} />
              <p className={`text-xs font-semibold ${isDark ? 'text-sky-200' : 'text-slate-500'}`}>
                No matching emails found for "{searchQuery}".
              </p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className={`p-3 sm:p-3.5 rounded-xl border transition-all flex items-center justify-between shadow-2xs gap-2 ${
                  isDark
                    ? 'bg-[#0D1A3F] border-blue-400/25 hover:border-blue-400/60 text-white'
                    : 'border-slate-200/90 bg-white hover:border-slate-300 text-[#0A0A2C]'
                }`}
              >
                <div
                  onClick={() => handleCopyHistoryItem(item)}
                  className="min-w-0 flex-1 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                    <span className={`text-xs sm:text-sm font-normal-typing font-normal truncate select-all ${isDark ? 'text-white' : 'text-[#0A0A2C]'}`}>
                      {item.address}
                    </span>
                  </div>
                  <div className={`flex items-center gap-1 mt-0.5 text-[10px] ${isDark ? 'text-sky-300/60' : 'text-slate-400'}`}>
                    <Clock className="w-3 h-3" />
                    <span>{item.copiedAt || `${item.date} ${item.time}`}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopyHistoryItem(item)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs active:scale-95 ${
                      copiedId === item.id
                        ? 'bg-emerald-600 text-white'
                        : isDark
                        ? 'bg-white/10 hover:bg-white/20 text-sky-200 border border-white/20'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                    }`}
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  {onDeleteHistoryItem && (
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        onDeleteHistoryItem(item.id);
                        onTriggerToast('Address removed', 'info');
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete address"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </main>
      </div>
    );
  }

  // Standard Mail History Screen
  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-50 flex flex-col w-full h-full overflow-y-auto animate-in fade-in duration-150 pb-20 sm:pb-24 transition-colors ${
        isDark
          ? 'bg-gradient-to-b from-[#123B92] via-[#222A82] to-[#3E168E] text-white'
          : 'bg-gradient-to-b from-[#DCEBFF] via-[#E2E5FF] to-[#EDE1FF] text-[#0A0A2C]'
      }`}
    >
      {/* Slim Top Navigation Bar */}
      <header
        className={`sticky top-0 z-20 backdrop-blur-md border-b px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs ${
          isDark
            ? 'bg-[#09152E]/95 border-blue-400/25 text-white'
            : 'bg-white/95 border-slate-200 text-[#0A0A2C]'
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border flex items-center gap-1 text-xs font-bold transition-all active:scale-95 cursor-pointer ${
              isDark
                ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
            title="Back to home"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#059669] to-[#0D9488] text-white flex items-center justify-center shadow-xs">
              <History className="w-4 h-4" />
            </div>
            <h1 className={`text-sm sm:text-base font-bold ${isDark ? 'text-white' : 'text-[#0A0A2C]'}`}>
              Mail History
            </h1>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
              isDark ? 'bg-white/15 text-sky-200 border-white/20' : 'bg-slate-100 text-slate-600 border-slate-200/80'
            }`}>
              {history.length}
            </span>
          </div>
        </div>

        {/* Top Right Corner Controls: Search Icon, Clear All, and Close */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Search Icon Button in Top Right Corner */}
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setIsSearchPageOpen(true);
            }}
            className={`p-2 rounded-xl border flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-2xs ${
              isDark
                ? 'bg-blue-600/30 hover:bg-blue-600/50 border-blue-400/40 text-sky-200'
                : 'bg-white hover:bg-blue-50 border-slate-200 text-blue-600'
            }`}
            title="Search Mail History"
            aria-label="Search Mail History"
          >
            <Search className="w-4 h-4" />
          </button>

          {history.length > 0 && !isConfirmingClear && (
            <button
              type="button"
              onClick={() => setIsConfirmingClear(true)}
              className="px-2.5 sm:px-3 py-1.5 text-rose-500 hover:bg-rose-500/10 border border-rose-400/40 rounded-xl transition-all text-xs flex items-center gap-1.5 font-bold cursor-pointer shadow-2xs active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear All</span>
            </button>
          )}

          {isConfirmingClear && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleConfirmClear}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setIsConfirmingClear(false)}
                className={`px-2.5 py-1.5 border rounded-xl text-xs font-semibold cursor-pointer ${
                  isDark ? 'border-white/20 hover:bg-white/10 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                }`}
              >
                Cancel
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors shadow-2xs cursor-pointer ml-0.5 ${
              isDark
                ? 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
                : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Full-Screen Body */}
      <main className="max-w-2xl mx-auto w-full p-4 sm:p-6 flex-1 flex flex-col space-y-2.5">
        {history.length === 0 ? (
          <div className={`my-auto py-12 text-center rounded-2xl border shadow-xs p-6 space-y-2 ${
            isDark ? 'bg-[#0F1E4A]/80 border-blue-400/30 text-white' : 'bg-white rounded-2xl border-slate-200/90 text-slate-600'
          }`}>
            <Mail className={`w-8 h-8 mx-auto ${isDark ? 'text-sky-300' : 'text-slate-300'}`} />
            <p className={`text-xs font-semibold ${isDark ? 'text-sky-200' : 'text-slate-500'}`}>
              No mail history saved yet.
            </p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className={`p-3 sm:p-3.5 rounded-xl border transition-all flex items-center justify-between shadow-2xs gap-2 ${
                isDark
                  ? 'bg-[#0D1A3F] border-blue-400/25 hover:border-blue-400/60 text-white'
                  : 'border-slate-200/90 bg-white hover:border-slate-300 text-[#0A0A2C]'
              }`}
            >
              <div
                onClick={() => handleCopyHistoryItem(item)}
                className="min-w-0 flex-1 cursor-pointer select-none"
              >
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                  <span className={`text-xs sm:text-sm font-normal-typing font-normal truncate select-all ${isDark ? 'text-white' : 'text-[#0A0A2C]'}`}>
                    {item.address}
                  </span>
                </div>
                <div className={`flex items-center gap-1 mt-0.5 text-[10px] ${isDark ? 'text-sky-300/60' : 'text-slate-400'}`}>
                  <Clock className="w-3 h-3" />
                  <span>{item.copiedAt || `${item.date} ${item.time}`}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopyHistoryItem(item)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs active:scale-95 ${
                    copiedId === item.id
                      ? 'bg-emerald-600 text-white'
                      : isDark
                      ? 'bg-white/10 hover:bg-white/20 text-sky-200 border border-white/20'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                  }`}
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                {onDeleteHistoryItem && (
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onDeleteHistoryItem(item.id);
                      onTriggerToast('Address removed', 'info');
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Delete address"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};
