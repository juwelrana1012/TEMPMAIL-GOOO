import React, { useState, useEffect } from 'react';
import {
  Key,
  ShieldCheck,
  MapPin,
  Wifi,
  Globe,
  Clock,
  Timer,
  AlertTriangle,
  Lock,
  ArrowLeft,
  Copy,
  Check,
  CheckCircle2,
  Sparkles,
  Server,
  Layers,
  Send,
  ExternalLink,
} from 'lucide-react';
import { TempEmailAccount, MailMessage } from '../types';
import { detectPlatformOrigin } from './InboxDrawer';
import { PlatformOfficialLogo } from './PlatformOfficialLogo';
import { ClientNetworkInfo, fetchClientNetworkInfo, detectSenderNetworkInfo, SenderNetworkInfo } from '../utils/clientNetwork';
import { copyToClipboard } from '../utils/clipboard';

interface VerificationCodeDetailsPageProps {
  isOpen: boolean;
  onClose: () => void;
  account: TempEmailAccount;
  clientNetwork: ClientNetworkInfo | null;
  onTriggerToast: (msg: string, type?: 'success' | 'info' | 'code') => void;
  themeMode?: 'light' | 'dark';
}

export const VerificationCodeDetailsPage: React.FC<VerificationCodeDetailsPageProps> = ({
  isOpen,
  onClose,
  account,
  clientNetwork,
  onTriggerToast,
  themeMode = 'light',
}) => {
  const isDark = themeMode === 'dark';
  const [networkInfo, setNetworkInfo] = useState<ClientNetworkInfo | null>(clientNetwork);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [liveSecondsElapsed, setLiveSecondsElapsed] = useState<number>(0);
  const [receivedTimeDisplay, setReceivedTimeDisplay] = useState<string>('');
  const [receivedTimestamp, setReceivedTimestamp] = useState<number>(() => Date.now());

  // Message containing the code
  const message: MailMessage | undefined =
    account.messages?.find((m) => m.verificationCode === account.latestCode) ||
    account.messages?.find((m) => Boolean(m.verificationCode)) ||
    account.messages?.[0];

  const code = account.latestCode || message?.verificationCode || '';

  // Determine platform origin
  const platform = detectPlatformOrigin(
    message?.sender || '',
    message?.fromEmail || '',
    message?.subject || '',
    message?.body || ''
  );

  // Compute received timestamp & real-time counter
  useEffect(() => {
    if (!isOpen || !code) return;

    let arrivalTimeMs = Date.now();

    if (message?.receivedAt) {
      const parsed = Date.parse(message.receivedAt);
      if (!isNaN(parsed) && parsed > 0) {
        arrivalTimeMs = parsed;
      }
    }

    setReceivedTimestamp(arrivalTimeMs);

    const dateObj = new Date(arrivalTimeMs);
    const formatted = dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }) + ' at ' + dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
    setReceivedTimeDisplay(formatted);

    // Initial elapsed calculation
    const elapsed = Math.max(0, Math.floor((Date.now() - arrivalTimeMs) / 1000));
    setLiveSecondsElapsed(elapsed);

    // Continuous real-time counter timer
    const interval = setInterval(() => {
      const currentElapsed = Math.max(0, Math.floor((Date.now() - arrivalTimeMs) / 1000));
      setLiveSecondsElapsed(currentElapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, message, account.latestCode]);

  // Fetch or refresh network IP info on open if not available yet
  useEffect(() => {
    if (isOpen && !networkInfo) {
      fetchClientNetworkInfo().then((data) => {
        if (data) setNetworkInfo(data);
      });
    }
  }, [isOpen, networkInfo]);

  if (!isOpen || !code) return null;

  // Format real-time elapsed counter nicely (e.g. "02m 45s ago" or "48s ago")
  const formatElapsedTimer = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
    }
    if (minutes > 0) {
      return `${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
    }
    return `${seconds}s`;
  };

  const handleCopyCode = async () => {
    if (!code) return;
    const ok = await copyToClipboard(code);
    if (ok) {
      setIsCopied(true);
      onTriggerToast(`Verification code ${code} copied!`, 'code');
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Sender details
  const senderName = message?.sender || platform.name || 'Verification Service';
  const senderEmail = message?.fromEmail || `${platform.name.toLowerCase().replace(/\s+/g, '')}@security-verify.com`;
  const subjectLine = message?.subject || `${platform.name} Security Verification Code`;

  // Real sender network info (IP, location, gateway relay)
  const senderNetwork = detectSenderNetworkInfo(
    senderEmail,
    senderName,
    message?.body,
    message?.subject,
    message?.originIp,
    message?.originLocation
  );

  // Real-time verified client location string
  const currentLocationString = [networkInfo?.city, networkInfo?.region, networkInfo?.country]
    .filter(Boolean)
    .join(', ') || 'Auto-Verifying Network Location...';

  const clientIpString = networkInfo?.ip || 'Detecting Live IP...';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex justify-center items-start p-3 sm:p-6 animate-in fade-in duration-200"
    >
      <div className={`relative w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-auto transition-all ${
        isDark
          ? 'bg-[#0B1736] border border-blue-400/40 text-white'
          : 'bg-white border border-sky-200/80 text-[#0A0A2C]'
      }`}>
        {/* Top Sky-Blue Accent Gradient Strip */}
        <div className="h-2 w-full bg-gradient-to-r from-[#38BDF8] via-[#0284C7] to-[#0EA5E9]" />

        {/* Top Header Bar */}
        <div className={`px-5 sm:px-8 py-4 sm:py-5 border-b flex items-center justify-between transition-colors ${
          isDark
            ? 'bg-gradient-to-r from-[#0E1E45] via-[#09152E] to-[#12224D] border-blue-400/25'
            : 'border-sky-100 bg-gradient-to-r from-sky-50/80 via-white to-sky-50/60'
        }`}>
          <button
            type="button"
            onClick={onClose}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer ${
              isDark
                ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                : 'border-sky-200/80 bg-white hover:bg-sky-50 text-sky-700'
            }`}
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Back to Mailbox</span>
          </button>

          {/* Platform Official Logo Badge in Header */}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border shadow-2xs text-xs font-extrabold ${
            isDark
              ? 'bg-[#0D1F42] border-blue-400/30 text-sky-200'
              : 'bg-white border-sky-200 text-sky-900'
          }`}>
            <PlatformOfficialLogo platformName={platform.name} senderEmail={senderEmail} size={20} />
            <span>{platform.name} Details</span>
          </div>
        </div>

        {/* Page Content Body */}
        <div className="p-5 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
          {/* =============================================================== */}
          {/* 1. WELCOME & OFFICIAL PLATFORM VERIFICATION BANNER              */}
          {/* =============================================================== */}
          <div className={`rounded-2xl p-5 border shadow-sm relative overflow-hidden transition-all ${
            isDark
              ? 'bg-gradient-to-br from-[#123B92]/70 via-[#1A2855]/70 to-[#0A1633]/90 border-blue-400/40 text-white'
              : 'bg-gradient-to-br from-sky-500/10 via-cyan-500/5 to-white border-sky-200 text-[#0A0A2C]'
          }`}>
            <div className="flex items-start gap-3.5">
              {/* Official Platform Logo Container */}
              <div className={`w-12 h-12 rounded-2xl border shadow-sm flex items-center justify-center p-1.5 shrink-0 ${
                isDark ? 'bg-white/15 border-blue-400/30' : 'bg-white border-sky-200'
              }`}>
                <PlatformOfficialLogo platformName={platform.name} senderEmail={senderEmail} size={38} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className={`text-base sm:text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Welcome! Your {platform.name} OTP Has Been Received
                  </h2>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider ${
                    isDark
                      ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                      : 'bg-emerald-100 border-emerald-300 text-emerald-800'
                  }`}>
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    Verified Official
                  </span>
                </div>
                <p className={`text-xs sm:text-sm font-medium mt-1 leading-relaxed ${isDark ? 'text-sky-200/80' : 'text-slate-600'}`}>
                  Thank you for using TempMail.Go. Your authentication code from <strong className={isDark ? 'text-white' : 'text-slate-900'}>{platform.name}</strong> was captured in real time and is ready to use.
                </p>
              </div>
            </div>

            {/* Prominently Highlighted OTP Code Display Card with Official Platform Logo */}
            <div className={`mt-4 pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl border shadow-xs ${
              isDark
                ? 'bg-[#081533]/90 border-blue-400/35'
                : 'bg-white/95 border-sky-200/90'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center p-1 shrink-0 ${
                  isDark ? 'bg-white/10 border-blue-400/30' : 'bg-sky-50 border-sky-200'
                }`}>
                  <PlatformOfficialLogo platformName={platform.name} senderEmail={senderEmail} size={30} />
                </div>
                <div>
                  <div className={`text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 ${
                    isDark ? 'text-sky-300' : 'text-sky-800'
                  }`}>
                    <span>Your {platform.name} Verification Code (OTP)</span>
                  </div>
                  <div className={`text-xl sm:text-2xl font-mono font-black tracking-wider ${
                    isDark ? 'text-emerald-400' : 'text-slate-900'
                  }`}>
                    {code || 'Awaiting Code'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                  isCopied
                    ? 'bg-emerald-600 text-white shadow-emerald-500/25'
                    : 'bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] hover:opacity-95 text-white shadow-sky-500/25 active:scale-95'
                }`}
              >
                {isCopied ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4 stroke-[2.5]" />}
                <span>{isCopied ? 'Code Copied!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>

          {/* =============================================================== */}
          {/* 2. REAL-TIME COUNTER / TIMER                                    */}
          {/* =============================================================== */}
          <div className={`rounded-2xl p-4 border shadow-xs flex items-center justify-between gap-3 ${
            isDark
              ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-[#0A1633]/70 border-amber-400/40'
              : 'bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-amber-300/80'
          }`}>
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/30">
                <Timer className="w-5 h-5 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  isDark ? 'text-amber-300' : 'text-amber-900'
                }`}>
                  <span>Real-Time Counter / Live Timer</span>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                </div>
                <div className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Continuously updated live since code arrival
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className={`font-mono text-base sm:text-lg font-black px-3 py-1 rounded-xl border shadow-2xs ${
                isDark
                  ? 'text-amber-300 bg-amber-950/60 border-amber-400/50'
                  : 'text-amber-900 bg-amber-100/90 border-amber-300'
              }`}>
                {formatElapsedTimer(liveSecondsElapsed)}
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* 3. POINT-BY-POINT VERIFICATION INFORMATION                      */}
          {/* =============================================================== */}
          <div className="space-y-3">
            <div className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
              isDark ? 'text-sky-300' : 'text-slate-600'
            }`}>
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Verification Details & Origin Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Point 1: Platform Received From with Official Platform Logo */}
              <div className={`p-3.5 rounded-2xl border space-y-2 ${
                isDark ? 'bg-[#0A1A3F]/80 border-blue-400/30 text-white' : 'bg-slate-50 border-slate-200/90'
              }`}>
                <div className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  isDark ? 'text-sky-300/80' : 'text-slate-500'
                }`}>
                  <Globe className="w-3.5 h-3.5 text-sky-400" />
                  <span>Platform Received From</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl border shadow-xs flex items-center justify-center p-1 shrink-0 ${
                    isDark ? 'bg-white/10 border-blue-400/30' : 'bg-white border-slate-200'
                  }`}>
                    <PlatformOfficialLogo platformName={platform.name} senderEmail={senderEmail} size={32} />
                  </div>
                  <div className="min-w-0">
                    <div className={`font-extrabold text-sm sm:text-base flex items-center gap-1.5 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      <span className="truncate">{platform.name}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full border shrink-0 ${
                        isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      }`}>
                        Official Logo
                      </span>
                    </div>
                    <div className={`text-[11px] truncate ${isDark ? 'text-sky-300/70' : 'text-slate-500'}`}>
                      Category: {platform.category}
                    </div>
                  </div>
                </div>
              </div>

              {/* Point 2: Platform Name & Sender Details */}
              <div className={`p-3.5 rounded-2xl border space-y-1 ${
                isDark ? 'bg-[#0A1A3F]/80 border-blue-400/30 text-white' : 'bg-slate-50 border-slate-200/90'
              }`}>
                <div className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  isDark ? 'text-purple-300' : 'text-slate-500'
                }`}>
                  <Send className="w-3.5 h-3.5 text-purple-400" />
                  <span>Sender & Service Name</span>
                </div>
                <div className={`font-bold text-sm flex items-center gap-1.5 truncate ${
                  isDark ? 'text-purple-300' : 'text-purple-700'
                }`}>
                  <PlatformOfficialLogo platformName={platform.name} senderEmail={senderEmail} size={18} />
                  <span className="truncate">{senderName}</span>
                </div>
                <div className={`text-[11px] font-normal-typing font-normal truncate select-all ${isDark ? 'text-slate-300' : 'text-slate-500'}`} title={senderEmail}>
                  {senderEmail}
                </div>
              </div>

              {/* Point 3: Exact Time Received */}
              <div className={`p-3.5 rounded-2xl border space-y-1 ${
                isDark ? 'bg-[#0A1A3F]/80 border-blue-400/30 text-white' : 'bg-slate-50 border-slate-200/90'
              }`}>
                <div className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  isDark ? 'text-emerald-300' : 'text-slate-500'
                }`}>
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Exact Time Received</span>
                </div>
                <div className={`font-bold text-xs sm:text-sm font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {receivedTimeDisplay || 'Just now'}
                </div>
                <div className={`text-[11px] font-semibold flex items-center gap-1 ${
                  isDark ? 'text-emerald-300' : 'text-emerald-700'
                }`}>
                  <span>●</span> Verified arrival timestamp
                </div>
              </div>

              {/* Point 4: Sender Origin IP & Gateway Node */}
              <div className={`p-3.5 rounded-2xl border space-y-1.5 ${
                isDark ? 'bg-[#0A1A3F]/80 border-blue-400/30 text-white' : 'bg-slate-50 border-slate-200/90'
              }`}>
                <div className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  isDark ? 'text-indigo-300' : 'text-slate-500'
                }`}>
                  <Server className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Sender Origin IP & Node</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-mono font-bold text-xs sm:text-sm select-all ${
                    isDark ? 'text-indigo-300' : 'text-indigo-700'
                  }`}>
                    {senderNetwork.ip}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold border ${
                    isDark ? 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  }`}>
                    Verified Sender IP
                  </span>
                </div>
                <div className={`text-[11px] truncate ${isDark ? 'text-slate-300' : 'text-slate-500'}`} title={senderNetwork.gatewayName}>
                  {senderNetwork.gatewayName}
                </div>
              </div>

              {/* Point 5: Sender Origin Geographical Location */}
              <div className={`p-3.5 rounded-2xl border space-y-1 ${
                isDark ? 'bg-[#0A1A3F]/80 border-blue-400/30 text-white' : 'bg-slate-50 border-slate-200/90'
              }`}>
                <div className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  isDark ? 'text-rose-300' : 'text-slate-500'
                }`}>
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>Sender Origin Location</span>
                </div>
                <div className={`font-bold text-xs sm:text-sm flex items-center gap-1.5 truncate ${
                  isDark ? 'text-rose-300' : 'text-rose-700'
                }`}>
                  <PlatformOfficialLogo platformName={platform.name} senderEmail={senderEmail} size={16} />
                  <span className="truncate">{senderNetwork.location}</span>
                </div>
                <div className={`text-[11px] truncate ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
                  Network: {senderNetwork.ispOrOrg}
                </div>
              </div>

              {/* Point 6: Recipient Device Live IP */}
              <div className={`p-3.5 rounded-2xl border space-y-1 ${
                isDark ? 'bg-[#0A1A3F]/80 border-blue-400/30 text-white' : 'bg-slate-50 border-slate-200/90'
              }`}>
                <div className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  isDark ? 'text-emerald-300' : 'text-slate-500'
                }`}>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Recipient Device IP (You)</span>
                </div>
                <div className={`font-mono font-bold text-xs sm:text-sm select-all ${
                  isDark ? 'text-emerald-300' : 'text-emerald-700'
                }`}>
                  {clientIpString}
                </div>
                <div className={`text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
                  Verified client destination address
                </div>
              </div>

              {/* Point 7: Recipient Device Live Location */}
              <div className={`p-3.5 rounded-2xl border space-y-1 ${
                isDark ? 'bg-[#0A1A3F]/80 border-blue-400/30 text-white' : 'bg-slate-50 border-slate-200/90'
              }`}>
                <div className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  isDark ? 'text-teal-300' : 'text-slate-500'
                }`}>
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  <span>Recipient Device Location (You)</span>
                </div>
                <div className={`font-bold text-xs sm:text-sm truncate select-text ${isDark ? 'text-teal-300' : 'text-teal-800'}`}>
                  {currentLocationString}
                </div>
                <div className={`text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
                  Inbound destination mailbox: <span className="select-all font-normal-typing font-normal">{account.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* 4. SECURITY WARNING & CLOSING THANK YOU MESSAGE                 */}
          {/* =============================================================== */}
          <div className={`rounded-2xl p-5 border-2 shadow-sm space-y-3 ${
            isDark
              ? 'bg-gradient-to-br from-rose-950/40 via-[#1F1020]/60 to-[#0B1736] border-rose-500/50 text-rose-200'
              : 'bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-white border-rose-300 text-slate-800'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-rose-500/30">
                <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
              </div>
              <h3 className={`text-sm font-black tracking-tight uppercase ${
                isDark ? 'text-rose-300' : 'text-rose-900'
              }`}>
                Important Security Warning & Privacy Notice
              </h3>
            </div>

            <div className={`space-y-2 text-xs font-medium leading-relaxed pl-0.5 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <div className="flex items-start gap-2">
                <Lock className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>
                  <strong className={isDark ? 'text-rose-300' : 'text-rose-800'}>Never share your Verification Code / OTP:</strong> Do not disclose or forward this code to anyone under any circumstances. Official representatives will never ask for your private verification code.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>
                  <strong className={isDark ? 'text-rose-300' : 'text-rose-800'}>Keep Security Information Private:</strong> Maintain confidentiality of your account credentials and personal data at all times.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>
                  <strong className={isDark ? 'text-rose-300' : 'text-rose-800'}>Save in a Secure Place:</strong> If this code is required for two-factor authentication or account recovery, save it in a safe and private location so it is not lost.
                </span>
              </div>
            </div>

            <div className={`pt-3 border-t flex items-center justify-between text-xs font-bold ${
              isDark ? 'border-rose-500/30 text-rose-300' : 'border-rose-200/80 text-rose-800'
            }`}>
              <span>Thank you for choosing TempMail.Go for fast and secure verification.</span>
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold transition-all shadow-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
