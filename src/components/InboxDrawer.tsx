import React, { useState } from 'react';
import {
  Mail,
  Key,
  X,
  Copy,
  Check,
  RefreshCw,
  Clock,
  Inbox,
  Sparkles,
  ShieldCheck,
  Globe,
  ChevronDown,
  ChevronUp,
  FileText,
} from 'lucide-react';
import { TempEmailAccount, MailMessage } from '../types';
import { copyToClipboard } from '../utils/clipboard';
import { sounds } from '../utils/audio';

interface InboxDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  account: TempEmailAccount;
  onRefreshInbox: () => Promise<void>;
  isRefreshing?: boolean;
  onTriggerToast: (msg: string, type?: 'success' | 'info' | 'code') => void;
  onNewGmail?: () => Promise<void>;
  onRecordCopiedEmail?: (email: string) => void;
  themeMode?: 'light' | 'dark';
}

export interface PlatformDetails {
  name: string;
  category: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  gradient: string;
}

/**
 * Intelligent platform and website origin detector
 * Detects whether the code came from Instagram, Google, Facebook, TikTok, etc.
 */
export function detectPlatformOrigin(sender = '', fromEmail = '', subject = '', body = ''): PlatformDetails {
  const combined = `${sender} ${fromEmail} ${subject} ${body}`.toLowerCase();

  if (/instagram/i.test(combined)) {
    return {
      name: 'Instagram',
      category: 'Social Media',
      badgeBg: 'bg-pink-50',
      badgeBorder: 'border-pink-300',
      badgeText: 'text-pink-600',
      gradient: 'from-[#833AB4] via-[#FD1D1D] to-[#FCB045]',
    };
  }

  if (/facebook|meta/i.test(combined)) {
    return {
      name: 'Facebook',
      category: 'Social Network',
      badgeBg: 'bg-blue-50',
      badgeBorder: 'border-blue-300',
      badgeText: 'text-blue-600',
      gradient: 'from-[#1877F2] to-[#0A54BE]',
    };
  }

  if (/google|gmail|youtube/i.test(combined)) {
    return {
      name: 'Google',
      category: 'Google Account',
      badgeBg: 'bg-red-50',
      badgeBorder: 'border-red-300',
      badgeText: 'text-red-600',
      gradient: 'from-[#EA4335] via-[#FBBC05] to-[#4285F4]',
    };
  }

  if (/tiktok/i.test(combined)) {
    return {
      name: 'TikTok',
      category: 'Video Community',
      badgeBg: 'bg-slate-900',
      badgeBorder: 'border-cyan-400',
      badgeText: 'text-cyan-400',
      gradient: 'from-[#00F2FE] via-[#000000] to-[#FE2C55]',
    };
  }

  if (/whatsapp/i.test(combined)) {
    return {
      name: 'WhatsApp',
      category: 'Secure Messaging',
      badgeBg: 'bg-emerald-50',
      badgeBorder: 'border-emerald-300',
      badgeText: 'text-emerald-600',
      gradient: 'from-[#25D366] to-[#128C7E]',
    };
  }

  if (/telegram/i.test(combined)) {
    return {
      name: 'Telegram',
      category: 'Cloud Messenger',
      badgeBg: 'bg-sky-50',
      badgeBorder: 'border-sky-300',
      badgeText: 'text-sky-600',
      gradient: 'from-[#229ED9] to-[#0088CC]',
    };
  }

  if (/twitter|x\.com/i.test(combined)) {
    return {
      name: 'X (Twitter)',
      category: 'Social Network',
      badgeBg: 'bg-slate-100',
      badgeBorder: 'border-slate-400',
      badgeText: 'text-black',
      gradient: 'from-slate-900 to-black',
    };
  }

  if (/microsoft|outlook|hotmail/i.test(combined)) {
    return {
      name: 'Microsoft',
      category: 'Microsoft Security',
      badgeBg: 'bg-blue-50',
      badgeBorder: 'border-blue-300',
      badgeText: 'text-blue-600',
      gradient: 'from-[#00A4EF] to-[#0078D4]',
    };
  }

  if (/discord/i.test(combined)) {
    return {
      name: 'Discord',
      category: 'Chat & Community',
      badgeBg: 'bg-indigo-50',
      badgeBorder: 'border-indigo-300',
      badgeText: 'text-indigo-600',
      gradient: 'from-[#5865F2] to-[#404EED]',
    };
  }

  if (/binance|crypto/i.test(combined)) {
    return {
      name: 'Binance',
      category: 'Crypto Security',
      badgeBg: 'bg-amber-50',
      badgeBorder: 'border-amber-300',
      badgeText: 'text-amber-700',
      gradient: 'from-[#F0B90B] to-[#D19B00]',
    };
  }

  if (/netflix/i.test(combined)) {
    return {
      name: 'Netflix',
      category: 'Entertainment',
      badgeBg: 'bg-red-50',
      badgeBorder: 'border-red-300',
      badgeText: 'text-red-700',
      gradient: 'from-[#E50914] to-[#B81D24]',
    };
  }

  if (/amazon/i.test(combined)) {
    return {
      name: 'Amazon',
      category: 'Shopping & Cloud',
      badgeBg: 'bg-amber-50',
      badgeBorder: 'border-amber-300',
      badgeText: 'text-amber-700',
      gradient: 'from-[#FF9900] to-[#E68A00]',
    };
  }

  if (/apple|icloud/i.test(combined)) {
    return {
      name: 'Apple',
      category: 'Apple ID Security',
      badgeBg: 'bg-slate-100',
      badgeBorder: 'border-slate-300',
      badgeText: 'text-slate-800',
      gradient: 'from-slate-700 to-slate-900',
    };
  }

  // Generic fallback: extract domain name or sender title
  const domainMatch = fromEmail.match(/@([a-z0-9.-]+)/i);
  let cleanName = sender || 'Web Service';
  if (domainMatch && domainMatch[1]) {
    const mainHost = domainMatch[1].split('.')[0];
    if (mainHost && mainHost.length > 2) {
      cleanName = mainHost.charAt(0).toUpperCase() + mainHost.slice(1);
    }
  }

  return {
    name: cleanName,
    category: 'Verification Service',
    badgeBg: 'bg-blue-50',
    badgeBorder: 'border-blue-200',
    badgeText: 'text-[#1870E9]',
    gradient: 'from-[#1870E9] via-[#6865E3] to-[#9D50EA]',
  };
}

