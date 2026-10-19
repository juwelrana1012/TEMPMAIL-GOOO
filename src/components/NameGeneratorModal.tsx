import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  RefreshCw,
  UserCheck,
  Check,
  Globe,
  ArrowLeft,
  KeyRound,
  Eye,
  EyeOff,
  Save,
  Lock,
  Search,
  Database,
  CloudCheck,
  ChevronDown,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import {
  ALL_COUNTRIES_NAMES,
  getCountryNameByIndex,
  CountryNameData,
  TOTAL_NAMES_PER_CATEGORY,
} from '../data/namesData';
import {
  subscribeToCountryStat,
  incrementCountryStat,
  getCachedStat,
  CountryStat,
} from '../services/firebase';
import { copyToClipboard } from '../utils/clipboard';
import { sounds } from '../utils/audio';

type NameOptionKey = 'firstName' | 'lastName' | 'fullName' | 'password';

const STORAGE_KEY_OPTIONS = 'name_generator_saved_options';
const STORAGE_KEY_SAVED_PASSWORD = 'tempmail_name_generator_saved_password';
const STORAGE_KEY_SELECTED_COUNTRY = 'tempmail_name_generator_selected_country';
const STORAGE_KEY_SELECTED_GENDER = 'tempmail_name_generator_selected_gender';
const STORAGE_KEY_LAST_GENERATED = 'tempmail_name_generator_last_generated';

const DEFAULT_OPTIONS: NameOptionKey[] = ['firstName', 'lastName'];

const OPTION_LABELS: { key: NameOptionKey; label: string }[] = [
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'fullName', label: 'Full Name' },
  { key: 'password', label: 'Password' },
];

function generateSecurePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%&*';
  let pwd = '';
  const uppers = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lowers = 'abcdefghjkmnpqrstuvwxyz';
  const digits = '23456789';
  const specials = '!@#$%&*';
  pwd += uppers[Math.floor(Math.random() * uppers.length)];
  pwd += lowers[Math.floor(Math.random() * lowers.length)];
  pwd += digits[Math.floor(Math.random() * digits.length)];
  pwd += specials[Math.floor(Math.random() * specials.length)];
  for (let i = 0; i < 6; i++) {
    pwd += chars[Math.floor(Math.random() * chars.length)];
  }
  return pwd.split('').sort(() => Math.random() - 0.5).join('');
}

interface NameGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerToast: (msg: string, type?: 'success' | 'info' | 'code') => void;
  themeMode?: 'light' | 'dark';
}

