import React, { useRef, useState, useCallback, useEffect } from 'react';
import { generateTotpCode, syncServerTime, extractBase32Secret } from '../utils/totp';
import { copyToClipboard, readFromClipboard, getLastKnownClipboard, syncSystemClipboard, recordCopiedText } from '../utils/clipboard';
import { extractSmartOtpCode } from '../utils/otpExtractor';
import { Fingerprint, Check } from 'lucide-react';
import { sounds } from '../utils/audio';

interface FingerHoldTotpProps {
  onTriggerToast: (msg: string, type?: 'success' | 'info' | 'code') => void;
  activeCode?: string | null;
  inline?: boolean;
  className?: string;
}

/**
 * Universal Security Key & Verification Code Parser
 * Extracts 2FA secret keys (Base32, hex, otpauth URIs, pipe-delimited combos, 4x4 blocks)
 * or verification codes (4 to 8 digits, OTPs, SMS codes) from clipboard text.
 */
export function parseCopiedSecurityKeyOrCode(raw: string): { type: 'totp'; key: string } | { type: 'code'; code: string } | null {
  if (!raw || typeof raw !== 'string') return null;
  let text = raw.replace(/[\u200B-\u200D\uFEFF\u200E\u200F\u00A0]/g, ' ').trim();
  if (!text) return null;

  try {
    text = decodeURIComponent(text);
  } catch {}

  // 1. Try our high-precision Base32 / 2FA secret key extractor first (handles combo lines, blocks, URIs, labels)
  const base32 = extractBase32Secret(text);
  if (base32 && base32.length >= 8) {
    return { type: 'totp', key: base32 };
  }

  // 2. Check if text is or contains a verification code / OTP using smart extractor
  const extractedOtp = extractSmartOtpCode('', text, '');
  if (extractedOtp) {
    return { type: 'code', code: extractedOtp };
  }

  // 3. Standalone numeric code (4 to 8 digits)
  const codeMatch = text.match(/\b(\d{4,8})\b/);
  if (codeMatch && codeMatch[1]) {
    return { type: 'code', code: codeMatch[1] };
  }

  return null;
}

