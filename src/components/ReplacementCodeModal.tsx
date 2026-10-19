import React, { useState, useEffect, useRef } from 'react';
import {
  Mail,
  Key,
  Copy,
  Check,
  RefreshCw,
  X,
  AlertCircle,
  Clipboard,
  ArrowLeft,
} from 'lucide-react';
import { apiFetchReplacementCode } from '../utils/tempMailApi';
import { extractSmartOtpCode } from '../utils/otpExtractor';
import { copyToClipboard, readFromClipboard } from '../utils/clipboard';
import { sounds } from '../utils/audio';

interface ReplacementCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
  onTriggerToast: (msg: string, type?: 'success' | 'info' | 'code') => void;
  onCodeReceived?: (email: string, code: string, details?: any) => void;
  themeMode?: 'light' | 'dark';
}

export const ReplacementCodeModal: React.FC<ReplacementCodeModalProps> = ({
  isOpen,
  onClose,
  defaultEmail = '',
  onTriggerToast,
  onCodeReceived,
  themeMode = 'light',
}) => {
  const isDark = themeMode === 'dark';
  const [emailInput, setEmailInput] = useState<string>(defaultEmail);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [result, setResult] = useState<{
    success: boolean;
    latestCode?: string;
    sender?: string;
    subject?: string;
    receivedAt?: string;
    messageCount?: number;
    error?: string;
  } | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isNewCodeArrival, setIsNewCodeArrival] = useState<boolean>(false);

  // Store the last retrieved code to detect new arrivals
  const lastCodeRef = useRef<string | null>(null);

  useEffect(() => {
    if (defaultEmail && !emailInput) {
      setEmailInput(defaultEmail);
    }
  }, [defaultEmail]);

  // Main fetch function for recovery code
  const processDirectTextOrEmail = async (
    textToProcess: string,
    isBackgroundPoll = false
  ) => {
    const trimmed = textToProcess.trim();
    if (!trimmed) {
      if (!isBackgroundPoll) {
        setResult({
          success: false,
          error: 'Please enter a valid email address.',
        });
      }
      return;
    }

    if (!isBackgroundPoll) {
      sounds.playClick();
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      // 1. Direct code check (if user pasted raw code directly)
      const directCode = extractSmartOtpCode('', trimmed, '', trimmed);
      const isEmail = trimmed.includes('@') && !trimmed.includes(' ') && trimmed.length > 5;

      if (directCode && (!isEmail || directCode === trimmed)) {
        const isDifferent = lastCodeRef.current !== directCode;
        lastCodeRef.current = directCode;

        setResult({
          success: true,
          latestCode: directCode,
          sender: 'Direct Extractor',
          receivedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
        });

        if (isDifferent) {
          setIsNewCodeArrival(true);
          setTimeout(() => setIsNewCodeArrival(false), 3500);
        }

        // Notify homepage
        if (onCodeReceived) {
          onCodeReceived(trimmed, directCode, { sender: 'Direct Extractor' });
        }

        await copyToClipboard(directCode);
        sounds.playSuccessChime();
        onTriggerToast(`Code Copied: ${directCode}`, 'code');
        return;
      }

      // 2. Fetch latest real code from mailbox
      const res = await apiFetchReplacementCode(trimmed);
      if (res.success && res.latestCode) {
        const isDifferent = lastCodeRef.current !== res.latestCode;
        const previousCode = lastCodeRef.current;
        lastCodeRef.current = res.latestCode;

        setResult({
          success: true,
          latestCode: res.latestCode,
          sender: res.sender,
          subject: res.subject,
          receivedAt: res.receivedAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
          messageCount: res.messageCount,
        });

        // Sync with Homepage Verification Code box
        if (onCodeReceived) {
          onCodeReceived(trimmed, res.latestCode, res);
        }

        if (isDifferent) {
          setIsNewCodeArrival(true);
          setTimeout(() => setIsNewCodeArrival(false), 4000);
          await copyToClipboard(res.latestCode);
          sounds.playSuccessChime();
          sounds.playZinZinChime();
          if (previousCode) {
            onTriggerToast(`New Code Received: ${res.latestCode}`, 'code');
          } else {
            onTriggerToast(`Code Copied: ${res.latestCode}`, 'code');
          }
        }
      } else {
        if (!isBackgroundPoll) {
          setResult({
            success: false,
            error: res.error || 'No code received in this mailbox yet. Send a code and wait.',
          });
          sounds.playClick();
          onTriggerToast('No code received yet', 'info');
        }
      }
    } catch {
      const localCode = extractSmartOtpCode('', trimmed, '', trimmed);
      if (localCode) {
        lastCodeRef.current = localCode;
        setResult({
          success: true,
          latestCode: localCode,
          receivedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
        });
        if (onCodeReceived) {
          onCodeReceived(trimmed, localCode);
        }
        await copyToClipboard(localCode);
        sounds.playSuccessChime();
        onTriggerToast(`Code Copied: ${localCode}`, 'code');
      } else if (!isBackgroundPoll) {
        setResult({
          success: false,
          error: 'Could not fetch code. Please verify the address and try again.',
        });
      }
    } finally {
      if (!isBackgroundPoll) setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Continuous Live Polling every 2.5s:
  // Automatically detects when a user sends or resends a code from their platform
  useEffect(() => {
    if (!isOpen) return;

    const trimmed = emailInput.trim();
    const isEmail = trimmed.includes('@') && !trimmed.includes(' ') && trimmed.length > 5;
    if (!isEmail) return;

    const interval = setInterval(() => {
      processDirectTextOrEmail(trimmed, true);
    }, 2500);

    return () => clearInterval(interval);
  }, [isOpen, emailInput]);

  if (!isOpen) return null;

  const handleCopyCode = async () => {
    if (!result?.latestCode) return;
    sounds.playClick();
    const ok = await copyToClipboard(result.latestCode);
    if (ok) {
      sounds.playSuccessChime();
      setIsCopied(true);
      onTriggerToast(`Copied: ${result.latestCode}`, 'code');
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handlePasteClipboard = async () => {
    sounds.playClick();
    const text = await readFromClipboard();
    if (text) {
      setEmailInput(text);
      processDirectTextOrEmail(text, false);
    } else {
      onTriggerToast('Clipboard is empty', 'info');
    }
  };

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
      {/* Top Header Bar */}
      <header
        className={`sticky top-0 z-20 backdrop-blur-md border-b px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs ${
          isDark
            ? 'bg-[#09152E]/95 border-blue-400/25 text-white'
            : 'bg-white/95 border-slate-200 text-[#0A0A2C]'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 sm:px-3 sm:py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all active:scale-95 cursor-pointer ${
              isDark
                ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#7C3AED] to-[#9333EA] text-white flex items-center justify-center shadow-xs">
              <Key className="w-4 h-4" />
            </div>
            <h1 className="text-sm sm:text-base font-bold">Recovery Code</h1>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors shadow-2xs cursor-pointer ${
            isDark
              ? 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
              : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </header>

      {/* Main Container - Minimal, Clean, No Rules or Lengthy Text */}
      <main className="max-w-xl mx-auto w-full p-4 sm:p-6 flex-1 flex flex-col space-y-4">
        {/* Input Card */}
        <section
          className={`rounded-2xl border shadow-sm p-4 sm:p-5 space-y-3 ${
            isDark
              ? 'bg-[#0F1E4A]/85 border-blue-400/30 text-white'
              : 'bg-white border-slate-200/90 text-slate-800'
          }`}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              processDirectTextOrEmail(emailInput, false);
            }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span>Email Address</span>
              </label>

              <button
                type="button"
                onClick={handlePasteClipboard}
                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-purple-900/40 text-purple-200 border-purple-400/40 hover:bg-purple-900/60'
                    : 'text-purple-700 bg-purple-50 hover:bg-purple-100 border-purple-200/80'
                }`}
              >
                <Clipboard className="w-3 h-3" />
                <span>Paste</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter email address (e.g. user@mailto.plus)..."
                className={`flex-1 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none transition-all shadow-inner ${
                  isDark
                    ? 'bg-[#081229] border-blue-400/40 text-white placeholder-slate-400 focus:border-purple-400'
                    : 'border-slate-300 bg-slate-50/80 text-[#0A0A2C] focus:ring-2 focus:ring-purple-500/20'
                }`}
              />

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isLoading || !emailInput.trim()}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#C026D3] hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Checking...</span>
                    </>
                  ) : (
                    <>
                      <Key className="w-3.5 h-3.5" />
                      <span>Get Code</span>
                    </>
                  )}
                </button>

                {emailInput.trim() && (
                  <button
                    type="button"
                    onClick={() => processDirectTextOrEmail(emailInput, false)}
                    disabled={isLoading || isRefreshing}
                    title="Refresh"
                    className={`p-2.5 rounded-xl border transition-all active:scale-95 cursor-pointer ${
                      isDark
                        ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                    }`}
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${
                        isRefreshing || isLoading ? 'animate-spin text-purple-400' : ''
                      }`}
                    />
                  </button>
                )}
              </div>
            </div>

            {/* Subtle Live Sync Indicator */}
            {emailInput.includes('@') && (
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span>Auto-updating on new code</span>
                </span>
                {isRefreshing && (
                  <span className="text-sky-300 flex items-center gap-1 text-[10px]">
                    <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                    <span>Syncing</span>
                  </span>
                )}
              </div>
            )}
          </form>
        </section>

        {/* Result Card */}
        {result && (
          <section>
            {result.success && result.latestCode ? (
              <div
                className={`p-5 rounded-2xl border shadow-md space-y-3.5 transition-all ${
                  isNewCodeArrival
                    ? 'ring-2 ring-emerald-400 bg-emerald-500/20 animate-pulse'
                    : isDark
                    ? 'bg-[#0F1E4A]/90 border-emerald-400/40 text-white'
                    : 'border-emerald-300 bg-emerald-50/70 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Key className="w-4 h-4" />
                    <span>Latest Received Code</span>
                  </span>

                  {isNewCodeArrival ? (
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500 text-white animate-bounce">
                      ✓ New Code Updated!
                    </span>
                  ) : (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isDark
                          ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30'
                          : 'bg-emerald-200/80 text-emerald-900'
                      }`}
                    >
                      Auto-Copied
                    </span>
                  )}
                </div>

                {/* Big Bold Code Display */}
                <div
                  className={`flex items-center justify-between p-4 rounded-xl border shadow-inner ${
                    isDark
                      ? 'bg-[#081229] border-emerald-400/30 text-white'
                      : 'bg-white border-emerald-200/90 text-[#0A0A2C]'
                  }`}
                >
                  <span className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-emerald-400 select-all">
                    {result.latestCode}
                  </span>

                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : isDark
                        ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-400/30'
                        : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] opacity-80 pt-0.5">
                  {result.sender && (
                    <span className="truncate max-w-[65%]">
                      From: {result.sender}
                    </span>
                  )}
                  {result.receivedAt && (
                    <span className="font-mono ml-auto">
                      🕒 {result.receivedAt}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div
                className={`p-4 rounded-xl border flex items-center gap-2.5 text-xs font-semibold ${
                  isDark
                    ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                    : 'border-rose-200 bg-rose-50/70 text-rose-800'
                }`}
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{result.error || 'No code found yet.'}</span>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};
