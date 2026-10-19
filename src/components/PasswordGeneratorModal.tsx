import React, { useState } from 'react';
import {
  X,
  KeyRound,
  Copy,
  Check,
  Sparkles,
  ArrowLeft,
  Hash,
} from 'lucide-react';
import { sounds } from '../utils/audio';
import { copyToClipboard } from '../utils/clipboard';

// Realistic first names for natural password variations
const FIRST_NAMES = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Sam', 'Chris', 'Robin', 'Riley', 'Casey',
  'Jamie', 'Avery', 'Logan', 'Cameron', 'Dakota', 'Reese', 'Skyler', 'Kendall',
  'Peyton', 'Quinn', 'Harper', 'Rowan', 'Hayden', 'Finley', 'Emerson', 'Adrian',
  'Charlie', 'Kai', 'Eden', 'River', 'Sage', 'Jesse', 'Drew', 'Sidney', 'Micah',
  'Devon', 'Blair', 'Dallas', 'Milan', 'Paris', 'London', 'Sydney', 'Bailey',
  'Juwel', 'Ahammed', 'Rahman', 'Kabir', 'Hasan', 'Shuvo', 'Tanvir', 'Arif'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
];

const COOL_WORDS = [
  'Shadow', 'Falcon', 'Phoenix', 'Viper', 'Thunder', 'Storm', 'Blaze', 'Titan',
  'Dragon', 'Matrix', 'Neon', 'Cosmic', 'Solar', 'Lunar', 'Silver', 'Golden',
  'Cyber', 'Alpha', 'Omega', 'Nova', 'Apex', 'Pixel', 'Echo', 'Vortex', 'Phantom',
];

interface PasswordPattern {
  style: 'compoundName' | 'singleName' | 'coolWord' | 'random';
  casing: 'allLower' | 'allUpper' | 'titleCase' | 'camelCase';
  innerDelimiter?: string;
  separator: string;
  endingDigits: string;
  length: number;
}

function analyzePasswordInput(input: string): PasswordPattern {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      style: 'singleName',
      casing: 'titleCase',
      separator: '@',
      endingDigits: '123',
      length: 8,
    };
  }

  const match = trimmed.match(/^(.*?)([\W_]+)?(\d*)$/);
  const wordPart = match ? match[1] || '' : trimmed;
  const separator = match && match[2] ? match[2] : '@';
  const endingDigits = match && match[3] ? match[3] : Math.floor(100 + Math.random() * 900).toString();

  let casing: 'allLower' | 'allUpper' | 'titleCase' | 'camelCase' = 'titleCase';
  if (/^[a-z]+$/.test(wordPart)) casing = 'allLower';
  else if (/^[A-Z]+$/.test(wordPart)) casing = 'allUpper';
  else if (/^[A-Z][a-z]+[A-Z]/.test(wordPart)) casing = 'camelCase';
  else casing = 'titleCase';

  let innerDelimiter: string | undefined = undefined;
  if (wordPart.includes('.')) innerDelimiter = '.';
  else if (wordPart.includes('_')) innerDelimiter = '_';
  else if (wordPart.includes('-')) innerDelimiter = '-';

  return {
    style: innerDelimiter ? 'compoundName' : 'singleName',
    casing,
    innerDelimiter,
    separator,
    endingDigits,
    length: wordPart.length || 8,
  };
}

function applyCasing(word: string, casing: 'allLower' | 'allUpper' | 'titleCase' | 'camelCase'): string {
  if (!word) return '';
  switch (casing) {
    case 'allLower':
      return word.toLowerCase();
    case 'allUpper':
      return word.toUpperCase();
    case 'titleCase':
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    case 'camelCase':
      return word.charAt(0).toLowerCase() + word.slice(1);
    default:
      return word;
  }
}

interface PasswordGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerToast: (msg: string, type?: 'success' | 'info' | 'code') => void;
  themeMode?: 'light' | 'dark';
}

