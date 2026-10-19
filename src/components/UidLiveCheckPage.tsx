import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  X,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Trash2,
  Search,
  CopyCheck,
} from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import { PlatformOfficialLogo } from './PlatformOfficialLogo';
import { verifyRecordsClientSide } from '../utils/uidClientVerifier';

interface UidLiveCheckPageProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerToast: (msg: string, type?: 'success' | 'info' | 'code') => void;
  themeMode?: 'light' | 'dark';
}

/**
 * Intelligent UID & Username extractor
 * Extracts the primary target UID or username even if the record contains
 * passwords, 2FA secrets, cookies, emails, or complete URLs.
 */
export function extractTargetUid(
  rawRecord: string,
  platform: 'facebook' | 'instagram' | 'tiktok'
): string {
  const trimmed = rawRecord.trim();
  if (!trimmed) return '';

  if (platform === 'facebook') {
    // 1. Check for profile.php?id=1000...
    const profileIdMatch = trimmed.match(/facebook\.com\/profile\.php\?id=([0-9]+)/i);
    if (profileIdMatch && profileIdMatch[1]) return profileIdMatch[1];

    // 2. Check for facebook.com/username or numeric
    const urlMatch = trimmed.match(
      /(?:https?:\/\/)?(?:www\.|m\.|mbasic\.|web\.)?facebook\.com\/([a-zA-Z0-9._-]+)/i
    );
    if (
      urlMatch &&
      urlMatch[1] &&
      !['profile.php', 'watch', 'pages', 'groups', 'share', 'login'].includes(
        urlMatch[1].toLowerCase()
      )
    ) {
      return urlMatch[1].replace(/^@+/, '').trim();
    }

    // 3. Delimited tokens (e.g. email|UID|pass or UID|pass|2fa)
    const tokens = trimmed.split(/[\s|:;,]+/);
    for (const token of tokens) {
      const clean = token.replace(/^@+/, '').trim();
      if (/^\d{4,}$/.test(clean)) {
        return clean;
      }
    }
    return (tokens[0] || '').replace(/^@+/, '').trim();
  }

  if (platform === 'instagram') {
    const urlMatch = trimmed.match(
      /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9._-]+)/i
    );
    if (
      urlMatch &&
      urlMatch[1] &&
      !['p', 'reel', 'stories', 'explore', 'direct'].includes(
        urlMatch[1].toLowerCase()
      )
    ) {
      return urlMatch[1].replace(/^@+/, '').trim();
    }
    const tokens = trimmed.split(/[\s|:;,]+/);
    return (tokens[0] || '').replace(/^@+/, '').trim();
  }

  if (platform === 'tiktok') {
    const urlMatch = trimmed.match(
      /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@?([a-zA-Z0-9._-]+)/i
    );
    if (
      urlMatch &&
      urlMatch[1] &&
      !['video', 'tag', 'music', 'live'].includes(urlMatch[1].toLowerCase())
    ) {
      return urlMatch[1].replace(/^@+/, '').trim();
    }
    const tokens = trimmed.split(/[\s|:;,]+/);
    return (tokens[0] || '').replace(/^@+/, '').trim();
  }

  return (trimmed.split(/[\s|:;,]+/)[0] || '').replace(/^@+/, '').trim();
}