export const NameGeneratorModal: React.FC<NameGeneratorModalProps> = ({
  isOpen,
  onClose,
  onTriggerToast,
  themeMode = 'light',
}) => {
  const isDark = themeMode === 'dark';

  const [selectedCountryId, setSelectedCountryId] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_SELECTED_COUNTRY) || 'bangladesh';
    } catch {
      return 'bangladesh';
    }
  });

  const [gender, setGender] = useState<'female' | 'male'>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEY_SELECTED_GENDER) as 'female' | 'male') || 'female';
    } catch {
      return 'female';
    }
  });

  // Dropdown popover open states
  const [isChoiceOpen, setIsChoiceOpen] = useState<boolean>(false);
  const [isCountryOpen, setIsCountryOpen] = useState<boolean>(false);
  const [isGenderOpen, setIsGenderOpen] = useState<boolean>(false);

  const choiceRef = useRef<HTMLDivElement>(null);
  const countryRef = useRef<HTMLDivElement>(null);
  const genderRef = useRef<HTMLDivElement>(null);

  const [countrySearch, setCountrySearch] = useState<string>('');

  // Permanent Saved Password state
  const [savedPassword, setSavedPassword] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_SAVED_PASSWORD) || '';
    } catch {
      return '';
    }
  });
  const [passwordInput, setPasswordInput] = useState<string>(savedPassword);
  const [showSavedPasswordText, setShowSavedPasswordText] = useState<boolean>(false);

  // Saved selection of options
  const [savedOptions, setSavedOptions] = useState<NameOptionKey[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_OPTIONS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_OPTIONS;
  });

  // Interactive checkbox states inside Choice Save popover before clicking Save
  const [selectedOptions, setSelectedOptions] = useState<NameOptionKey[]>(savedOptions);

  const [generatedData, setGeneratedData] = useState<{
    firstName: string;
    lastName: string;
    fullName: string;
    password: string;
  }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LAST_GENERATED);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.firstName) return parsed;
      }
    } catch {}
    return {
      firstName: '',
      lastName: '',
      fullName: '',
      password: '',
    };
  });

  const [countryStat, setCountryStat] = useState<CountryStat>(() =>
    getCachedStat(selectedCountryId, gender)
  );

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showResultPassword, setShowResultPassword] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const copyTimeoutRef = useRef<any>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (choiceRef.current && !choiceRef.current.contains(target)) {
        setIsChoiceOpen(false);
      }
      if (countryRef.current && !countryRef.current.contains(target)) {
        setIsCountryOpen(false);
      }
      if (genderRef.current && !genderRef.current.contains(target)) {
        setIsGenderOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered countries based on search across 195 nations
  const filteredCountries = countrySearch.trim()
    ? ALL_COUNTRIES_NAMES.filter((c) => {
        const q = countrySearch.toLowerCase().trim();
        return (
          c.countryName.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          (c.countryNameBn && c.countryNameBn.includes(q))
        );
      })
    : ALL_COUNTRIES_NAMES;

  // Sync checkboxes if savedOptions changes
  useEffect(() => {
    setSelectedOptions(savedOptions);
  }, [savedOptions]);

  // Live Firebase subscription to ensure persistent count and multi-user concurrency
  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = subscribeToCountryStat(selectedCountryId, gender, (stat) => {
      setCountryStat(stat);
    });
    return () => {
      unsubscribe();
    };
  }, [selectedCountryId, gender, isOpen]);

  // Handle option checkbox toggle inside Choice popover
  const handleToggleOption = (key: NameOptionKey) => {
    sounds.playClick();
    setSelectedOptions((prev) => {
      if (prev.includes(key)) {
        if (prev.length === 1) {
          onTriggerToast('Keep at least one option selected', 'info');
          return prev;
        }
        return prev.filter((k) => k !== key);
      } else {
        if (key === 'password' && !passwordInput.trim()) {
          setPasswordInput(generateSecurePassword());
        }
        return [...prev, key];
      }
    });
  };

  // Save selected options inside Choice Save popover
  const handleSaveOptions = () => {
    sounds.playClick();
    if (selectedOptions.length === 0) {
      onTriggerToast('Select at least one option', 'info');
      return;
    }

    setSavedOptions(selectedOptions);
    try {
      localStorage.setItem(STORAGE_KEY_OPTIONS, JSON.stringify(selectedOptions));
    } catch {}

    // Save custom password if provided
    const trimmedPass = passwordInput.trim();
    if (trimmedPass) {
      setSavedPassword(trimmedPass);
      try {
        localStorage.setItem(STORAGE_KEY_SAVED_PASSWORD, trimmedPass);
      } catch {}
    } else if (!selectedOptions.includes('password')) {
      setSavedPassword('');
      try {
        localStorage.removeItem(STORAGE_KEY_SAVED_PASSWORD);
      } catch {}
    }

    setIsChoiceOpen(false);
    sounds.playSuccessChime();
    onTriggerToast('Preferences saved successfully', 'success');
  };

  /**
   * Generates next distinct name from 5,000 sequence, updates Firebase, and copies selected options.
   */
  const handleGenerate = async (
    countryId = selectedCountryId,
    g = gender,
    opts = savedOptions,
    isInitialDisplay = false
  ) => {
    sounds.playClick();

    let activeStat = getCachedStat(countryId, g);

    // If it's a new generation action, increment in Firebase
    if (!isInitialDisplay || activeStat.usedCount === 0) {
      activeStat = await incrementCountryStat(countryId, g, '');
    }
    setCountryStat(activeStat);

    // Exact name by index (0-based: name #1 is index 0, name #5000 is index 4999)
    const targetIndex = Math.max(0, (activeStat.usedCount - 1) % TOTAL_NAMES_PER_CATEGORY);
    const nameResult = getCountryNameByIndex(countryId, g, targetIndex);
    const activePassword = savedPassword && savedPassword.trim() ? savedPassword.trim() : generateSecurePassword();

    const newData = {
      firstName: nameResult.firstName,
      lastName: nameResult.lastName,
      fullName: nameResult.fullName,
      password: activePassword,
    };
    setGeneratedData(newData);
    try {
      localStorage.setItem(STORAGE_KEY_LAST_GENERATED, JSON.stringify(newData));
      localStorage.setItem(STORAGE_KEY_SELECTED_COUNTRY, countryId);
      localStorage.setItem(STORAGE_KEY_SELECTED_GENDER, g);
    } catch {}

    // Filter only the items that were selected and saved
    const itemsToCopy: { key: NameOptionKey; label: string; value: string }[] = [];
    if (opts.includes('firstName')) {
      itemsToCopy.push({ key: 'firstName', label: 'First Name', value: newData.firstName });
    }
    if (opts.includes('lastName')) {
      itemsToCopy.push({ key: 'lastName', label: 'Last Name', value: newData.lastName });
    }
    if (opts.includes('fullName')) {
      itemsToCopy.push({ key: 'fullName', label: 'Full Name', value: newData.fullName });
    }
    if (opts.includes('password')) {
      itemsToCopy.push({ key: 'password', label: 'Password', value: newData.password });
    }

    if (itemsToCopy.length > 0 && !isInitialDisplay) {
      for (let i = itemsToCopy.length - 1; i >= 0; i--) {
        await copyToClipboard(itemsToCopy[i].value);
        if (i > 0) {
          await new Promise((resolve) => setTimeout(resolve, 80));
        }
      }

      sounds.playSuccessChime();
      setCopiedKey('all');

      const labels = itemsToCopy.map((item) => item.label).join(' & ');
      onTriggerToast(`Copied: ${labels}`, 'code');
    }

    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => {
      setCopiedKey(null);
    }, 3000);
  };

  // Generate initial values when modal opens if none already saved
  useEffect(() => {
    if (isOpen && !generatedData.firstName) {
      handleGenerate(selectedCountryId, gender, savedOptions, true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Single item copy handler
  const handleSingleCopy = async (key: NameOptionKey, value: string, label: string) => {
    if (!value) return;
    sounds.playClick();
    await copyToClipboard(value);
    sounds.playSuccessChime();
    setCopiedKey(key);
    onTriggerToast(`Copied: ${value}`, 'code');

    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => {
      setCopiedKey(null);
    }, 2500);
  };

  const currentCountry =
    ALL_COUNTRIES_NAMES.find((c) => c.id === selectedCountryId) || ALL_COUNTRIES_NAMES[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto flex flex-col transition-colors duration-200"
      style={{
        backgroundColor: isDark ? '#081229' : '#F8FAFC',
        color: isDark ? '#FFFFFF' : '#0F172A',
      }}
    >
      {/* Sleek Minimal Header */}
      <header
        className={`px-4 sm:px-6 py-3 border-b flex items-center justify-between sticky top-0 z-40 backdrop-blur-md transition-colors ${
          isDark ? 'bg-[#0B1536]/95 border-slate-700/80 shadow-md' : 'bg-white/95 border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs ${
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
              <UserCheck className="w-4 h-4" />
            </div>
            <h1 className={`text-sm sm:text-base font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#0A0A2C]'}`}>
              Name Generator
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

      {/* Main Container - Compact, centered, no edge-to-edge stretching */}
      <main className="max-w-xl mx-auto w-full p-3 sm:p-5 flex-1 flex flex-col space-y-3">
        
        {/* TOP ROW: INLINE FIT-CONTENT CONTROLS (Snug fit, English only) */}
        <section className="relative z-30 flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
          
          {/* 1. CHOICE SAVE SNUG DROPDOWN WITH ARROW */}
          <div ref={choiceRef} className="relative inline-block">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setIsChoiceOpen(!isChoiceOpen);
                setIsCountryOpen(false);
                setIsGenderOpen(false);
              }}
              className={`inline-flex items-center gap-2 py-1.5 px-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer shadow-xs active:scale-95 ${
                isChoiceOpen
                  ? isDark
                    ? 'border-sky-400 bg-sky-500/30 text-white ring-2 ring-sky-400/40'
                    : 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/25'
                  : isDark
                  ? 'border-blue-400/40 bg-[#122254] hover:bg-[#182C6E] text-white'
                  : 'border-slate-300 bg-white hover:border-blue-500 hover:bg-slate-50 text-slate-800'
              }`}
            >
              <SlidersHorizontal className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-sky-300' : 'text-blue-600'}`} />
              <span>Choice Save</span>
              <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md ${
                isDark ? 'bg-sky-400/30 text-sky-200 border border-sky-400/40' : 'bg-blue-100 text-blue-700'
              }`}>
                {savedOptions.length}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isChoiceOpen ? 'rotate-180 text-sky-400' : isDark ? 'text-slate-300' : 'text-slate-500'}`} />
            </button>

            {/* Choice Save Popover */}
            {isChoiceOpen && (
              <div
                className={`absolute left-0 mt-2 w-72 sm:w-80 p-3.5 rounded-2xl border shadow-2xl z-50 space-y-2.5 animate-in fade-in zoom-in-95 ${
                  isDark
                    ? 'bg-[#0E1A3D] border-blue-400/40 text-white shadow-[0_20px_50px_rgba(0,0,0,0.85)]'
                    : 'bg-white border-slate-300 text-slate-900 shadow-2xl'
                }`}
              >
                <div className={`flex items-center justify-between pb-2 border-b ${isDark ? 'border-slate-700/80' : 'border-slate-200'}`}>
                  <span className={`text-xs font-black flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <SlidersHorizontal className="w-3.5 h-3.5 text-blue-500" />
                    <span>Choice Options</span>
                  </span>
                  <span className={`text-[11px] font-black ${isDark ? 'text-sky-300' : 'text-blue-600'}`}>
                    {selectedOptions.length} of 4 Selected
                  </span>
                </div>

                {/* 4 Options: First Name, Last Name, Full Name, Password */}
                <div className="space-y-1.5">
                  {OPTION_LABELS.map(({ key, label }) => {
                    const isSelected = selectedOptions.includes(key);
                    return (
                      <div key={key} className="space-y-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleOption(key)}
                          className={`w-full px-3 py-2 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? isDark
                                ? 'border-sky-400 bg-sky-500/25 text-white ring-1 ring-sky-400/40 shadow-xs'
                                : 'border-blue-600 bg-blue-50 text-blue-800 shadow-xs font-black'
                              : isDark
                              ? 'border-slate-700 bg-[#09132D] text-slate-200 hover:border-slate-500 hover:text-white'
                              : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {key === 'password' && <Lock className="w-3.5 h-3.5 text-emerald-400" />}
                            <span className={`font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>{label}</span>
                          </span>

                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                              isSelected
                                ? isDark
                                  ? 'bg-sky-400 border-sky-400 text-[#081229]'
                                  : 'bg-blue-600 border-blue-600 text-white'
                                : isDark
                                ? 'border-slate-600 bg-slate-900/60'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </button>

                        {/* Inline Password Setup when Password is selected */}
                        {key === 'password' && isSelected && (
                          <div className={`p-2.5 rounded-xl border space-y-2 animate-in fade-in duration-150 ${
                            isDark ? 'bg-[#071026] border-emerald-500/40 text-white' : 'bg-emerald-50/70 border-emerald-300 text-slate-900'
                          }`}>
                            <div className="flex items-center justify-between text-[11px] font-black">
                              <span className={`flex items-center gap-1 ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                                <Lock className="w-3 h-3 text-emerald-500" />
                                <span>Set Custom Password</span>
                              </span>

                              <button
                                type="button"
                                onClick={() => {
                                  sounds.playClick();
                                  const gen = generateSecurePassword();
                                  setPasswordInput(gen);
                                  onTriggerToast('New password generated', 'info');
                                }}
                                className={`text-[11px] flex items-center gap-1 font-bold hover:underline cursor-pointer ${
                                  isDark ? 'text-sky-300' : 'text-blue-600'
                                }`}
                                title="Generate new secure password"
                              >
                                <Sparkles className="w-3 h-3 text-amber-400" />
                                <span>Generate New</span>
                              </button>
                            </div>

                            <div className="relative">
                              <input
                                type={showSavedPasswordText ? 'text' : 'password'}
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                placeholder="Enter custom password..."
                                className={`w-full pl-2.5 pr-8 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                                  isDark
                                    ? 'bg-[#0B1536] border-slate-600 text-white placeholder-slate-400 focus:border-emerald-400'
                                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-500'
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() => setShowSavedPasswordText(!showSavedPasswordText)}
                                className={`absolute inset-y-0 right-0 pr-2.5 flex items-center cursor-pointer ${
                                  isDark ? 'text-sky-300 hover:text-white' : 'text-slate-500 hover:text-slate-800'
                                }`}
                              >
                                {showSavedPasswordText ? (
                                  <EyeOff className="w-3.5 h-3.5" />
                                ) : (
                                  <Eye className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Save Button inside Choice Popover */}
                <div className={`pt-2 border-t flex justify-end ${isDark ? 'border-slate-700/80' : 'border-slate-200'}`}>
                  <button
                    type="button"
                    onClick={handleSaveOptions}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. COUNTRY SNUG DROPDOWN WITH ARROW */}
          <div ref={countryRef} className="relative inline-block">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setIsCountryOpen(!isCountryOpen);
                setIsChoiceOpen(false);
                setIsGenderOpen(false);
              }}
              className={`inline-flex items-center gap-2 py-1.5 px-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer shadow-xs active:scale-95 ${
                isCountryOpen
                  ? isDark
                    ? 'border-sky-400 bg-sky-500/30 text-white ring-2 ring-sky-400/40'
                    : 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/25'
                  : isDark
                  ? 'border-blue-400/40 bg-[#122254] hover:bg-[#182C6E] text-white'
                  : 'border-slate-300 bg-white hover:border-blue-500 hover:bg-slate-50 text-slate-800'
              }`}
            >
              <span className="text-sm shrink-0">{currentCountry.flag}</span>
              <span className="font-extrabold">{currentCountry.countryName}</span>
              <span className={`text-[10px] font-mono font-bold px-1 py-0.2 rounded ${
                isDark ? 'bg-sky-400/30 text-sky-200 border border-sky-400/40' : 'bg-blue-100 text-blue-700'
              }`}>
                ({currentCountry.code})
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCountryOpen ? 'rotate-180 text-sky-400' : isDark ? 'text-slate-300' : 'text-slate-500'}`} />
            </button>

            {/* Country Selection Popover */}
            {isCountryOpen && (
              <div
                className={`absolute left-0 mt-2 w-80 sm:w-96 max-w-[92vw] p-3 rounded-2xl border shadow-2xl z-50 space-y-2.5 animate-in fade-in zoom-in-95 ${
                  isDark
                    ? 'bg-[#0E1A3D] border-blue-400/40 text-white shadow-[0_20px_50px_rgba(0,0,0,0.85)]'
                    : 'bg-white border-slate-300 text-slate-900 shadow-2xl'
                }`}
              >
                <div className="flex items-center justify-between px-0.5 text-xs font-black">
                  <span className={`flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <Globe className="w-3.5 h-3.5 text-blue-500" />
                    <span>Select Country</span>
                  </span>
                  <span className={`text-[11px] font-black ${isDark ? 'text-sky-300' : 'text-blue-600'}`}>
                    195 Countries
                  </span>
                </div>

                {/* Instant Search input */}
                <div className="relative">
                  <Search className={`w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-sky-300' : 'text-slate-500'}`} />
                  <input
                    type="text"
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    placeholder="Search country (e.g. Bangladesh)..."
                    className={`w-full pl-8 pr-7 py-1.5 rounded-xl border text-xs font-semibold focus:outline-none transition-all ${
                      isDark
                        ? 'bg-[#09132D] border-slate-600 text-white placeholder-slate-400 focus:border-sky-400'
                        : 'border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                    }`}
                  />
                  {countrySearch && (
                    <button
                      type="button"
                      onClick={() => setCountrySearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Scrollable Countries List: Exactly keeps countryName, code and Bengali name as requested */}
                <div className="max-h-56 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {filteredCountries.map((c: CountryNameData) => {
                    const isSelected = c.id === selectedCountryId;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          setSelectedCountryId(c.id);
                          setIsCountryOpen(false);

                          const stat = getCachedStat(c.id, gender);
                          setCountryStat(stat);
                          if (stat.usedCount > 0) {
                            const targetIndex = (stat.usedCount - 1) % TOTAL_NAMES_PER_CATEGORY;
                            const nameResult = getCountryNameByIndex(c.id, gender, targetIndex);
                            const activePassword = savedPassword && savedPassword.trim() ? savedPassword.trim() : generateSecurePassword();
                            const restored = {
                              firstName: nameResult.firstName,
                              lastName: nameResult.lastName,
                              fullName: nameResult.fullName,
                              password: activePassword,
                            };
                            setGeneratedData(restored);
                            try {
                              localStorage.setItem(STORAGE_KEY_LAST_GENERATED, JSON.stringify(restored));
                              localStorage.setItem(STORAGE_KEY_SELECTED_COUNTRY, c.id);
                            } catch {}
                          } else {
                            handleGenerate(c.id, gender, savedOptions, false);
                          }
                        }}
                        className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center transition-colors text-left cursor-pointer ${
                          isSelected
                            ? isDark
                              ? 'bg-blue-600 text-white border border-sky-300 font-extrabold'
                              : 'bg-blue-50 text-blue-700 border border-blue-300 font-extrabold'
                            : isDark
                            ? 'text-white hover:bg-[#182C6E] hover:text-white'
                            : 'text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        {/* Country name, short code, and country Bengali name side-by-side */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-sm shrink-0">{c.flag}</span>
                          <span className={`font-bold ${isSelected ? 'text-white' : isDark ? 'text-white' : 'text-slate-900'}`}>{c.countryName}</span>
                          <span className={`text-[11px] font-mono font-extrabold px-1 py-0.2 rounded border ${
                            isSelected
                              ? 'text-white bg-white/20 border-white/40'
                              : isDark
                              ? 'text-sky-200 bg-sky-500/20 border-sky-400/40'
                              : 'text-blue-700 bg-blue-50 border-blue-200'
                          }`}>
                            ({c.code})
                          </span>
                          {c.countryNameBn && (
                            <span className={`text-xs font-medium ${isSelected ? 'text-blue-100' : isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                              - {c.countryNameBn}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 3. GENDER SNUG DROPDOWN WITH ARROW */}
          <div ref={genderRef} className="relative inline-block">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setIsGenderOpen(!isGenderOpen);
                setIsChoiceOpen(false);
                setIsCountryOpen(false);
              }}
              className={`inline-flex items-center gap-2 py-1.5 px-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer shadow-xs active:scale-95 ${
                isGenderOpen
                  ? isDark
                    ? 'border-sky-400 bg-sky-500/30 text-white ring-2 ring-sky-400/40'
                    : 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/25'
                  : isDark
                  ? 'border-blue-400/40 bg-[#122254] hover:bg-[#182C6E] text-white'
                  : 'border-slate-300 bg-white hover:border-blue-500 hover:bg-slate-50 text-slate-800'
              }`}
            >
              <span className="text-sm shrink-0">{gender === 'female' ? '👩' : '👨'}</span>
              <span className="font-extrabold">{gender === 'female' ? 'Female' : 'Male'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isGenderOpen ? 'rotate-180 text-sky-400' : isDark ? 'text-slate-300' : 'text-slate-500'}`} />
            </button>

            {/* Gender Popover */}
            {isGenderOpen && (
              <div
                className={`absolute left-0 sm:left-auto sm:right-0 mt-2 w-52 p-2 rounded-2xl border shadow-2xl z-50 space-y-1.5 animate-in fade-in zoom-in-95 ${
                  isDark
                    ? 'bg-[#0E1A3D] border-blue-400/40 text-white shadow-[0_20px_50px_rgba(0,0,0,0.85)]'
                    : 'bg-white border-slate-300 text-slate-900 shadow-2xl'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setGender('female');
                    setIsGenderOpen(false);

                    const stat = getCachedStat(selectedCountryId, 'female');
                    setCountryStat(stat);
                    if (stat.usedCount > 0) {
                      const targetIndex = (stat.usedCount - 1) % TOTAL_NAMES_PER_CATEGORY;
                      const nameResult = getCountryNameByIndex(selectedCountryId, 'female', targetIndex);
                      const activePassword = savedPassword && savedPassword.trim() ? savedPassword.trim() : generateSecurePassword();
                      const restored = {
                        firstName: nameResult.firstName,
                        lastName: nameResult.lastName,
                        fullName: nameResult.fullName,
                        password: activePassword,
                      };
                      setGeneratedData(restored);
                      try {
                        localStorage.setItem(STORAGE_KEY_LAST_GENERATED, JSON.stringify(restored));
                        localStorage.setItem(STORAGE_KEY_SELECTED_GENDER, 'female');
                      } catch {}
                    } else {
                      handleGenerate(selectedCountryId, 'female', savedOptions, false);
                    }
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                    gender === 'female'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xs'
                      : isDark
                      ? 'text-slate-200 hover:bg-[#182C6E] hover:text-white'
                      : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>👩</span>
                    <span className="font-extrabold">Female</span>
                  </span>
                  {gender === 'female' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setGender('male');
                    setIsGenderOpen(false);

                    const stat = getCachedStat(selectedCountryId, 'male');
                    setCountryStat(stat);
                    if (stat.usedCount > 0) {
                      const targetIndex = (stat.usedCount - 1) % TOTAL_NAMES_PER_CATEGORY;
                      const nameResult = getCountryNameByIndex(selectedCountryId, 'male', targetIndex);
                      const activePassword = savedPassword && savedPassword.trim() ? savedPassword.trim() : generateSecurePassword();
                      const restored = {
                        firstName: nameResult.firstName,
                        lastName: nameResult.lastName,
                        fullName: nameResult.fullName,
                        password: activePassword,
                      };
                      setGeneratedData(restored);
                      try {
                        localStorage.setItem(STORAGE_KEY_LAST_GENERATED, JSON.stringify(restored));
                        localStorage.setItem(STORAGE_KEY_SELECTED_GENDER, 'male');
                      } catch {}
                    } else {
                      handleGenerate(selectedCountryId, 'male', savedOptions, false);
                    }
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                    gender === 'male'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                      : isDark
                      ? 'text-slate-200 hover:bg-[#182C6E] hover:text-white'
                      : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>👨</span>
                    <span className="font-extrabold">Male</span>
                  </span>
                  {gender === 'male' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              </div>
            )}
          </div>

        </section>

        {/* COMPACT FIREBASE STATUS & PROGRESS */}
        <section
          className={`p-2.5 rounded-2xl border flex flex-col gap-1.5 shadow-xs ${
            isDark
              ? 'bg-[#101D48] border-blue-400/30 text-white'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-1.5 truncate">
              <Database className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className={`font-extrabold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {currentCountry.countryName} ({currentCountry.code}) • {gender === 'male' ? 'Male' : 'Female'}
              </span>
            </div>
            <div className={`flex items-center gap-1 text-[11px] font-extrabold ${isDark ? 'text-emerald-300' : 'text-emerald-600'} shrink-0`}>
              <CloudCheck className="w-3.5 h-3.5" />
              <span>Firebase Synced</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className={`p-1.5 sm:p-2 rounded-xl border flex items-center justify-between ${
              isDark ? 'bg-[#0A1333] border-slate-700/80' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`font-bold text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Used:</span>
              <span className={`font-black ${isDark ? 'text-sky-300' : 'text-blue-600'}`}>
                {countryStat.usedCount.toLocaleString()} / 5,000
              </span>
            </div>

            <div className={`p-1.5 sm:p-2 rounded-xl border flex items-center justify-between ${
              isDark ? 'bg-[#0A1333] border-slate-700/80' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`font-bold text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Remaining:</span>
              <span className={`font-black ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                {countryStat.remainingCount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Micro Progress Bar */}
          <div className={`w-full rounded-full h-1.5 overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0.5, (countryStat.usedCount / TOTAL_NAMES_PER_CATEGORY) * 100))}%` }}
            />
          </div>
        </section>

        {/* PROMINENT NEW NAME GENERATE BUTTON */}
        <section>
          <button
            type="button"
            disabled={isGenerating}
            onClick={async () => {
              setIsGenerating(true);
              try {
                await handleGenerate(selectedCountryId, gender, savedOptions, false);
              } finally {
                setTimeout(() => {
                  setIsGenerating(false);
                }, 600);
              }
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] hover:opacity-95 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-85"
          >
            <RefreshCw className={`w-4 h-4 transition-transform duration-500 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>New Name Generate</span>
          </button>
        </section>

        {/* GENERATED RESULTS: High-Contrast, Crystal Clear in Dark & Light Modes */}
        <section className="space-y-2">
          {savedOptions.map((key) => {
            if (key === 'firstName') {
              return (
                <div
                  key="firstName"
                  onClick={() => handleSingleCopy('firstName', generatedData.firstName, 'First Name')}
                  role="button"
                  tabIndex={0}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between shadow-xs hover:shadow-md select-none ${
                    copiedKey === 'all' || copiedKey === 'firstName'
                      ? 'border-[#2563EB] bg-blue-50/70 dark:bg-blue-950/60 ring-2 ring-[#2563EB]/50'
                      : isDark
                      ? 'border-blue-400/40 bg-[#101F4E] hover:border-sky-400 text-white'
                      : 'border-slate-200 bg-white hover:border-blue-400 text-slate-900'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <span className={`text-[11px] font-black uppercase tracking-wider block mb-0.5 ${
                      isDark ? 'text-sky-300' : 'text-blue-700'
                    }`}>
                      First Name
                    </span>
                    <span className={`text-base sm:text-lg font-black block truncate ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {generatedData.firstName || '—'}
                    </span>
                  </div>
                  {copiedKey === 'all' || copiedKey === 'firstName' ? (
                    <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-emerald-600 text-white flex items-center gap-1 shrink-0 shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Copied</span>
                    </span>
                  ) : (
                    <span className={`text-xs font-black px-3 py-1.5 rounded-xl border shrink-0 transition-colors ${
                      isDark ? 'bg-sky-500/20 text-sky-200 border-sky-400/50 hover:bg-sky-500/30' : 'text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100'
                    }`}>
                      Copy
                    </span>
                  )}
                </div>
              );
            }

            if (key === 'lastName') {
              return (
                <div
                  key="lastName"
                  onClick={() => handleSingleCopy('lastName', generatedData.lastName, 'Last Name')}
                  role="button"
                  tabIndex={0}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between shadow-xs hover:shadow-md select-none ${
                    copiedKey === 'all' || copiedKey === 'lastName'
                      ? 'border-[#7C3AED] bg-purple-50/70 dark:bg-purple-950/60 ring-2 ring-[#7C3AED]/50'
                      : isDark
                      ? 'border-purple-400/40 bg-[#101F4E] hover:border-purple-400 text-white'
                      : 'border-slate-200 bg-white hover:border-purple-400 text-slate-900'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <span className={`text-[11px] font-black uppercase tracking-wider block mb-0.5 ${
                      isDark ? 'text-purple-300' : 'text-purple-700'
                    }`}>
                      Last Name
                    </span>
                    <span className={`text-base sm:text-lg font-black block truncate ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {generatedData.lastName || '—'}
                    </span>
                  </div>
                  {copiedKey === 'all' || copiedKey === 'lastName' ? (
                    <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-emerald-600 text-white flex items-center gap-1 shrink-0 shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Copied</span>
                    </span>
                  ) : (
                    <span className={`text-xs font-black px-3 py-1.5 rounded-xl border shrink-0 transition-colors ${
                      isDark ? 'bg-purple-500/20 text-purple-200 border-purple-400/50 hover:bg-purple-500/30' : 'text-purple-700 bg-purple-50 border-purple-200 hover:bg-purple-100'
                    }`}>
                      Copy
                    </span>
                  )}
                </div>
              );
            }

            if (key === 'fullName') {
              return (
                <div
                  key="fullName"
                  onClick={() => handleSingleCopy('fullName', generatedData.fullName, 'Full Name')}
                  role="button"
                  tabIndex={0}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between shadow-xs hover:shadow-md select-none ${
                    copiedKey === 'all' || copiedKey === 'fullName'
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 ring-2 ring-indigo-600/50'
                      : isDark
                      ? 'border-indigo-400/40 bg-[#101F4E] hover:border-indigo-400 text-white'
                      : 'border-slate-200 bg-white hover:border-indigo-400 text-slate-900'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <span className={`text-[11px] font-black uppercase tracking-wider block mb-0.5 ${
                      isDark ? 'text-indigo-300' : 'text-indigo-700'
                    }`}>
                      Full Name
                    </span>
                    <span className={`text-base sm:text-lg font-black block truncate ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {generatedData.fullName || '—'}
                    </span>
                  </div>
                  {copiedKey === 'all' || copiedKey === 'fullName' ? (
                    <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-emerald-600 text-white flex items-center gap-1 shrink-0 shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Copied</span>
                    </span>
                  ) : (
                    <span className={`text-xs font-black px-3 py-1.5 rounded-xl border shrink-0 transition-colors ${
                      isDark ? 'bg-indigo-500/20 text-indigo-200 border-indigo-400/50 hover:bg-indigo-500/30' : 'text-indigo-700 bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
                    }`}>
                      Copy
                    </span>
                  )}
                </div>
              );
            }

            if (key === 'password') {
              return (
                <div
                  key="password"
                  onClick={() => handleSingleCopy('password', generatedData.password, 'Password')}
                  role="button"
                  tabIndex={0}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between shadow-xs hover:shadow-md select-none ${
                    copiedKey === 'all' || copiedKey === 'password'
                      ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/60 ring-2 ring-emerald-600/50'
                      : isDark
                      ? 'border-emerald-400/40 bg-[#101F4E] hover:border-emerald-400 text-white'
                      : 'border-slate-200 bg-white hover:border-emerald-400 text-slate-900'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <KeyRound className="w-3.5 h-3.5 text-emerald-500" />
                      <span className={`text-[11px] font-black uppercase tracking-wider ${
                        isDark ? 'text-emerald-400' : 'text-emerald-700'
                      }`}>
                        Password
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm sm:text-base font-mono font-black truncate ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {showResultPassword ? generatedData.password : '••••••••••••'}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowResultPassword(!showResultPassword);
                        }}
                        className={`p-1 transition-colors cursor-pointer ${isDark ? 'text-sky-300 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}
                        title={showResultPassword ? 'Hide' : 'Show'}
                      >
                        {showResultPassword ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                  {copiedKey === 'all' || copiedKey === 'password' ? (
                    <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-emerald-600 text-white flex items-center gap-1 shrink-0 shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Copied</span>
                    </span>
                  ) : (
                    <span className={`text-xs font-black px-3 py-1.5 rounded-xl border shrink-0 transition-colors ${
                      isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 hover:bg-emerald-500/30' : 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                    }`}>
                      Copy
                    </span>
                  )}
                </div>
              );
            }

            return null;
          })}
        </section>
      </main>
    </div>
  );
};