export const PasswordGeneratorModal: React.FC<PasswordGeneratorModalProps> = ({
  isOpen,
  onClose,
  onTriggerToast,
  themeMode = 'light',
}) => {
  const isDark = themeMode === 'dark';
  // Starts with clean empty input and empty passwords list
  const [baseInput, setBaseInput] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('10');
  const [passwords, setPasswords] = useState<string[]>([]);
  const [isCopiedAll, setIsCopiedAll] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    sounds.playClick();
    // Unlimited quantity support - no artificial 50-limit cap
    const count = Math.max(1, parseInt(quantity, 10) || 10);
    const targetPattern = (baseInput && baseInput.trim()) ? baseInput.trim() : 'Alex@123';
    const parsed = analyzePasswordInput(targetPattern);

    const list: string[] = [];
    const firstLen = FIRST_NAMES.length;
    const lastLen = LAST_NAMES.length;
    const coolLen = COOL_WORDS.length;

    for (let i = 0; i < count; i++) {
      let wordPart = '';
      if (parsed.style === 'compoundName') {
        const first = FIRST_NAMES[Math.floor(Math.random() * firstLen)];
        const last = LAST_NAMES[Math.floor(Math.random() * lastLen)];
        if (parsed.innerDelimiter) {
          wordPart = `${applyCasing(first, parsed.casing)}${parsed.innerDelimiter}${applyCasing(last, parsed.casing)}`;
        } else if (parsed.casing === 'allLower') {
          wordPart = `${first.toLowerCase()}${last.toLowerCase()}`;
        } else if (parsed.casing === 'allUpper') {
          wordPart = `${first.toUpperCase()}${last.toUpperCase()}`;
        } else {
          wordPart = `${applyCasing(first, 'titleCase')}${applyCasing(last, 'titleCase')}`;
        }
      } else if (parsed.style === 'coolWord') {
        const cw = COOL_WORDS[Math.floor(Math.random() * coolLen)];
        wordPart = applyCasing(cw, parsed.casing);
      } else {
        const fn = FIRST_NAMES[Math.floor(Math.random() * firstLen)];
        wordPart = applyCasing(fn, parsed.casing);
      }

      // Append user defined separator and numbers
      const finalPassword = `${wordPart}${parsed.separator}${parsed.endingDigits}`;
      list.push(finalPassword);
    }

    setPasswords(list);
    sounds.playSuccessChime();
    onTriggerToast(`Generated ${list.length.toLocaleString()} passwords`, 'info');
  };

  // When clicking Password All Copy: copy to clipboard AND vanish passwords immediately from screen
  const handleCopyAll = async () => {
    if (passwords.length === 0) return;
    sounds.playClick();
    const count = passwords.length;
    const text = passwords.join('\n');
    await copyToClipboard(text);
    sounds.playSuccessChime();
    setIsCopiedAll(true);
    onTriggerToast(`Copied all ${count} passwords`, 'success');

    // Instantly vanish/clear the passwords from screen per user request
    setPasswords([]);
    setTimeout(() => setIsCopiedAll(false), 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-50 flex flex-col w-full h-full overflow-y-auto animate-in fade-in duration-150 pb-16 sm:pb-20 transition-colors ${
        isDark
          ? 'bg-[#081229] text-white'
          : 'bg-[#F8FAFC] text-[#0A0A2C]'
      }`}
    >
      {/* Sleek Blue Header */}
      <header
        className={`sticky top-0 z-20 backdrop-blur-md border-b px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shadow-xs transition-colors ${
          isDark
            ? 'bg-[#0B1536]/95 border-slate-700/80 text-white'
            : 'bg-white/95 border-slate-200 text-[#0A0A2C]'
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs ${
              isDark
                ? 'bg-slate-800/95 hover:bg-slate-700 border-slate-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
            }`}
            title="Back to home"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#2563EB] to-[#4F46E5] text-white flex items-center justify-center shadow-xs">
              <KeyRound className="w-4 h-4" />
            </div>
            <h1 className={`text-sm sm:text-base font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#0A0A2C]'}`}>
              Password Generator
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors shadow-xs cursor-pointer ${
            isDark
              ? 'border-slate-600 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white'
              : 'border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 w-full max-w-2xl mx-auto p-3 sm:p-5 space-y-4">
        {/* Controls Card - Clean Blue Palette */}
        <section
          className={`rounded-2xl border p-4 sm:p-5 shadow-xs space-y-3.5 transition-colors ${
            isDark
              ? 'bg-[#0F1E4A] border-blue-400/30 text-white'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
            <div className="flex-1 w-full space-y-1">
              <label className={`text-xs font-black uppercase tracking-wider block ${isDark ? 'text-sky-300' : 'text-blue-700'}`}>
                Typing Your Password
              </label>
              <input
                type="text"
                value={baseInput}
                onChange={(e) => setBaseInput(e.target.value)}
                placeholder="Typing your password (e.g. Alex@123)..."
                className={`w-full px-3.5 py-2 rounded-xl border outline-none text-xs sm:text-sm font-semibold transition-all ${
                  isDark
                    ? 'bg-[#081229] border-slate-700 text-white placeholder-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20'
                }`}
              />
            </div>

            <div className="w-full sm:w-32 space-y-1">
              <label className={`text-xs font-black uppercase tracking-wider block ${isDark ? 'text-sky-300' : 'text-blue-700'}`}>
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="10"
                className={`w-full px-3 py-2 rounded-xl border outline-none text-xs sm:text-sm font-extrabold transition-all text-center ${
                  isDark
                    ? 'bg-[#081229] border-slate-700 text-white focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20'
                }`}
              />
            </div>
          </div>

          {/* Action Row: Generate Button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleGenerate}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] hover:opacity-95 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Passwords</span>
            </button>
          </div>
        </section>

        {/* Empty State before User Generates */}
        {passwords.length === 0 && (
          <section
            className={`rounded-2xl border border-dashed p-6 text-center space-y-1.5 transition-colors ${
              isDark
                ? 'bg-[#0F1E4A]/50 border-blue-400/30 text-white'
                : 'bg-white/90 border-slate-300 text-slate-700'
            }`}
          >
            <KeyRound className={`w-7 h-7 mx-auto stroke-[1.5] ${isDark ? 'text-sky-300' : 'text-blue-600'}`} />
            <h3 className={`text-xs sm:text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Ready to Generate
            </h3>
            <p className={`text-xs max-w-sm mx-auto ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
              Type your pattern above and click 'Generate Passwords'.
            </p>
          </section>
        )}

        {/* Passwords Output List with "Password All Copy" Button */}
        {passwords.length > 0 && (
          <section className="space-y-3">
            {/* Header with ONLY "Password All Copy" Button */}
            <div className="flex items-center justify-between px-1">
              <div className={`flex items-center gap-1.5 text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Hash className="w-4 h-4 text-blue-500" />
                <span>Generated Passwords ({passwords.length})</span>
              </div>

              {/* Password All Copy Button: copies all and vanishes passwords from screen */}
              <button
                type="button"
                onClick={handleCopyAll}
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer hover:opacity-95"
                title="Copy all passwords and clear"
              >
                {isCopiedAll ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Copied & Vanished!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Password All Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Password items cleanly displayed in NORMAL standard keyboard typing font */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {passwords.map((pwd, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 sm:p-3 rounded-xl border transition-all flex items-center justify-between shadow-2xs select-text ${
                    isDark
                      ? 'bg-[#101F4E] border-blue-400/30 hover:border-sky-400 text-white'
                      : 'border-slate-200 bg-white hover:border-blue-400 text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`text-[11px] font-bold w-5 shrink-0 ${isDark ? 'text-sky-300/70' : 'text-slate-400'}`}>
                      {idx + 1}.
                    </span>
                    {/* Normal clean standard keyboard typing font without fancy styling */}
                    <span className={`text-xs sm:text-sm font-normal tracking-normal truncate select-all ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {pwd}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