export const InboxDrawer: React.FC<InboxDrawerProps> = ({
  isOpen,
  onClose,
  account,
  onRefreshInbox,
  isRefreshing = false,
  onTriggerToast,
  onNewGmail,
  onRecordCopiedEmail,
  themeMode = 'light',
}) => {
  const isDark = themeMode === 'dark';
  // Filter out any Guerrilla system / no-reply / welcome boilerplate emails
  const realMessages = (account.messages || []).filter(
    (m) =>
      m.id !== '1' &&
      m.fromEmail !== 'no-reply@guerrillamail.com' &&
      !m.fromEmail?.toLowerCase().includes('guerrillamail') &&
      !m.sender?.toLowerCase().includes('guerrillamail') &&
      !m.subject?.toLowerCase().includes('welcome to guerrilla')
  );

  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    realMessages[0]?.id || null
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  // Selected or latest message
  const activeMessage: MailMessage | undefined =
    realMessages.find((m) => m.id === selectedMessageId) || realMessages[0];

  const handleCopy = async (text: string, label: string) => {
    sounds.playClick();
    const success = await copyToClipboard(text);
    if (success) {
      sounds.playSuccessChime();
      setCopiedKey(text);
      if (label === 'Email Address' && onRecordCopiedEmail) {
        onRecordCopiedEmail(text);
      }
      onTriggerToast(`${label} Copied: ${text}`, 'success');
      setTimeout(() => setCopiedKey(null), 1500);
    }
  };

  const handleManualRefresh = async () => {
    sounds.playClick();
    await onRefreshInbox();
  };

  const platform = activeMessage
    ? detectPlatformOrigin(
        activeMessage.sender,
        activeMessage.fromEmail,
        activeMessage.subject,
        activeMessage.body
      )
    : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-4xl sm:max-w-5xl md:max-w-6xl rounded-3xl shadow-2xl p-5 sm:p-8 flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-150 border ${
          isDark
            ? 'bg-gradient-to-b from-[#123B92] via-[#222A82] to-[#3E168E] text-white border-blue-400/35'
            : 'bg-white border-[#BACBF5] text-[#0A0A2C]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1870E9] via-[#6865E3] to-[#9D50EA] rounded-t-3xl" />

        {/* Modal Header */}
        <div className={`flex items-center justify-between pb-4 sm:pb-5 border-b ${isDark ? 'border-blue-400/20' : 'border-slate-100'}`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#1870E9] via-[#6865E3] to-[#9D50EA] flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/20">
              <Inbox className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className={`text-base sm:text-xl font-bold truncate ${isDark ? 'text-white' : 'text-[#0A0A2C]'}`}>
                  Live Temp Mail Inbox
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold shrink-0 border ${
                  isDark ? 'bg-sky-400/10 text-sky-200 border-sky-400/30' : 'bg-[#1870E9]/10 text-[#1870E9] border-[#1870E9]/20'
                }`}>
                  {realMessages.length} {realMessages.length === 1 ? 'Message' : 'Messages'}
                </span>
              </div>
              <p className={`text-xs sm:text-sm truncate mt-0.5 select-all font-normal-typing font-normal ${
                isDark ? 'text-sky-300' : 'text-[#1870E9]'
              }`}>
                {account.address}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleCopy(account.address, 'Email Address')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors border cursor-pointer shadow-xs ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {copiedKey === account.address ? (
                <Check className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-[#1870E9]'}`} />
              ) : (
                <Copy className={`w-4 h-4 ${isDark ? 'text-sky-300' : 'text-[#1870E9]'}`} />
              )}
              <span>Copy Email</span>
            </button>

            <button
              type="button"
              disabled={isRefreshing}
              onClick={handleManualRefresh}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1870E9] via-[#6865E3] to-[#9D50EA] hover:opacity-95 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all disabled:opacity-50 shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Checking...' : 'Refresh'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors shadow-xs cursor-pointer ml-1 ${
                isDark
                  ? 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1 min-h-[260px]">
          {realMessages.length === 0 ? (
            /* 1. COMPLETELY EMPTY INBOX STATE */
            <div className="py-14 sm:py-20 flex flex-col items-center justify-center text-center px-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-xs border ${
                isDark ? 'bg-white/10 border-white/15 text-sky-300' : 'bg-slate-50 border-slate-200/80 text-slate-400'
              }`}>
                <Inbox className="w-8 h-8" />
              </div>
              <h4 className={`text-base sm:text-lg font-bold mb-1.5 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Inbox is Completely Empty
              </h4>
              <p className={`text-xs sm:text-sm max-w-md leading-relaxed mb-4 ${isDark ? 'text-sky-200/80' : 'text-slate-500'}`}>
                No emails or verification codes have arrived yet. When a website (e.g. Instagram, Google, Facebook) sends a code, full details and your code will appear here instantly.
              </p>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                isDark ? 'bg-white/10 text-sky-200 border-white/20' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                <span className="w-2 h-2 rounded-full bg-[#1870E9] animate-ping" />
                <span>Waiting for incoming verification message...</span>
              </div>
            </div>
          ) : (
            /* 2. REAL VERIFICATION MESSAGE RECEIVED */
            <div className="space-y-4">
              {/* If multiple messages, display clean selector pills */}
              {realMessages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <span className={`text-xs font-bold shrink-0 ${isDark ? 'text-sky-300' : 'text-slate-500'}`}>
                    Messages:
                  </span>
                  {realMessages.map((m, idx) => {
                    const isSelected = (activeMessage?.id === m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedMessageId(m.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-[#1870E9] text-white border-[#1870E9] shadow-xs'
                            : isDark
                            ? 'bg-white/10 text-sky-200 border-white/15 hover:bg-white/20'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        #{idx + 1} {m.sender} {m.verificationCode ? `(${m.verificationCode})` : ''}
                      </button>
                    );
                  })}
                </div>
              )}

              {activeMessage && platform && (
                <div className="space-y-3.5 animate-in fade-in duration-200">
                  {/* Step A: Welcome Header */}
                  <div className={`p-4 rounded-2xl border flex items-start gap-3 shadow-xs ${
                    isDark
                      ? 'bg-emerald-500/15 border-emerald-400/30'
                      : 'bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-indigo-500/10 border-emerald-400/30'
                  }`}>
                    <div className={`p-2 rounded-xl border shrink-0 shadow-xs ${
                      isDark ? 'bg-[#09152E] border-emerald-400/40 text-emerald-400' : 'bg-white border-emerald-300 text-emerald-600'
                    }`}>
                      <Sparkles className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`text-sm sm:text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          Welcome to {platform.name} Verification!
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${platform.badgeBg} ${platform.badgeBorder} ${platform.badgeText}`}>
                          {platform.category}
                        </span>
                      </div>
                      <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-sky-200/90' : 'text-slate-600'}`}>
                        A new confirmation message has arrived from <strong className={isDark ? 'text-white font-bold' : 'text-slate-900 font-bold'}>{platform.name}</strong>. Your verification code is extracted below.
                      </p>
                    </div>
                  </div>

                  {/* Step B: Prominent "Receive Your Code" Box */}
                  {activeMessage.verificationCode && (
                    <div className={`p-4 sm:p-5 rounded-2xl border-2 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isDark
                        ? 'bg-[#0F1E4A]/80 border-sky-400/50'
                        : 'bg-gradient-to-r from-[#1870E9]/10 via-[#6865E3]/10 to-[#9D50EA]/10 border-[#1870E9]/40'
                    }`}>
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="p-1 rounded-lg bg-[#1870E9] text-white">
                            <Key className="w-3.5 h-3.5" />
                          </div>
                          <span className={`text-xs sm:text-sm font-black uppercase tracking-wider ${isDark ? 'text-sky-300' : 'text-[#1870E9]'}`}>
                            Receive Your Code
                          </span>
                        </div>
                        <span className="font-mono text-3xl sm:text-4xl font-black tracking-widest bg-gradient-to-r from-[#38BDF8] via-[#818CF8] to-[#C084FC] bg-clip-text text-transparent select-all leading-tight block">
                          {activeMessage.verificationCode}
                        </span>
                        <span className={`text-[11px] font-semibold mt-1 block ${isDark ? 'text-sky-200/70' : 'text-slate-500'}`}>
                          Click copy button or tap code to copy instantly
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopy(activeMessage.verificationCode!, 'Verification Code')}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1870E9] via-[#6865E3] to-[#9D50EA] hover:opacity-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-[#1870E9]/30 active:scale-95 transition-all cursor-pointer shrink-0"
                      >
                        {copiedKey === activeMessage.verificationCode ? (
                          <Check className="w-4 h-4 text-white" />
                        ) : (
                          <Copy className="w-4 h-4 text-white" />
                        )}
                        <span>{copiedKey === activeMessage.verificationCode ? 'Copied to Clipboard!' : 'Copy Code'}</span>
                      </button>
                    </div>
                  )}

                  {/* Step C: Full Origin & Time Details */}
                  <div className={`p-4 rounded-2xl border space-y-3 ${
                    isDark
                      ? 'bg-[#0F1E4A]/60 border-blue-400/25'
                      : 'bg-slate-50/80 border-slate-200/90'
                  }`}>
                    <div className={`flex items-center justify-between pb-2.5 border-b ${isDark ? 'border-white/10' : 'border-slate-200/70'}`}>
                      <span className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-sky-200' : 'text-slate-700'}`}>
                        <ShieldCheck className="w-4 h-4 text-[#1870E9]" />
                        <span>Source & Timestamp Details</span>
                      </span>
                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md border ${
                        isDark ? 'bg-white/10 text-sky-200 border-white/15' : 'bg-white text-slate-500 border-slate-200'
                      }`}>
                        Verified Delivery
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* Origin Site */}
                      <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-[#0D1A3F] border-blue-400/20' : 'bg-white border-slate-200/70'}`}>
                        <span className={`text-[10px] font-bold block uppercase tracking-wider mb-0.5 ${isDark ? 'text-sky-300/70' : 'text-slate-400'}`}>
                          Origin Service / Website:
                        </span>
                        <span className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          <Globe className="w-3.5 h-3.5 text-[#1870E9]" />
                          {platform.name} ({platform.category})
                        </span>
                      </div>

                      {/* Sender Email */}
                      <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-[#0D1A3F] border-blue-400/20' : 'bg-white border-slate-200/70'}`}>
                        <span className={`text-[10px] font-bold block uppercase tracking-wider mb-0.5 ${isDark ? 'text-sky-300/70' : 'text-slate-400'}`}>
                          Sender Address (From):
                        </span>
                        <span className={`text-xs font-semibold truncate block select-all ${isDark ? 'text-sky-200' : 'text-slate-800'}`}>
                          {activeMessage.fromEmail || activeMessage.sender}
                        </span>
                      </div>

                      {/* Exact Time Received */}
                      <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-[#0D1A3F] border-blue-400/20' : 'bg-white border-slate-200/70'}`}>
                        <span className={`text-[10px] font-bold block uppercase tracking-wider mb-0.5 ${isDark ? 'text-sky-300/70' : 'text-slate-400'}`}>
                          Received Time & Date:
                        </span>
                        <span className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          <Clock className="w-3.5 h-3.5 text-[#6865E3]" />
                          {activeMessage.receivedAt || 'Just now'}
                        </span>
                      </div>

                      {/* Email Subject */}
                      <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-[#0D1A3F] border-blue-400/20' : 'bg-white border-slate-200/70'}`}>
                        <span className={`text-[10px] font-bold block uppercase tracking-wider mb-0.5 ${isDark ? 'text-sky-300/70' : 'text-slate-400'}`}>
                          Email Subject:
                        </span>
                        <span className={`text-xs font-semibold truncate block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {activeMessage.subject || 'Verification Email'}
                        </span>
                      </div>
                    </div>

                    {/* Full Email Message Content */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-xs font-bold flex items-center gap-1 ${isDark ? 'text-sky-200' : 'text-slate-700'}`}>
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span>Full Email Description & Content</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(activeMessage.body, 'Email Message')}
                          className={`text-[11px] font-semibold hover:underline flex items-center gap-1 cursor-pointer ${
                            isDark ? 'text-sky-300' : 'text-[#1870E9]'
                          }`}
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy Body</span>
                        </button>
                      </div>

                      <div className={`whitespace-pre-wrap font-sans p-3.5 rounded-xl border leading-relaxed max-h-52 overflow-y-auto text-xs shadow-inner ${
                        isDark ? 'bg-[#081533] text-slate-200 border-blue-400/25' : 'bg-white border-slate-200 text-slate-800'
                      }`}>
                        {activeMessage.body || activeMessage.snippet || activeMessage.subject}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={`pt-3 border-t flex items-center justify-between ${isDark ? 'border-blue-400/20' : 'border-slate-100'}`}>
          <div className={`flex items-center gap-2 text-xs font-medium ${isDark ? 'text-sky-200/80' : 'text-slate-500'}`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>Live SMTP Monitor Active</span>
          </div>

          <div className="flex items-center gap-2">
            {onNewGmail && (
              <button
                type="button"
                onClick={onNewGmail}
                className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-colors border cursor-pointer ${
                  isDark
                    ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-[#1870E9]" />
                <span>New Address</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                isDark
                  ? 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