export const FingerHoldTotp: React.FC<FingerHoldTotpProps> = ({
  onTriggerToast,
  activeCode,
  inline = false,
  className,
}) => {
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // References for reliable user gesture clipboard capture
  const pendingClipboardPromiseRef = useRef<Promise<string | null> | null>(null);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasFiredForPressRef = useRef<boolean>(false);
  const lastExecutedTimeRef = useRef<number>(0);

  // Sync server time on mount
  useEffect(() => {
    syncServerTime();
  }, []);

  /**
   * Synchronously starts reading system clipboard inside the user gesture.
   * This guarantees that external text copied outside this app/tab is captured
   * before any setTimeout delay expires the browser's transient user activation!
   */
  const initiateSynchronousClipboardRead = useCallback(() => {
    if (typeof window !== 'undefined' && typeof window.focus === 'function') {
      try {
        window.focus();
      } catch {}
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.readText === 'function') {
      try {
        pendingClipboardPromiseRef.current = navigator.clipboard
          .readText()
          .then((text) => {
            if (text && text.trim()) {
              recordCopiedText(text.trim());
              return text.trim();
            }
            return null;
          })
          .catch((err) => {
            console.warn('Direct clipboard readText notice:', err);
            return null;
          });
      } catch {
        pendingClipboardPromiseRef.current = null;
      }
    }
  }, []);

  /**
   * Directly extracts 2FA / verification code from keyboard clipboard,
   * calculates TOTP if key, copies code to clipboard, and gives immediate feedback!
   */
  const handleExecute2FA = useCallback(async () => {
    const now = Date.now();
    if (now - lastExecutedTimeRef.current < 400) return; // Prevent double trigger
    lastExecutedTimeRef.current = now;

    setIsProcessing(true);

    try {
      // 1. Retrieve clipboard text from the gesture-initiated promise
      let rawText: string | null = null;
      if (pendingClipboardPromiseRef.current) {
        try {
          rawText = await pendingClipboardPromiseRef.current;
        } catch {}
      }

      // 2. If null, try active sync & direct readFromClipboard
      if (!rawText || !rawText.trim()) {
        try {
          rawText = await syncSystemClipboard();
        } catch {}
      }

      // 3. If still null, try standard readFromClipboard
      if (!rawText || !rawText.trim()) {
        rawText = await readFromClipboard();
      }

      // 4. If still null, check last known session clipboard
      if (!rawText || !rawText.trim()) {
        rawText = getLastKnownClipboard();
      }

      // 5. If still null, fall back to active mailbox verification code
      if ((!rawText || !rawText.trim()) && activeCode) {
        rawText = activeCode;
      }

      const input = (rawText || '').trim();

      if (!input) {
        sounds.playClick();
        onTriggerToast('No 2FA key or code in clipboard. Copy a key or code first.', 'info');
        setIsProcessing(false);
        return;
      }

      // Parse security key or verification code
      const parsed = parseCopiedSecurityKeyOrCode(input);

      let finalCode = '';

      if (parsed) {
        if (parsed.type === 'totp') {
          // Generate 6-digit TOTP code from secret key
          try {
            const res = generateTotpCode(parsed.key);
            finalCode = res.code;
          } catch {
            const fallback = generateTotpCode(parsed.key.replace(/[^A-Za-z0-9]/g, ''));
            finalCode = fallback.code;
          }
        } else if (parsed.type === 'code') {
          finalCode = parsed.code;
        }
      } else if (/^\d{4,8}$/.test(input.replace(/[\s\-]/g, ''))) {
        finalCode = input.replace(/[\s\-]/g, '');
      } else if (activeCode) {
        finalCode = activeCode;
      }

      if (finalCode) {
        // Copy verified code back to user's clipboard immediately
        await copyToClipboard(finalCode);

        // Tactile and audio feedback
        if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
          try {
            navigator.vibrate([40, 30, 60]);
          } catch {}
        }
        sounds.playSuccessChime();
        sounds.playZinZinChime();

        // Visual feedback on button
        setCopiedCode(finalCode);
        onTriggerToast(`2FA Code: ${finalCode} Copied!`, 'code');

        setTimeout(() => {
          setCopiedCode(null);
        }, 3000);
      } else {
        sounds.playClick();
        onTriggerToast('Could not find a valid 2FA key or code in clipboard', 'info');
      }
    } catch (err) {
      console.error('2FA error:', err);
      onTriggerToast('Error processing 2FA code', 'info');
    } finally {
      setIsProcessing(false);
      pendingClipboardPromiseRef.current = null;
    }
  }, [activeCode, onTriggerToast]);

  // Press-and-hold & tap interaction handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    // CRITICAL: Request clipboard synchronously inside the active user gesture
    initiateSynchronousClipboardRead();

    hasFiredForPressRef.current = false;
    setIsHolding(true);

    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate(25);
      } catch {}
    }

    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    // Hold threshold: 240ms triggers automatic 2FA extraction
    holdTimerRef.current = setTimeout(() => {
      hasFiredForPressRef.current = true;
      handleExecute2FA();
    }, 240);
  };

  const handlePointerUp = () => {
    setIsHolding(false);
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    // If released before 240ms threshold (tap/click), execute immediately
    if (!hasFiredForPressRef.current) {
      handleExecute2FA();
    }
  };

  const handlePointerCancel = () => {
    setIsHolding(false);
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  // Fallback for click (keyboard Enter, assistive technologies)
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!hasFiredForPressRef.current) {
      initiateSynchronousClipboardRead();
      handleExecute2FA();
    }
  };

  return (
    <button
      type="button"
      id="btn-finger-2fa"
      aria-label="2FA Authenticator - Press and hold to verify"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={handlePointerCancel}
      onClick={handleClick}
      disabled={isProcessing}
      className={
        inline
          ? `relative h-9 px-3 rounded-2xl border-0 transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none shrink-0 overflow-hidden shadow-md active:scale-[0.97] ${
              copiedCode
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/30'
                : isHolding
                ? 'scale-95 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white'
                : 'bg-gradient-to-r from-[#1870E9] via-[#6865E3] to-[#9D50EA] hover:opacity-95 text-white shadow-blue-500/25'
            }`
          : className ||
            `px-3 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md select-none ${
              copiedCode
                ? 'bg-emerald-600 text-white'
                : isHolding
                ? 'scale-95 bg-indigo-700 text-white'
                : 'bg-gradient-to-r from-[#1870E9] via-[#6865E3] to-[#9D50EA] text-white'
            }`
      }
      title="Press and hold to auto-detect 2FA code from clipboard"
    >
      {/* Background press-and-hold ripple effect */}
      {isHolding && !copiedCode && (
        <span className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />
      )}

      {copiedCode ? (
        <>
          <Check className="w-3.5 h-3.5 text-white stroke-[3] shrink-0" />
          <span className="text-xs font-mono font-black text-white whitespace-nowrap drop-shadow-sm">
            {copiedCode.slice(0, 3)} {copiedCode.slice(3)}
          </span>
        </>
      ) : (
        <>
          <Fingerprint
            className={`w-4 h-4 shrink-0 transition-transform duration-200 stroke-[2.5] text-white ${
              isHolding ? 'scale-110' : ''
            }`}
          />
          <span className="text-xs font-black text-white whitespace-nowrap tracking-tight drop-shadow-sm">
            {isProcessing ? 'Verifying...' : '2FA Code'}
          </span>
        </>
      )}
    </button>
  );
};