export const UidLiveCheckPage: React.FC<UidLiveCheckPageProps> = ({
  isOpen,
  onClose,
  onTriggerToast,
  themeMode = 'light',
}) => {
  const isDark = themeMode === 'dark';

  // Platform selection (facebook | instagram | tiktok)
  const [platform, setPlatform] = useState<'facebook' | 'instagram' | 'tiktok'>('facebook');

  // Input text
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Real-time Progress Tracking
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [processedCount, setProcessedCount] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Result lists
  const [liveList, setLiveList] = useState<string[]>([]);
  const [deadList, setDeadList] = useState<string[]>([]);
  const [duplicateList, setDuplicateList] = useState<string[]>([]);

  // Copy status indicators
  const [copiedSection, setCopiedSection] = useState<'live' | 'dead' | 'duplicate' | null>(null);

  // Dynamic input lines count
  const inputLines = useMemo(() => {
    return inputText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
  }, [inputText]);

  const totalInputCount = inputLines.length;

  if (!isOpen) return null;

  // Clear button action
  const handleClear = () => {
    setInputText('');
    setLiveList([]);
    setDeadList([]);
    setDuplicateList([]);
    setErrorMsg(null);
    setProgressPercent(0);
    setProcessedCount(0);
    setIsCompleted(false);
    onTriggerToast('Input and results cleared', 'info');
  };

  // Perform Live Check with duplicate separation & real-time verified progress
  const handleCheck = async () => {
    if (inputLines.length === 0) {
      setErrorMsg('Please paste at least one record into the Input box.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setProgressPercent(0);
    setProcessedCount(0);
    setIsCompleted(false);
    setLiveList([]);
    setDeadList([]);

    // 1. Separate Unique Records vs Duplicate Records
    const seenIdentifiers = new Set<string>();
    const uniqueRecords: string[] = [];
    const dupRecords: string[] = [];

    for (const line of inputLines) {
      const targetId = extractTargetUid(line, platform).toLowerCase();
      if (!targetId) {
        dupRecords.push(line);
        continue;
      }
      if (seenIdentifiers.has(targetId)) {
        dupRecords.push(line);
      } else {
        seenIdentifiers.add(targetId);
        uniqueRecords.push(line);
      }
    }

    setDuplicateList(dupRecords);

    // If only duplicates exist
    if (uniqueRecords.length === 0) {
      setProgressPercent(100);
      setIsCompleted(true);
      setLoading(false);
      onTriggerToast(`All ${inputLines.length} records are duplicates`, 'info');
      return;
    }

    let endpoint = '/api/facebook/live-check';
    if (platform === 'instagram') endpoint = '/api/instagram/live-check';
    if (platform === 'tiktok') endpoint = '/api/tiktok/live-check';

    // Parallel stream chunk size (up to 30 items per batch)
    const chunkSize = 30;
    const chunks: string[][] = [];
    for (let i = 0; i < uniqueRecords.length; i += chunkSize) {
      chunks.push(uniqueRecords.slice(i, i + chunkSize));
    }

    let completedUnique = 0;
    const accumulatedLive: string[] = [];
    const accumulatedDead: string[] = [];

    try {
      await Promise.all(
        chunks.map(async (chunk) => {
          let verified = false;

          // 1. Try server endpoint (works in local dev & serverless)
          try {
            const response = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ records: chunk }),
            });

            const contentType = response.headers.get('content-type') || '';
            if (response.ok && contentType.includes('application/json')) {
              const data = await response.json();
              if (data && data.success) {
                if (Array.isArray(data.liveRecords)) {
                  accumulatedLive.push(...data.liveRecords);
                }
                if (Array.isArray(data.deadRecords)) {
                  accumulatedDead.push(...data.deadRecords);
                }
                verified = true;
              }
            }
          } catch {
            // Server endpoint unavailable / non-JSON response from SPA
          }

          // 2. Client-side resilient verification (guaranteed to work on Vercel static & SPA)
          if (!verified) {
            try {
              const clientRes = await verifyRecordsClientSide(chunk, platform);
              accumulatedLive.push(...clientRes.liveRecords);
              accumulatedDead.push(...clientRes.deadRecords);
              verified = true;
            } catch {
              accumulatedDead.push(...chunk);
            }
          }

          completedUnique += chunk.length;
          const currentPercent = Math.min(
            100,
            Math.round((completedUnique / uniqueRecords.length) * 100)
          );
          setProcessedCount(completedUnique);
          setProgressPercent(currentPercent);
          setLiveList([...accumulatedLive]);
          setDeadList([...accumulatedDead]);
        })
      );

      setProgressPercent(100);
      setProcessedCount(uniqueRecords.length);
      setIsCompleted(true);

      onTriggerToast(
        `Checked ${totalInputCount} records: ${accumulatedLive.length} Live, ${accumulatedDead.length} Dead, ${dupRecords.length} Duplicate`,
        'success'
      );
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to connect to verification server.');
    } finally {
      setLoading(false);
    }
  };

  // Copy All records in a section
  const handleCopySection = async (
    records: string[],
    section: 'live' | 'dead' | 'duplicate'
  ) => {
    if (!records || records.length === 0) return;
    const textToCopy = records.join('\n');
    const ok = await copyToClipboard(textToCopy);
    if (ok) {
      setCopiedSection(section);
      onTriggerToast(`Copied ${records.length} ${section.toUpperCase()} records`, 'code');
      setTimeout(() => setCopiedSection(null), 2000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-50 flex flex-col w-full h-full overflow-y-auto pb-20 sm:pb-24 transition-colors ${
        isDark
          ? 'bg-gradient-to-b from-[#0B1736] via-[#122452] to-[#1E1B4B] text-white'
          : 'bg-gradient-to-b from-[#EBF3FF] via-[#EEF2FF] to-[#F5F3FF] text-slate-800'
      }`}
    >
      {/* Dynamic Animated Wave CSS */}
      <style>{`
        @keyframes wavyFlow {
          0% { background-position: 0 0; }
          100% { background-position: 40px 0; }
        }
        .animate-wavy-flow {
          animation: wavyFlow 1.4s linear infinite;
        }
      `}</style>

      {/* Top Header Bar */}
      <header
        className={`sticky top-0 z-30 backdrop-blur-md border-b px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-xs ${
          isDark
            ? 'bg-[#09152E]/95 border-blue-400/25 text-white'
            : 'bg-white/95 border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className={`px-2.5 py-1 rounded-md border flex items-center gap-1 text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
              isDark
                ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
            title="Back to home"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[2]" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-blue-600 via-indigo-600 to-pink-500 text-white flex items-center justify-center shadow-xs">
              <Search className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <h1
              className={`text-xs sm:text-sm font-bold tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              UID Live Check
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={`w-7 h-7 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
            isDark
              ? 'border-white/20 hover:bg-white/10 text-slate-300 hover:text-white'
              : 'border-slate-200 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 text-slate-400'
          }`}
        >
          <X className="w-4 h-4 stroke-[2]" />
        </button>
      </header>

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto w-full p-3 sm:p-5 flex-1 flex flex-col space-y-4">
        {/* COMPACT HORIZONTAL PLATFORM SELECTOR */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {/* Facebook */}
          <button
            type="button"
            onClick={() => {
              setPlatform('facebook');
              setErrorMsg(null);
            }}
            className={`py-1.5 px-3.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              platform === 'facebook'
                ? 'bg-[#1877F2] border-[#1877F2] text-white shadow-xs'
                : isDark
                ? 'bg-[#0F1E4A] border-blue-400/30 text-sky-200 hover:bg-white/10'
                : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/40'
            }`}
          >
            <PlatformOfficialLogo
              platformName="facebook"
              size={15}
              className={platform === 'facebook' ? 'shadow-none' : ''}
            />
            <span>Facebook</span>
          </button>

          {/* Instagram */}
          <button
            type="button"
            onClick={() => {
              setPlatform('instagram');
              setErrorMsg(null);
            }}
            className={`py-1.5 px-3.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              platform === 'instagram'
                ? 'bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] border-pink-600 text-white shadow-xs'
                : isDark
                ? 'bg-[#0F1E4A] border-blue-400/30 text-sky-200 hover:bg-white/10'
                : 'bg-white border-slate-200 text-slate-600 hover:border-pink-300 hover:text-pink-600 hover:bg-pink-50/40'
            }`}
          >
            <PlatformOfficialLogo
              platformName="instagram"
              size={15}
              className={platform === 'instagram' ? 'shadow-none' : ''}
            />
            <span>Instagram</span>
          </button>

          {/* TikTok */}
          <button
            type="button"
            onClick={() => {
              setPlatform('tiktok');
              setErrorMsg(null);
            }}
            className={`py-1.5 px-3.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              platform === 'tiktok'
                ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                : isDark
                ? 'bg-[#0F1E4A] border-blue-400/30 text-sky-200 hover:bg-white/10'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <PlatformOfficialLogo
              platformName="tiktok"
              size={15}
              className={platform === 'tiktok' ? 'shadow-none' : ''}
            />
            <span>TikTok</span>
          </button>
        </div>

        {/* ================================================================= */}
        {/* 1. INPUT / PASTE BOX (Large Fixed Height, resize-none)            */}
        {/* ================================================================= */}
        <section
          className={`rounded-2xl border shadow-sm p-4 space-y-3 ${
            isDark
              ? 'bg-[#0F1E4A]/85 border-blue-400/30 text-white'
              : 'bg-white border-indigo-200/90 text-slate-800'
          }`}
        >
          <div
            className={`flex items-center justify-between pb-2 border-b ${
              isDark ? 'border-white/10' : 'border-indigo-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider border ${
                  isDark
                    ? 'bg-sky-500/20 text-sky-200 border-sky-400/30'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                }`}
              >
                Input / Paste Box
              </span>
              <span className={`text-xs font-bold ${isDark ? 'text-sky-200' : 'text-slate-600'}`}>
                {platform === 'facebook'
                  ? 'Facebook Records'
                  : platform === 'instagram'
                  ? 'Instagram Records'
                  : 'TikTok Records'}
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                  isDark
                    ? 'bg-white/10 text-sky-200 border-white/15'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                Total: {totalInputCount} {totalInputCount === 1 ? 'line' : 'lines'}
              </span>
            </div>

            {/* Clear Button */}
            <button
              type="button"
              onClick={handleClear}
              className={`px-2.5 py-1 rounded-md text-xs font-bold border flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                isDark
                  ? 'text-rose-400 border-rose-400/30 hover:bg-rose-500/10'
                  : 'text-rose-600 hover:bg-rose-50 border-rose-200 hover:border-rose-300'
              }`}
              title="Clear all input text and reset results"
            >
              <Trash2 className="w-3.5 h-3.5 stroke-[2]" />
              <span>Clear</span>
            </button>
          </div>

          {/* Large fixed textarea (resize-none, no resizing handles) */}
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              platform === 'facebook'
                ? 'Paste complete Facebook records here (one per line):\nExample:\n100088123456789|Password123|2FA|Name|Email\nhttps://www.facebook.com/100088123456789\nzuck:password'
                : platform === 'instagram'
                ? 'Paste complete Instagram records here (one per line):\nExample:\ncristiano|Password123|Email\nhttps://www.instagram.com/username'
                : 'Paste complete TikTok records here (one per line):\nExample:\ntiktok|Password123\nhttps://www.tiktok.com/@tiktok'
            }
            className={`w-full h-56 p-3 rounded-xl border font-mono text-xs focus:outline-none transition-all shadow-inner leading-relaxed resize-none ${
              isDark
                ? 'bg-[#081229] border-blue-400/40 text-white placeholder-slate-400 focus:border-sky-400'
                : 'border-slate-300 bg-slate-50/80 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white'
            }`}
          />

          {errorMsg && (
            <div
              className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center gap-2 ${
                isDark
                  ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                  : 'bg-rose-50 border border-rose-200 text-rose-700'
              }`}
            >
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 stroke-[2]" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Button */}
          <button
            type="button"
            onClick={handleCheck}
            disabled={loading || totalInputCount === 0}
            className={`w-full py-3 px-4 rounded-xl text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] disabled:opacity-50 cursor-pointer ${
              platform === 'facebook'
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:opacity-95'
                : platform === 'instagram'
                ? 'bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-95'
                : 'bg-gradient-to-r from-slate-900 via-slate-800 to-black hover:opacity-95'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin stroke-[2.5]" />
                <span>Checking Records ({progressPercent}%)...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4 stroke-[2.5]" />
                <span>Live Check</span>
              </>
            )}
          </button>
        </section>

        {/* ================================================================= */}
        {/* 2. VERIFICATION PROGRESS & STATUS DISPLAY (Reference UI Design)   */}
        {/* ================================================================= */}
        <section
          className={`rounded-2xl border shadow-md p-4 space-y-3.5 transition-all ${
            isDark
              ? 'bg-[#0B1736]/95 border-blue-400/35 text-white'
              : 'bg-white border-slate-200 text-slate-800 shadow-sm'
          }`}
        >
          {/* Status Display: Total → Live → Dead → Duplicate */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-6 py-1 text-xs sm:text-sm font-black tracking-wide">
            <div className="flex items-center gap-1.5">
              <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Total</span>
              <span
                className={`font-black px-2 py-0.5 rounded-md ${
                  isDark ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-900'
                }`}
              >
                {totalInputCount}
              </span>
            </div>

            <span className="text-slate-300 dark:text-slate-600 select-none font-normal">|</span>

            <div className="flex items-center gap-1.5 text-[#10B981]">
              <span>Live</span>
              <span className="font-black px-2 py-0.5 rounded-md bg-emerald-500/15 text-[#10B981] border border-emerald-500/25">
                {liveList.length}
              </span>
            </div>

            <span className="text-slate-300 dark:text-slate-600 select-none font-normal">|</span>

            <div className="flex items-center gap-1.5 text-[#EF4444]">
              <span>Dead</span>
              <span className="font-black px-2 py-0.5 rounded-md bg-rose-500/15 text-[#EF4444] border border-rose-500/25">
                {deadList.length}
              </span>
            </div>

            <span className="text-slate-300 dark:text-slate-600 select-none font-normal">|</span>

            <div className="flex items-center gap-1.5 text-[#EF4444]">
              <span>Duplicate</span>
              <span className="font-black px-2 py-0.5 rounded-md bg-red-500/15 text-[#EF4444] border border-red-500/25">
                {duplicateList.length}
              </span>
            </div>
          </div>

          {/* Real-Time Verification Progress Bar with thin, dense wavy animation */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs">
              <div className="font-bold flex items-center gap-2">
                {isCompleted ? (
                  <span className="text-emerald-500 flex items-center gap-1.5 font-black text-xs sm:text-sm">
                    <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                    <span>Verification Completed</span>
                  </span>
                ) : loading ? (
                  <span className="text-cyan-400 flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin stroke-[2.5]" />
                    <span>Verifying in progress...</span>
                  </span>
                ) : (
                  <span className={`font-semibold text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Real-Time Verification Progress
                  </span>
                )}
              </div>

              <div className="font-mono font-bold text-xs sm:text-sm">
                {isCompleted ? (
                  <span className="text-emerald-500 font-black">
                    100% — {processedCount} / {processedCount}
                  </span>
                ) : loading ? (
                  <span className="text-cyan-400 font-bold">
                    {progressPercent}% — {processedCount} / {totalInputCount - duplicateList.length}
                  </span>
                ) : (
                  <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>0%</span>
                )}
              </div>
            </div>

            {/* The Thin, Dense Wavy Green-Cyan Progress Bar Track */}
            <div
              className={`w-full h-3 rounded-full overflow-hidden border p-[2px] shadow-inner ${
                isDark
                  ? 'bg-[#060D1F] border-blue-400/30'
                  : 'bg-slate-100 border-slate-200'
              }`}
            >
              <div
                className="h-full rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                style={{
                  width: `${progressPercent}%`,
                  background:
                    'linear-gradient(90deg, #00F5D4 0%, #00BBF9 50%, #10B981 100%)',
                  boxShadow:
                    progressPercent > 0 ? '0 0 10px rgba(0, 245, 212, 0.45)' : 'none',
                }}
              >
                {/* Intertwined dense wavy animated overlay */}
                {progressPercent > 0 && (
                  <div
                    className="absolute inset-0 w-full h-full opacity-65 animate-wavy-flow"
                    style={{
                      backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.4) 4px, transparent 4px, transparent 10px)`,
                      backgroundSize: '24px 24px',
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 3. LIVE SECTION (Heading + Live Results Box)                      */}
        {/* ================================================================= */}
        <section
          className={`rounded-2xl border shadow-sm overflow-hidden flex flex-col ${
            isDark
              ? 'bg-[#0F1E4A] border-emerald-500/40 text-white'
              : 'bg-white border-emerald-300 text-slate-800'
          }`}
        >
          {/* Live Heading Bar */}
          <div className="bg-emerald-600 px-4 py-2.5 flex items-center justify-between text-white shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-100 stroke-[2.5]" />
              <span className="text-xs sm:text-sm font-black tracking-wider">LIVE</span>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-700/80 text-emerald-100 border border-emerald-500/40">
                {liveList.length}
              </span>
            </div>

            {liveList.length > 0 && (
              <button
                type="button"
                onClick={() => handleCopySection(liveList, 'live')}
                className="px-3 py-1 rounded-md bg-white text-emerald-700 hover:bg-emerald-50 text-xs font-black flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
                title="Copy all live records"
              >
                {copiedSection === 'live' ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Copy All Live</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Live Results Box (Large scrollable, fixed size) */}
          <textarea
            readOnly
            value={liveList.join('\n')}
            placeholder="No Live records yet. Click 'Live Check' to verify."
            className={`w-full h-52 p-3 font-mono text-xs focus:outline-none transition-all leading-relaxed resize-none ${
              isDark
                ? 'bg-[#081229] text-emerald-300 placeholder-slate-500'
                : 'bg-emerald-50/20 text-emerald-950 placeholder-slate-400'
            }`}
          />
        </section>

        {/* ================================================================= */}
        {/* 4. DEAD SECTION (Heading + Dead Results Box)                      */}
        {/* ================================================================= */}
        <section
          className={`rounded-2xl border shadow-sm overflow-hidden flex flex-col ${
            isDark
              ? 'bg-[#0F1E4A] border-rose-500/40 text-white'
              : 'bg-white border-rose-300 text-slate-800'
          }`}
        >
          {/* Dead Heading Bar */}
          <div className="bg-rose-600 px-4 py-2.5 flex items-center justify-between text-white shadow-xs">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-100 stroke-[2.5]" />
              <span className="text-xs sm:text-sm font-black tracking-wider">DEAD</span>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-rose-700/80 text-rose-100 border border-rose-500/40">
                {deadList.length}
              </span>
            </div>

            {deadList.length > 0 && (
              <button
                type="button"
                onClick={() => handleCopySection(deadList, 'dead')}
                className="px-3 py-1 rounded-md bg-white text-rose-700 hover:bg-rose-50 text-xs font-black flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
                title="Copy all dead records"
              >
                {copiedSection === 'dead' ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Copy All Dead</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Dead Results Box (Large scrollable, fixed size) */}
          <textarea
            readOnly
            value={deadList.join('\n')}
            placeholder="No Dead records yet. Click 'Live Check' to verify."
            className={`w-full h-52 p-3 font-mono text-xs focus:outline-none transition-all leading-relaxed resize-none ${
              isDark
                ? 'bg-[#081229] text-rose-300 placeholder-slate-500'
                : 'bg-rose-50/20 text-rose-950 placeholder-slate-400'
            }`}
          />
        </section>

        {/* ================================================================= */}
        {/* 5. DUPLICATE SECTION (Heading + Duplicate Results Box)             */}
        {/* ================================================================= */}
        <section
          className={`rounded-2xl border shadow-sm overflow-hidden flex flex-col ${
            isDark
              ? 'bg-[#0F1E4A] border-red-500/40 text-white'
              : 'bg-white border-red-300 text-slate-800'
          }`}
        >
          {/* Duplicate Heading Bar */}
          <div className="bg-[#DC2626] px-4 py-2.5 flex items-center justify-between text-white shadow-xs">
            <div className="flex items-center gap-2">
              <CopyCheck className="w-4 h-4 text-red-100 stroke-[2.5]" />
              <span className="text-xs sm:text-sm font-black tracking-wider">DUPLICATE</span>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-red-700/80 text-red-100 border border-red-500/40">
                {duplicateList.length}
              </span>
            </div>

            {duplicateList.length > 0 && (
              <button
                type="button"
                onClick={() => handleCopySection(duplicateList, 'duplicate')}
                className="px-3 py-1 rounded-md bg-white text-red-700 hover:bg-red-50 text-xs font-black flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
                title="Copy all duplicate records"
              >
                {copiedSection === 'duplicate' ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Copy All Duplicate</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Duplicate Results Box (Large scrollable, fixed size) */}
          <textarea
            readOnly
            value={duplicateList.join('\n')}
            placeholder="No Duplicate records detected."
            className={`w-full h-52 p-3 font-mono text-xs focus:outline-none transition-all leading-relaxed resize-none ${
              isDark
                ? 'bg-[#081229] text-red-300 placeholder-slate-500'
                : 'bg-red-50/20 text-red-950 placeholder-slate-400'
            }`}
          />
        </section>
      </main>
    </div>
  );
};
