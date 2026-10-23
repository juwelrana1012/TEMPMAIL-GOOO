import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FloatingWidget } from './components/FloatingWidget';
import { InboxDrawer, detectPlatformOrigin } from './components/InboxDrawer';
import { SelectOptionsModal } from './components/SelectOptionsModal';
import { MailHistoryModal } from './components/MailHistoryModal';
import { ReplacementCodeModal } from './components/ReplacementCodeModal';
import { FingerHoldTotp, parseCopiedSecurityKeyOrCode } from './components/FingerHoldTotp';
import { NameGeneratorModal } from './components/NameGeneratorModal';
import { PasswordGeneratorModal } from './components/PasswordGeneratorModal';
import { VerificationCodeDetailsPage } from './components/VerificationCodeDetailsPage';
import { PlatformOfficialLogo } from './components/PlatformOfficialLogo';
import { UidLiveCheckPage } from './components/UidLiveCheckPage';
import { TopicUsageGuidePage } from './components/TopicUsageGuidePage';
import { NavTopicBar, TopicId } from './components/NavTopicBar';
import { HamburgerMenu } from './components/HamburgerMenu';
import { AppOpenSplashScreen } from './components/AppOpenSplashScreen';
import { ToastNotification, ToastItem } from './components/ToastNotification';
import { TempEmailAccount, MailProviderName, MailHistoryItem } from './types';
import { sounds } from './utils/audio';
import {
  copyToClipboard,
  readFromClipboard,
  getLastKnownClipboard,
  recordCopiedText,
  syncSystemClipboard,
  autoCopyVerificationCode,
  subscribeToAutoCopy,
  primeClipboardPermission,
  cancelPendingAutoCopy,
} from './utils/clipboard';
import { apiGenerateTempEmail, apiFetchInbox, apiFetchReplacementCode } from './utils/tempMailApi';
import { extractSmartOtpCode } from './utils/otpExtractor';
import { generateTotpCode, extractBase32Secret, syncServerTime } from './utils/totp';
import { fetchClientNetworkInfo, ClientNetworkInfo, detectSenderNetworkInfo } from './utils/clientNetwork';
import {
  Mail,
  Key,
  Copy,
  Check,
  RefreshCw,
  Inbox,
  History,
  Sparkles,
  Globe,
  ExternalLink,
  ClipboardPaste,
  Clipboard,
  AlertCircle,
  Zap,
  UserCheck,
  Camera,
  KeyRound,
  X,
  User,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Clock,
  Calendar,
  MapPin,
  Wifi,
  Server,
  Info,
  Search,
  Sun,
  Moon,
  Menu,
  MoreVertical,
  Trash2,
} from 'lucide-react';

const STORAGE_KEY_HISTORY = 'mail_copy_history';
const STORAGE_KEY_ACTIVE_ACCOUNT = 'remix_active_tempmail_account';

export default function App() {
  // Currently active account (persisted across page refresh)
  const [activeAccount, setActiveAccount] = useState<TempEmailAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_ACCOUNT);
      if (saved) {
        const parsed: TempEmailAccount = JSON.parse(saved);
        if (Array.isArray(parsed.messages)) {
          parsed.messages = parsed.messages.filter(
            (m) =>
              m.id !== '1' &&
              m.fromEmail !== 'no-reply@guerrillamail.com' &&
              !m.fromEmail?.toLowerCase().includes('guerrillamail') &&
              !m.sender?.toLowerCase().includes('guerrillamail') &&
              !m.subject?.toLowerCase().includes('welcome to guerrilla')
          );
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });
  const [selectedProvider, setSelectedProvider] = useState<MailProviderName>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_ACCOUNT);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.provider || 'TempMailPro';
      }
    } catch {}
    return 'TempMailPro';
  });
  const [selectedDomain, setSelectedDomain] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_ACCOUNT);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.domain || 'tempmailpro.io';
      }
    } catch {}
    return 'tempmailpro.io';
  });
  const [isLoadingAddress, setIsLoadingAddress] = useState<boolean>(false);
  const [isNewSpinning, setIsNewSpinning] = useState<boolean>(false);
  const [isRefreshingInbox, setIsRefreshingInbox] = useState<boolean>(false);
  const [isEmailBodyExpanded, setIsEmailBodyExpanded] = useState<boolean>(false);

  // Manual refresh system (continuous background polling disabled per user preference)
  const [autoSync, setAutoSync] = useState<boolean>(true);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // Live real-time tick to update real-time date and time display
  const [nowTimestamp, setNowTimestamp] = useState<number>(() => Date.now());
  const [clientNetwork, setClientNetwork] = useState<ClientNetworkInfo | null>(null);

  // Theme mode: 'light' | 'dark' (where dark is deep vibrant blue)
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('app_theme_mode');
      return saved === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  // Custom secondary splash disabled - official OS launch screen handles app opening cleanly
  const [showAppOpenSplash, setShowAppOpenSplash] = useState<boolean>(false);

  const handleCompleteAppOpenSplash = useCallback(() => {
    setShowAppOpenSplash(false);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('app_theme_mode', themeMode);
      if (themeMode === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    } catch {}
  }, [themeMode]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNowTimestamp(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch verified real-time IP and location info for Verification Details
  useEffect(() => {
    let isMounted = true;
    fetchClientNetworkInfo().then((info) => {
      if (isMounted && info) {
        setClientNetwork(info);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Modals state
  const [isSelectModalOpen, setIsSelectModalOpen] = useState<boolean>(false);
  const [isInboxOpen, setIsInboxOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isReplacementModalOpen, setIsReplacementModalOpen] = useState<boolean>(false);
  const [isNameGenOpen, setIsNameGenOpen] = useState<boolean>(false);
  const [isPasswordGenOpen, setIsPasswordGenOpen] = useState<boolean>(false);
  const [isOtpDetailsOpen, setIsOtpDetailsOpen] = useState<boolean>(false);
  const [isUidLiveCheckOpen, setIsUidLiveCheckOpen] = useState<boolean>(false);
  const [isUsageGuideOpen, setIsUsageGuideOpen] = useState<boolean>(false);
  const [selectedGuideTopic, setSelectedGuideTopic] = useState<string | undefined>(undefined);

  // Hamburger Menu (3 horizontal lines) & Navigation Topic states
  const [isHamburgerOpen, setIsHamburgerOpen] = useState<boolean>(false);
  const [activeTopic, setActiveTopic] = useState<TopicId>('home');

  // Floating Plus widget visibility
  const [isFloatingVisible, setIsFloatingVisible] = useState<boolean>(false);

  // Track last auto-copied verification code & message ID to support resend and second confirmation codes
  const lastAutoCopiedCodeRef = useRef<string | null>(activeAccount?.latestCode || null);
  const lastCopiedMsgIdRef = useRef<string | null>(activeAccount?.messages?.[0]?.id || null);

  // Mail History state (saved in localStorage)
  const [mailHistory, setMailHistory] = useState<MailHistoryItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Copied indicator state for buttons
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Paste / Extract verification code helper state
  const [isPasteOpen, setIsPasteOpen] = useState<boolean>(false);
  const [pasteInput, setPasteInput] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState<boolean>(false);

  // Toast feedback
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const triggerToast = useCallback(
    (message: string, type: 'success' | 'info' | 'code' = 'info') => {
      const id = Date.now().toString() + Math.random().toString();
      setToasts((prev) => [...prev.slice(-2), { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 2500);
    },
    []
  );

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(mailHistory));
    } catch {
      // Ignore quota error
    }
  }, [mailHistory]);

  // Dedicated Recovery Mail state (starts EMPTY, NEVER auto-filled from active mailbox or copied text)
  const [recoveryEmailInput, setRecoveryEmailInput] = useState<string>('');
  const [isRecoveryLoading, setIsRecoveryLoading] = useState<boolean>(false);
  const [recoveryResult, setRecoveryResult] = useState<{
    success: boolean;
    latestCode?: string;
    sender?: string;
    subject?: string;
    receivedAt?: string;
    messageCount?: number;
    error?: string;
  } | null>(null);
  const [isRecoveryCopied, setIsRecoveryCopied] = useState<boolean>(false);

  // Clear recovery email input and fetched recovery code
  const handleClearRecovery = () => {
    sounds.playClick();
    setRecoveryEmailInput('');
    setRecoveryResult(null);
    triggerToast('Recovery cleared', 'info');
  };

  // Fetch recovery verification code directly for user-entered email
  const handleFetchRecoveryCode = async () => {
    const trimmed = recoveryEmailInput.trim();
    if (!trimmed) {
      sounds.playClick();
      triggerToast('Please enter an email address', 'info');
      return;
    }
    sounds.playClick();
    setIsRecoveryLoading(true);
    setRecoveryResult(null);

    try {
      const directCode = extractSmartOtpCode('', trimmed, '', trimmed);
      const isEmail = trimmed.includes('@') && !trimmed.includes(' ') && trimmed.length > 5;

      if (directCode && (!isEmail || directCode === trimmed)) {
        setRecoveryResult({
          success: true,
          latestCode: directCode,
          sender: 'Direct Extractor',
          receivedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
        });
        await copyToClipboard(directCode);
        sounds.playSuccessChime();
        triggerToast(`Copied Code: ${directCode}`, 'code');
        return;
      }

      const res = await apiFetchReplacementCode(trimmed);
      if (res && res.success && res.latestCode) {
        setRecoveryResult({
          success: true,
          latestCode: res.latestCode,
          sender: res.sender || 'Verification Service',
          subject: res.subject,
          receivedAt: res.receivedAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
          messageCount: res.messageCount,
        });
        await copyToClipboard(res.latestCode);
        sounds.playSuccessChime();
        triggerToast(`Copied Code: ${res.latestCode}`, 'code');
      } else {
        setRecoveryResult({
          success: false,
          error: res?.error || 'No code received in this mailbox yet.',
        });
        triggerToast('No code received yet', 'info');
      }
    } catch {
      setRecoveryResult({
        success: false,
        error: 'Error checking mailbox. Please verify address.',
      });
      triggerToast('Error checking mailbox', 'info');
    } finally {
      setIsRecoveryLoading(false);
    }
  };

  const handlePasteRecoveryEmail = async () => {
    sounds.playClick();
    const text = await readFromClipboard();
    if (text && text.trim()) {
      setRecoveryEmailInput(text.trim());
      triggerToast('Email pasted', 'info');
    } else {
      triggerToast('Clipboard is empty', 'info');
    }
  };

  // Persist active account to localStorage so page reloads never lose the mailbox
  useEffect(() => {
    if (activeAccount) {
      try {
        localStorage.setItem(STORAGE_KEY_ACTIVE_ACCOUNT, JSON.stringify(activeAccount));
      } catch {}
    }
  }, [activeAccount]);

  // Synchronize with atomic server NTP time on mount for 100% accurate 2FA / TOTP generation
  useEffect(() => {
    syncServerTime();
  }, []);

  // Record copied email in Mail History automatically
  const recordCopiedEmail = useCallback((emailAddress: string) => {
    if (!emailAddress || !emailAddress.includes('@')) return;
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    const newItem: MailHistoryItem = {
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      address: emailAddress.trim(),
      date: dateStr,
      time: timeStr,
      timestamp: now.getTime(),
    };

    setMailHistory((prev) => [newItem, ...prev]);
  }, []);

  // Inbox Check with automatic code detection
  // Explicitly avoids auto-copying when refreshed manually or when page is reloaded
  const checkInboxForAccount = async (
    account: TempEmailAccount,
    options?: { isManualRefresh?: boolean; preventAutoCopy?: boolean }
  ) => {
    if (options?.isManualRefresh) {
      setIsRefreshingInbox(true);
    }
    try {
      const data = await apiFetchInbox(account.address, account.provider);
      setLastSyncTime(new Date().toLocaleTimeString());

      // Filter out any Guerrilla system or no-reply emails and sort newest first
      const sortedMessages = [...(data?.messages || [])]
        .filter(
          (m) =>
            m.id !== '1' &&
            m.fromEmail !== 'no-reply@guerrillamail.com' &&
            !m.fromEmail?.toLowerCase().includes('guerrillamail') &&
            !m.sender?.toLowerCase().includes('guerrillamail') &&
            !m.subject?.toLowerCase().includes('welcome to guerrilla')
        )
        .map((m) => {
          if (!m.verificationCode) {
            const parsedCode = extractSmartOtpCode(m.subject || '', m.body || '', m.snippet || '', account.address);
            if (parsedCode) {
              return { ...m, verificationCode: parsedCode };
            }
          }
          return m;
        })
        .sort((a, b) => {
          const getSafeTime = (m: any): number => {
            if (typeof m.timestamp === 'number' && !isNaN(m.timestamp) && m.timestamp > 0) return m.timestamp;
            if (m.receivedAt && m.receivedAt !== 'Just now') {
              const parsed = Date.parse(m.receivedAt);
              if (!isNaN(parsed) && parsed > 0) return parsed;
            }
            const idNum = Number(String(m.id || '').replace(/\D/g, ''));
            if (!isNaN(idNum) && idNum > 0) return idNum;
            return 0;
          };
          const diff = getSafeTime(b) - getSafeTime(a);
          if (!isNaN(diff) && diff !== 0) return diff;
          return String(b.id || '').localeCompare(String(a.id || ''));
        });

      // Find the code from the newest message that has a verification code
      const messageWithCode = sortedMessages.find((m) => m.verificationCode);
      const detectedCode = messageWithCode?.verificationCode || data?.latestCode || null;
      const messageId = messageWithCode?.id || null;

      // Extract exact clock time (e.g. 12:10 or 09:05)
      const currentClockTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

      // DO NOT copy to clipboard if triggered by manual refresh, website reload, or preventAutoCopy
      const isBlockedFromAutoCopy = options?.isManualRefresh || options?.preventAutoCopy;
      const isNewArrival =
        !isBlockedFromAutoCopy &&
        detectedCode &&
        (detectedCode !== lastAutoCopiedCodeRef.current || (messageId && messageId !== lastCopiedMsgIdRef.current));

      if (isNewArrival) {
        lastAutoCopiedCodeRef.current = detectedCode;
        if (messageId) lastCopiedMsgIdRef.current = messageId;
        sounds.playSuccessChime();
        sounds.playZinZinChime();
        triggerToast(`Verification code received: ${detectedCode}`, 'code');
      } else if (detectedCode) {
        // Mark as seen so switching emails or refreshing will never auto-copy old codes
        lastAutoCopiedCodeRef.current = detectedCode;
        if (messageId) lastCopiedMsgIdRef.current = messageId;
      }

      setActiveAccount((prev) => {
        if (!prev || prev.address !== account.address) return prev;
        return {
          ...prev,
          messages: sortedMessages,
          latestCode: detectedCode || null,
          codeReceivedAt: detectedCode ? (prev.codeReceivedAt && prev.latestCode === detectedCode ? prev.codeReceivedAt : currentClockTime) : undefined,
        };
      });
      return data;
    } catch (err: any) {
      console.warn('Inbox check error:', err?.message);
    } finally {
      if (options?.isManualRefresh) {
        setIsRefreshingInbox(false);
      }
    }
  };

  // --------------------------------------------------------------------------
  // Live Background Polling & Focus Listener:
  // Automatically detects resents and new codes every 2.5s so the verification code updates dynamically on screen
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!activeAccount) return;

    // Check on tab focus or visibility change
    const handleWindowFocus = () => {
      if (activeAccount) {
        checkInboxForAccount(activeAccount, { preventAutoCopy: false });
      }
    };
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleWindowFocus);

    // Active polling interval if autoSync is enabled
    let intervalId: any = null;
    if (autoSync) {
      intervalId = setInterval(() => {
        if (activeAccount) {
          checkInboxForAccount(activeAccount, { preventAutoCopy: false });
        }
      }, 2500);
    }

    return () => {
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleWindowFocus);
      if (intervalId) clearInterval(intervalId);
    };
  }, [activeAccount?.address, activeAccount?.provider, autoSync]);

  // Generate email with selected domain & optional username
  // Automatically copies the new email address to clipboard immediately without clicking
  const handleSelectDomain = async (domain: string, username?: string) => {
    setIsLoadingAddress(true);
    try {
      const result = await apiGenerateTempEmail(undefined, domain, username);
      const newAcc: TempEmailAccount = {
        id: `acc-${Date.now()}`,
        address: result.address,
        domain: result.domain,
        provider: result.provider,
        providerUrl: result.providerUrl,
        createdAt: result.createdAt,
        expiresInMinutes: 60,
        latestCode: null,
        messages: [],
      };

      // Reset last code and message ref for fresh mailbox
      lastAutoCopiedCodeRef.current = null;
      lastCopiedMsgIdRef.current = null;
      try {
        localStorage.setItem(STORAGE_KEY_ACTIVE_ACCOUNT, JSON.stringify(newAcc));
      } catch {}
      setActiveAccount(newAcc);
      setSelectedDomain(result.domain);
      setSelectedProvider(result.provider);
      setIsSelectModalOpen(false);

      // Unblock UI immediately so user never waits for background checks
      setIsLoadingAddress(false);
      triggerToast(`New email ready: ${result.address}`, 'info');

      // Run inbox check in background non-blocking with preventAutoCopy
      checkInboxForAccount(newAcc, { preventAutoCopy: true });
    } catch (err: any) {
      console.error('Error generating email:', err);
      // Resilient fallback: guarantee account is created even if network or serverless errors occur
      const cleanU = (username || Math.random().toString(36).substring(2, 9)).toLowerCase().replace(/[^a-z0-9]/g, '');
      const fallbackAddress = `${cleanU}@${domain}`;
      const fallbackAcc: TempEmailAccount = {
        id: `acc-${Date.now()}`,
        address: fallbackAddress,
        domain,
        provider: domain === 'tempmailpro.io' ? 'TempMailPro' : domain.includes('sharklasers') || domain.includes('guerrilla') ? 'Guerrilla Mail' : 'Temp Mail Plus',
        providerUrl: domain === 'tempmailpro.io' ? 'https://tempmailpro.io/' : `https://tempmail.plus/en/#!${fallbackAddress}`,
        createdAt: new Date().toLocaleTimeString(),
        expiresInMinutes: 60,
        latestCode: null,
        messages: [],
      };
      lastAutoCopiedCodeRef.current = null;
      lastCopiedMsgIdRef.current = null;
      try {
        localStorage.setItem(STORAGE_KEY_ACTIVE_ACCOUNT, JSON.stringify(fallbackAcc));
      } catch {}
      setActiveAccount(fallbackAcc);
      setSelectedDomain(domain);
      setIsSelectModalOpen(false);
      triggerToast(`New email ready: ${fallbackAddress}`, 'info');
      setIsLoadingAddress(false);
      checkInboxForAccount(fallbackAcc, { preventAutoCopy: true });
    } finally {
      setIsLoadingAddress(false);
    }
  };

  // Generate new email address on same domain
  // Instantaneous generation: user can click New repeatedly without any delay or blocking
  const handleNewAddress = async () => {
    sounds.playClick();
    setIsNewSpinning(true);
    setTimeout(() => {
      setIsNewSpinning(false);
    }, 600);
    try {
      const result = await apiGenerateTempEmail(undefined, selectedDomain);
      const newAcc: TempEmailAccount = {
        id: `acc-${Date.now()}`,
        address: result.address,
        domain: result.domain,
        provider: result.provider,
        providerUrl: result.providerUrl,
        createdAt: result.createdAt,
        expiresInMinutes: 60,
        latestCode: null,
        messages: [],
      };

      // Reset last code and message ref for fresh mailbox
      lastAutoCopiedCodeRef.current = null;
      lastCopiedMsgIdRef.current = null;
      try {
        localStorage.setItem(STORAGE_KEY_ACTIVE_ACCOUNT, JSON.stringify(newAcc));
      } catch {}
      setActiveAccount(newAcc);

      // NOTE: Auto-copy on New button is disabled per user preference. User can click dedicated Copy button.
      triggerToast(`New email ready: ${result.address}`, 'info');

      // Check inbox in background strictly with preventAutoCopy so OTP is never copied immediately
      checkInboxForAccount(newAcc, { preventAutoCopy: true });
    } catch (err: any) {
      console.error('Failed to change email:', err);
      // Instant local fallback so clicking New always works instantly
      const fallbackUser = Math.random().toString(36).substring(2, 9);
      const fallbackAddress = `${fallbackUser}@${selectedDomain}`;
      const fallbackAcc: TempEmailAccount = {
        id: `acc-${Date.now()}`,
        address: fallbackAddress,
        domain: selectedDomain,
        provider: selectedDomain.includes('sharklasers') || selectedDomain.includes('guerrilla') ? 'Guerrilla Mail' : 'Temp Mail Plus',
        providerUrl: `https://tempmail.plus/en/#!${fallbackAddress}`,
        createdAt: new Date().toLocaleTimeString(),
        expiresInMinutes: 60,
        latestCode: null,
        messages: [],
      };
      setActiveAccount(fallbackAcc);
      triggerToast(`New email ready: ${fallbackAddress}`, 'info');
      checkInboxForAccount(fallbackAcc, { preventAutoCopy: true });
    } finally {
      setIsLoadingAddress(false);
    }
  };

  // Copy Email Address - 100% silent, no sound
  const handleCopyEmail = async () => {
    if (!activeAccount) return;
    const ok = await copyToClipboard(activeAccount.address);
    if (ok) {
      setCopiedKey('email');
      recordCopiedEmail(activeAccount.address);
      triggerToast(`Copied: ${activeAccount.address}`, 'success');
      setTimeout(() => setCopiedKey(null), 1500);
    }
  };

  // Copy Verification Code (OTP) - 100% silent, no sound
  const handleCopyOtpCode = async () => {
    if (!activeAccount?.latestCode) {
      triggerToast('No verification code in inbox yet', 'info');
      return;
    }
    const ok = await copyToClipboard(activeAccount.latestCode);
    if (ok) {
      setCopiedKey('otp');
      triggerToast(`Copied Code: ${activeAccount.latestCode}`, 'code');
      setTimeout(() => setCopiedKey(null), 1500);
    }
  };

  // Manual Refresh Button - Checks inbox for new verification codes on user click
  const handleManualRefresh = async () => {
    if (!activeAccount) return;
    sounds.playClick();
    cancelPendingAutoCopy();
    setIsRefreshingInbox(true);
    try {
      const data = await checkInboxForAccount(activeAccount, { isManualRefresh: true, preventAutoCopy: true });
      const msgs = data?.messages || activeAccount.messages || [];
      const code = data?.latestCode || activeAccount.latestCode;
      if (code) {
        sounds.playSuccessChime();
        triggerToast(`Verification Code Ready: ${code}`, 'code');
      } else if (msgs.length > 0) {
        triggerToast(`${msgs.length} message(s) in mailbox`, 'info');
      } else {
        triggerToast('Mailbox checked — No new codes yet', 'info');
      }
    } catch {
      triggerToast('Mailbox checked', 'info');
    } finally {
      setIsRefreshingInbox(false);
    }
  };

  // Sync pasted code or email body for 100% reception
  // Uses smart client + server extraction and auto-copies immediately
  const handleSyncPastedCode = async () => {
    if (!pasteInput.trim() || !activeAccount) {
      triggerToast('Please paste the email content or code', 'info');
      return;
    }
    setIsExtracting(true);
    try {
      // 1. Client-side smart extraction first
      const localCode = extractSmartOtpCode('', pasteInput.trim(), '');

      // 2. Server-side extraction (safe for both serverless and static hosting)
      let finalCode = localCode;
      let serverMail: any = null;
      try {
        const res = await fetch('/api/tempmail/extract-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: activeAccount.address, text: pasteInput.trim() }),
        });
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          const data = await res.json();
          if (data?.code) finalCode = data.code;
          if (data?.mail) serverMail = data.mail;
        }
      } catch {}

      if (finalCode) {
        sounds.playSuccessChime();
        lastAutoCopiedCodeRef.current = finalCode;

        const fallbackMail = {
          id: `paste-${Date.now()}`,
          sender: activeAccount.domain.includes('gmail') ? 'Google Accounts' : 'Security Service',
          senderAvatar: 'S',
          fromEmail: 'noreply@security.com',
          subject: `Verification Code: ${finalCode}`,
          snippet: pasteInput.trim().substring(0, 140),
          receivedAt: new Date().toLocaleTimeString(),
          verificationCode: finalCode,
          body: pasteInput.trim(),
          isRead: false,
        };

        setActiveAccount((prev) => {
          if (!prev) return null;
          const updatedMessages = serverMail
            ? [serverMail, ...prev.messages]
            : [fallbackMail, ...prev.messages];
          return {
            ...prev,
            latestCode: finalCode,
            codeReceivedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
            messages: updatedMessages,
          };
        });
        setPasteInput('');
        setIsPasteOpen(false);
        triggerToast(`Code extracted: ${finalCode}. Click code to copy`, 'code');
      } else {
        triggerToast('Could not find verification code in pasted text', 'info');
      }
    } catch (err: any) {
      const localCode = extractSmartOtpCode('', pasteInput.trim(), '');
      if (localCode) {
        sounds.playSuccessChime();
        lastAutoCopiedCodeRef.current = localCode;
        setActiveAccount((prev) => (prev ? { ...prev, latestCode: localCode } : null));
        setPasteInput('');
        setIsPasteOpen(false);
        triggerToast(`Code extracted: ${localCode}. Click code to copy`, 'code');
      } else {
        triggerToast('Error extracting code: ' + err.message, 'info');
      }
    } finally {
      setIsExtracting(false);
    }
  };

  // Clear Mail History - Direct & safe execution, no iframe-blocking window.confirm
  const handleClearHistory = () => {
    setMailHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch {}
    triggerToast('Mail history cleared', 'info');
  };

  // Delete single item from Mail History
  const handleDeleteHistoryItem = (id: string) => {
    setMailHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    triggerToast('Removed from history', 'info');
  };

  // Initialize first email once on load or refresh inbox if already saved in localStorage
  useEffect(() => {
    primeClipboardPermission();
    if (!activeAccount) {
      handleSelectDomain('mailto.plus');
    } else {
      // Prevent copying old verification code when website is refreshed / loaded
      checkInboxForAccount(activeAccount, { preventAutoCopy: true });
    }
  }, []);

  // Topic Navigation Action Handler (Home, Mail/Inbox, Mail History, Recovery, etc.)
  const handleSelectTopic = (id: TopicId) => {
    setActiveTopic(id);

    // When switching topics from bottom bar, close modals smoothly
    if (id !== '2fa-code') {
      setIsHistoryOpen(false);
      setIsReplacementModalOpen(false);
      setIsNameGenOpen(id === 'name-generator');
      setIsPasswordGenOpen(id === 'password-creator');
      setIsUidLiveCheckOpen(id === 'url-life-check');
      setIsUsageGuideOpen(false);
      setIsInboxOpen(false);
      setIsOtpDetailsOpen(false);
    }

    if (id === 'home') {
      sounds.playClick();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (id === 'name-generator') {
      sounds.playClick();
      setIsNameGenOpen(true);
    } else if (id === 'password-creator') {
      sounds.playClick();
      setIsPasswordGenOpen(true);
    } else if (id === 'url-life-check') {
      sounds.playClick();
      setIsUidLiveCheckOpen(true);
    } else if (id === '2fa-code') {
      sounds.playClick();

      // Immediately read phone clipboard during active user gesture and generate 2FA confirmation code
      (async () => {
        let rawText: string | null = null;

        if (typeof window !== 'undefined' && typeof window.focus === 'function') {
          try { window.focus(); } catch {}
        }

        // 1. Direct modern Clipboard API during active user gesture:
        // Automatically triggers mobile browser's native clipboard permission prompt if not already allowed
        if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.readText === 'function') {
          try {
            rawText = await navigator.clipboard.readText();
            if (rawText && rawText.trim()) {
              recordCopiedText(rawText.trim());
            }
          } catch (clipErr) {
            console.warn('Direct clipboard readText error:', clipErr);
          }
        }

        // 2. Fallback to active clipboard sync and session tracked clipboard text
        if (!rawText || !rawText.trim()) {
          try {
            rawText = await syncSystemClipboard();
          } catch {}
        }
        if (!rawText || !rawText.trim()) {
          rawText = getLastKnownClipboard();
        }

        const input = (rawText || '').trim();

        if (!input) {
          triggerToast('No security key in clipboard. Please copy your 2FA security key first.', 'info');
          setTimeout(() => setActiveTopic('home'), 1000);
          return;
        }

        // 3. Extract 2FA secret key or verification code from copied text
        let secretKey = '';
        const parsed = parseCopiedSecurityKeyOrCode(input);

        if (parsed && parsed.type === 'totp') {
          secretKey = parsed.key;
        } else if (parsed && parsed.type === 'code') {
          // If the copied text was already an OTP code, copy it directly
          await copyToClipboard(parsed.code);
          if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
            try { navigator.vibrate([40, 30, 60]); } catch {}
          }
          sounds.playSuccessChime();
          sounds.playZinZinChime();
          triggerToast(`Verification Code: ${parsed.code}`, 'code');
          setTimeout(() => setActiveTopic('home'), 1200);
          return;
        } else {
          secretKey = extractBase32Secret(input);
        }

        if (!secretKey) {
          triggerToast('Could not find a valid 2FA security key in clipboard. Please copy your key and tap again.', 'info');
          setTimeout(() => setActiveTopic('home'), 1000);
          return;
        }

        // 4. Generate the exact 6-digit TOTP verification confirmation code
        try {
          const totp = generateTotpCode(secretKey);

          // 5. Immediately copy the generated confirmation code into user's phone clipboard
          await copyToClipboard(totp.code);

          // Tactile haptic vibration and chime
          if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
            try { navigator.vibrate([40, 30, 60]); } catch {}
          }
          sounds.playSuccessChime();
          sounds.playZinZinChime();

          // 6. Display confirmation code in top system notification toast
          triggerToast(`2FA Confirmation Code: ${totp.code}`, 'code');
        } catch (err: any) {
          console.error('Error generating 2FA code:', err);
          triggerToast('Error generating 2FA code from copied security key.', 'info');
        } finally {
          setTimeout(() => setActiveTopic('home'), 1200);
        }
      })();
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between select-none font-sans relative transition-colors duration-300 ${
      themeMode === 'dark'
        ? 'bg-gradient-to-b from-[#09152E] via-[#0E2046] to-[#161238] text-slate-100'
        : 'bg-gradient-to-b from-[#F2F6FE] via-[#EDF2FC] to-[#F5F1FD] text-[#123B92]'
    }`}>
      {/* App Open Splash Screen (When opened for first time, after install, or on demand) */}
      {showAppOpenSplash && (
        <AppOpenSplashScreen onComplete={handleCompleteAppOpenSplash} />
      )}

      {/* 0. Slide-Over Hamburger Menu (☰) */}
      <HamburgerMenu
        isOpen={isHamburgerOpen}
        onClose={() => setIsHamburgerOpen(false)}
        themeMode={themeMode}
        onToggleTheme={(m) => setThemeMode(m)}
        onOpenUsageGuide={(topicId) => {
          setSelectedGuideTopic(topicId);
          setIsUsageGuideOpen(true);
        }}
        selectedDomain={selectedDomain}
        onOpenDomainModal={() => setIsSelectModalOpen(true)}
        onTriggerToast={triggerToast}
        onOpenSplash={() => setShowAppOpenSplash(true)}
      />

      {/* Upper Main Application Container with generous bottom padding for fixed bottom bar */}
      <div className="w-full pt-3 pb-24 sm:pb-28 px-3 sm:px-5 md:px-6 flex flex-col justify-between road-glide-content transition-colors duration-300">
        {/* Toast Notifications */}
        <ToastNotification
          toasts={toasts}
          onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
        />

        {/* =================================================================== */}
        {/* HEADER: Brand on Far Left, Domain + Three-Dot (⋮) on Far Right     */}
        {/* Border removed as requested                                         */}
        {/* =================================================================== */}
        <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-1.5 px-0.5 sm:px-2 mb-2 select-none">
          {/* FAR LEFT CORNER: App Icon + Website Name */}
          <div className="flex items-center gap-2 select-none shrink-0">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 p-1 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 ${
              themeMode === 'dark' ? 'bg-[#0A1838]' : 'bg-white shadow-xs'
            }`}>
              <img
                src="/app-icon.png"
                alt="TempMailGo Logo"
                className="w-full h-full object-contain block select-none"
                loading="eager"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.triedBackup) {
                    target.dataset.triedBackup = 'true';
                    target.src = '/pwa-192x192.png';
                  }
                }}
              />
            </div>
            <span className={`text-base sm:text-lg font-black tracking-tight leading-none ${
              themeMode === 'dark' ? 'text-white' : 'text-[#123B92]'
            }`}>
              TempMailGo
            </span>
          </div>

          {/* FAR RIGHT CORNER: Select Domain + Three-Dot (⋮) Menu Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Domain Selector button */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setIsSelectModalOpen(true);
              }}
              title={`Domain: @${selectedDomain}`}
              className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1 sm:gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer shrink-0 border ${
                themeMode === 'dark'
                  ? 'bg-[#0E2452] border-blue-400/30 text-sky-200 hover:bg-[#13306B]'
                  : 'bg-white border-[#BACBF5] text-[#123B92] hover:bg-white/80'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0 stroke-[2.5]" />
              <span className="font-normal-typing font-normal truncate max-w-[120px] sm:max-w-none">
                @{selectedDomain}
              </span>
            </button>

            {/* THREE-DOT (⋮) MENU BUTTON AT FAR RIGHT */}
            <button
              type="button"
              id="btn-hamburger-menu"
              onClick={() => {
                sounds.playClick();
                setIsHamburgerOpen(true);
              }}
              title="Menu"
              aria-label="Open Navigation Menu"
              className={`p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 shrink-0 border ${
                themeMode === 'dark'
                  ? 'bg-[#0E2452] border-blue-400/35 text-white hover:bg-[#13306B]'
                  : 'bg-white border-[#BACBF5] text-[#123B92] hover:bg-white/80'
              }`}
            >
              <MoreVertical className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </header>

        {/* =================================================================== */}
        {/* MAIN CONTAINER: Active Mailbox & Real Verification Code (OTP)        */}
        {/* =================================================================== */}
        <main className="w-full max-w-5xl mx-auto mt-1 mb-auto pt-1 pb-4 space-y-4">
        {activeAccount ? (
          <div className={`rounded-3xl p-3 sm:p-5 space-y-4 transition-all duration-300 ${
            themeMode === 'dark'
              ? 'bg-gradient-to-b from-[#123B92]/70 via-[#222A82]/75 to-[#3E168E]/70 text-white shadow-xl'
              : 'bg-white/95 text-[#123B92] shadow-sm'
          }`}>
            {/* Live Auto-Sync Status Bar (Hidden from UI, keeps auto-sync and real-time polling running in background) */}
            <div className="hidden">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setAutoSync(!autoSync);
                    triggerToast(autoSync ? 'Auto-Sync paused' : 'Live Auto-Sync active (3s)', 'info');
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-all border-0 ${
                    autoSync
                      ? 'bg-[#2F69F8]/10 text-[#2F69F8] shadow-xs'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${autoSync ? 'bg-[#2F69F8] animate-ping' : 'bg-slate-400'}`} />
                  <span>{autoSync ? 'Auto-Sync Active (3s)' : 'Auto-Sync Paused'}</span>
                </button>
                {lastSyncTime && (
                  <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                    {lastSyncTime}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-[#743FFA] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#743FFA] inline-block" />
                <span>Real-Time Inbound</span>
              </div>
            </div>

            {/* Row 1: Active Mail Address Box */}
            <div className="space-y-1.5">
              <div className={`flex items-center justify-between text-xs font-bold ${
                themeMode === 'dark' ? 'text-slate-200' : 'text-slate-600'
              }`}>
                <span>Active Mail Address:</span>
                <span className="text-[11px] font-bold text-sky-400 bg-blue-500/20 px-2 py-0.5 rounded-lg">
                  Live
                </span>
              </div>

              <div className={`p-2.5 sm:p-3 rounded-2xl flex items-center justify-between gap-2 shadow-inner ${
                themeMode === 'dark' ? 'bg-[#07152E] border border-blue-400/25' : 'bg-[#F0F5FD]'
              }`}>
                {/* Full email address with maximum visibility */}
                <span className={`text-xs sm:text-sm font-normal-typing font-normal truncate select-all flex-1 min-w-0 tracking-normal ${
                  themeMode === 'dark' ? 'text-sky-200' : 'text-[#0A0A2C]'
                }`}>
                  {activeAccount.address}
                </span>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Dedicated Colored & Compact Copy Button */}
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    title="Copy email address"
                    className={`px-2.5 py-1 sm:px-3 sm:py-1.2 rounded-xl text-[11px] sm:text-xs font-bold flex items-center gap-1 transition-all shadow-xs active:scale-95 cursor-pointer shrink-0 ${
                      copiedKey === 'email'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-emerald-500/25 ring-1 ring-emerald-400/50'
                        : 'bg-gradient-to-r from-[#059669] via-[#10B981] to-[#0D9488] hover:opacity-95 text-white shadow-emerald-500/20'
                    }`}
                  >
                    {copiedKey === 'email' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-white stroke-[2.2]" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  {/* Compact New Button */}
                  <button
                    type="button"
                    onClick={handleNewAddress}
                    title="Generate new email address"
                    className="px-2.5 py-1 sm:px-3 sm:py-1.2 rounded-xl border-0 bg-gradient-to-r from-[#1870E9] via-[#6865E3] to-[#9D50EA] hover:opacity-95 text-white text-[11px] sm:text-xs font-bold flex items-center gap-1 transition-all shadow-xs shadow-blue-500/20 active:scale-95 cursor-pointer shrink-0"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 transition-transform duration-500 ${isNewSpinning ? 'animate-spin' : ''}`} />
                    <span>New</span>
                  </button>
                </div>
              </div>
            </div>

            {/* =============================================================== */}
            {/* UNIFIED VERIFICATION CODE & DETAILS CARD (4 INCHES TALL, ONE BORDER, NO MIDDLE BORDER) */}
            {/* =============================================================== */}
            {(() => {
              const messageWithCode =
                activeAccount.messages?.find(
                  (m) => Boolean(m.verificationCode && m.verificationCode === activeAccount.latestCode)
                ) ||
                activeAccount.messages?.find((m) => Boolean(m.verificationCode));

              const verificationCode = activeAccount.latestCode || messageWithCode?.verificationCode;
              const latestMsg = messageWithCode || activeAccount.messages?.[0];

              const platformInfo = latestMsg
                ? detectPlatformOrigin(
                    latestMsg.sender || '',
                    latestMsg.fromEmail || '',
                    latestMsg.subject || '',
                    latestMsg.body || ''
                  )
                : null;

              const senderNetwork = detectSenderNetworkInfo(
                latestMsg?.fromEmail,
                latestMsg?.sender,
                latestMsg?.body,
                latestMsg?.subject,
                latestMsg?.originIp,
                latestMsg?.originLocation
              );

              const clientRealLocation = [clientNetwork?.city, clientNetwork?.region, clientNetwork?.country]
                .filter(Boolean)
                .join(', ') || 'Detecting Live Location...';

              const clientRealIp = clientNetwork?.ip || 'Detecting Live IP...';

              return (
                <div
                  className={`rounded-3xl border p-4 sm:p-6 shadow-md transition-all min-h-[384px] flex flex-col justify-between space-y-4 ${
                    themeMode === 'dark'
                      ? 'border-blue-400/35 bg-[#081533]/95 text-white shadow-blue-950/40'
                      : 'border-slate-200/90 bg-gradient-to-b from-[#F8FAFC] to-white text-[#0A0A2C] shadow-xs'
                  }`}
                >
                  {/* TOP SECTION: Verification Code / OTP */}
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-2">
                      <div className="flex items-center gap-2">
                        {verificationCode && platformInfo ? (
                          <PlatformOfficialLogo
                            platformName={platformInfo.name}
                            senderEmail={latestMsg?.fromEmail}
                            size={22}
                          />
                        ) : (
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            themeMode === 'dark' ? 'bg-[#0E2452] text-sky-300' : 'bg-blue-50 text-blue-600'
                          }`}>
                            <Key className="w-4 h-4 stroke-[2.5]" />
                          </div>
                        )}
                        <h3 className={`text-xs sm:text-sm font-black ${
                          themeMode === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}>
                          {verificationCode && platformInfo
                            ? `${platformInfo.name} Verification Code & Details`
                            : 'Verification Code & Details'}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        {verificationCode ? (
                          <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center gap-1">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Code Ready</span>
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-300 border border-sky-400/30">
                            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                            <span>Awaiting Code</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Prominent Code Display */}
                    <div
                      onClick={verificationCode ? handleCopyOtpCode : undefined}
                      role={verificationCode ? 'button' : undefined}
                      tabIndex={verificationCode ? 0 : undefined}
                      title={verificationCode ? 'Click to copy verification code' : undefined}
                      className={`p-3.5 sm:p-4 rounded-2xl transition-all flex items-center justify-between gap-3 ${
                        verificationCode
                          ? 'bg-gradient-to-r from-blue-500/15 via-indigo-500/15 to-purple-500/15 border border-blue-400/40 shadow-xs cursor-pointer active:scale-[0.99]'
                          : (themeMode === 'dark'
                              ? 'bg-[#06122C]/80 border border-dashed border-blue-400/30'
                              : 'bg-slate-50 border border-dashed border-slate-200')
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 ${
                            verificationCode
                              ? 'bg-white p-1 border border-blue-200 shadow-xs'
                              : (themeMode === 'dark' ? 'bg-[#0E2452] text-sky-300' : 'bg-white text-slate-400 shadow-xs')
                          }`}
                        >
                          {verificationCode && platformInfo ? (
                            <PlatformOfficialLogo
                              platformName={platformInfo.name}
                              senderEmail={latestMsg?.fromEmail}
                              size={30}
                            />
                          ) : (
                            <Key className="w-5 h-5" />
                          )}
                        </div>

                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[11px] font-bold uppercase tracking-wider ${themeMode === 'dark' ? 'text-sky-300' : 'text-slate-500'}`}>
                              {verificationCode ? 'Verification Code (OTP)' : 'Waiting for Code'}
                            </span>
                            {verificationCode && platformInfo && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-white border border-blue-200 text-blue-800 text-[10px] font-black shadow-2xs">
                                <span>{platformInfo.name} Official</span>
                              </span>
                            )}
                            {verificationCode && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-blue-100 text-blue-800 text-[10px] font-mono font-bold tracking-tight border border-blue-200/80">
                                <span>🕒</span>
                                <span>
                                  {activeAccount.codeReceivedAt ||
                                    (latestMsg?.receivedAt ? new Date(latestMsg.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }))}
                                </span>
                              </span>
                            )}
                          </div>

                          {verificationCode ? (
                            <div className="flex items-center gap-2 pt-0.5">
                              <span className={`font-mono text-xl sm:text-2xl font-black tracking-widest px-2.5 py-0.5 rounded-lg border shadow-2xs inline-block ${
                                copiedKey === 'otp'
                                  ? 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-300/50'
                                  : (themeMode === 'dark' ? 'text-emerald-300 bg-[#0A1E40] border-blue-400/40' : 'text-slate-900 bg-white border-slate-200')
                              }`}>
                                {verificationCode}
                              </span>
                              {copiedKey === 'otp' && (
                                <span className="text-xs font-bold text-emerald-500 animate-fade-in">
                                  Copied!
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 pt-0.5">
                              <span className="w-2 h-2 rounded-full bg-[#1870E9] animate-pulse inline-block" />
                              <span className={`text-xs font-medium ${themeMode === 'dark' ? 'text-sky-200/80' : 'text-slate-500'}`}>
                                Waiting for incoming verification code...
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* One-touch Copy Button on Right */}
                      {verificationCode && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyOtpCode();
                          }}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-bold flex items-center gap-1 transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
                          title="Copy Code"
                        >
                          <Copy className="w-3.5 h-3.5 stroke-[2.2]" />
                          <span className="hidden sm:inline">Copy Code</span>
                        </button>
                      )}
                    </div>

                    {/* Refresh / Check Code Button smoothly integrated inside the box */}
                    <button
                      type="button"
                      id="btn-main-refresh"
                      disabled={isRefreshingInbox}
                      onClick={handleManualRefresh}
                      className="w-full py-2.5 px-4 rounded-xl border-0 bg-gradient-to-r from-[#1870E9] via-[#6865E3] to-[#EC4899] hover:opacity-95 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 text-white ${isRefreshingInbox ? 'animate-spin' : ''}`} />
                      <span>{isRefreshingInbox ? 'Checking Mailbox...' : 'Refresh / Check Code'}</span>
                    </button>
                  </div>

                  {/* BOTTOM SECTION: Verification Details (NO intermediate border line!) */}
                  <div className="pt-2">
                    {verificationCode && latestMsg ? (
                      <div className="space-y-2.5 text-xs sm:text-sm animate-in fade-in duration-300">
                        {/* Sender Name & Platform */}
                        <div className="flex items-start gap-2">
                          <span className={`font-bold w-28 shrink-0 ${themeMode === 'dark' ? 'text-sky-300' : 'text-slate-500'}`}>
                            Sender:
                          </span>
                          <div className="flex items-center gap-2 flex-wrap min-w-0">
                            <span className="font-semibold break-all select-text">
                              {latestMsg.sender || latestMsg.fromEmail || 'Verification System'}
                            </span>
                            {platformInfo && (
                              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md border ${
                                themeMode === 'dark'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                                  : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              }`}>
                                {platformInfo.name} Official
                              </span>
                            )}
                          </div>
                        </div>

                        {/* From Email */}
                        <div className="flex items-start gap-2">
                          <span className={`font-bold w-28 shrink-0 ${themeMode === 'dark' ? 'text-sky-300' : 'text-slate-500'}`}>
                            From Email:
                          </span>
                          <span className="text-xs font-normal-typing font-normal break-all select-all opacity-90">
                            {latestMsg.fromEmail || 'no-reply@verification.com'}
                          </span>
                        </div>

                        {/* Real Sender Origin IP */}
                        <div className="flex items-start gap-2">
                          <span className={`font-bold w-28 shrink-0 flex items-center gap-1 pt-0.5 ${themeMode === 'dark' ? 'text-indigo-300' : 'text-slate-500'}`}>
                            <Server className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span>Sender Real IP:</span>
                          </span>
                          <div className="min-w-0 flex items-center gap-2 flex-wrap">
                            <span className={`font-mono font-bold text-xs sm:text-sm select-all ${
                              themeMode === 'dark' ? 'text-indigo-300' : 'text-indigo-700'
                            }`}>
                              {senderNetwork.ip}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                if (senderNetwork.ip) {
                                  copyToClipboard(senderNetwork.ip);
                                  sounds.playSuccessChime();
                                  setCopiedKey('sender_ip');
                                  triggerToast(`Copied Sender IP: ${senderNetwork.ip}`, 'success');
                                  setTimeout(() => setCopiedKey(null), 1500);
                                }
                              }}
                              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                                copiedKey === 'sender_ip'
                                  ? 'bg-indigo-600 text-white border-indigo-500'
                                  : (themeMode === 'dark' ? 'bg-blue-950/60 text-indigo-300 border-indigo-500/30 hover:bg-blue-900/60' : 'bg-indigo-50 text-indigo-800 border-indigo-300 hover:bg-indigo-100')
                              }`}
                            >
                              {copiedKey === 'sender_ip' ? 'Copied' : 'Copy IP'}
                            </button>
                          </div>
                        </div>

                        {/* Real Sender Location */}
                        <div className="flex items-start gap-2">
                          <span className={`font-bold w-28 shrink-0 flex items-center gap-1 ${themeMode === 'dark' ? 'text-rose-300' : 'text-slate-500'}`}>
                            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            <span>Sender Location:</span>
                          </span>
                          <span className={`font-semibold text-xs sm:text-sm select-text ${themeMode === 'dark' ? 'text-rose-300' : 'text-rose-700'}`}>
                            {senderNetwork.location}
                          </span>
                        </div>

                        {/* Recipient Real IP */}
                        <div className="flex items-start gap-2">
                          <span className={`font-bold w-28 shrink-0 flex items-center gap-1 pt-0.5 ${themeMode === 'dark' ? 'text-emerald-300' : 'text-slate-500'}`}>
                            <Wifi className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Your Real IP:</span>
                          </span>
                          <div className="min-w-0 flex items-center gap-2 flex-wrap">
                            <span className={`font-mono font-bold text-xs sm:text-sm select-all ${
                              themeMode === 'dark' ? 'text-emerald-300' : 'text-emerald-700'
                            }`}>
                              {clientRealIp}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                if (clientRealIp && clientRealIp !== 'Detecting Live IP...') {
                                  copyToClipboard(clientRealIp);
                                  sounds.playSuccessChime();
                                  setCopiedKey('client_ip');
                                  triggerToast(`Copied Your Real IP: ${clientRealIp}`, 'success');
                                  setTimeout(() => setCopiedKey(null), 1500);
                                }
                              }}
                              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                                copiedKey === 'client_ip'
                                  ? 'bg-emerald-600 text-white border-emerald-500'
                                  : (themeMode === 'dark' ? 'bg-blue-950/60 text-emerald-300 border-emerald-500/30 hover:bg-blue-900/60' : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100')
                              }`}
                            >
                              {copiedKey === 'client_ip' ? 'Copied' : 'Copy IP'}
                            </button>
                          </div>
                        </div>

                        {/* Recipient Location */}
                        <div className="flex items-start gap-2">
                          <span className={`font-bold w-28 shrink-0 flex items-center gap-1 ${themeMode === 'dark' ? 'text-teal-300' : 'text-slate-500'}`}>
                            <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                            <span>Your Location:</span>
                          </span>
                          <span className={`font-semibold text-xs sm:text-sm select-text ${themeMode === 'dark' ? 'text-teal-300' : 'text-teal-800'}`}>
                            {clientRealLocation}
                          </span>
                        </div>

                        {/* Subject */}
                        <div className="flex items-start gap-2">
                          <span className={`font-bold w-28 shrink-0 ${themeMode === 'dark' ? 'text-sky-300' : 'text-slate-500'}`}>
                            Subject:
                          </span>
                          <span className="font-semibold break-words select-text">
                            {latestMsg.subject || 'Your verification code'}
                          </span>
                        </div>

                        {/* Message Preview */}
                        <div className="pt-1">
                          <span className={`font-bold block mb-1 ${themeMode === 'dark' ? 'text-sky-300' : 'text-slate-500'}`}>
                            Message Preview:
                          </span>
                          <div className={`p-2.5 rounded-xl font-sans text-xs leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap select-text ${
                            themeMode === 'dark' ? 'bg-[#061026]/90 text-slate-200' : 'bg-slate-50 text-slate-700'
                          }`}>
                            {latestMsg.snippet || latestMsg.body?.replace(/<[^>]+>/g, ' ').slice(0, 500) || 'Verification email received.'}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-8 flex flex-col items-center justify-center text-center space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-pulse" />
                          <span>Awaiting incoming verification details...</span>
                        </div>
                        <span className="text-[11px] text-slate-400/80 dark:text-slate-500/80">
                          Sender origin, relay IP, and security details will appear here automatically.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* =============================================================== */}
            {/* EMBEDDED MAIL RECOVERY & MAIL HISTORY SECTION                  */}
            {/* Positioned directly below Verification Details                 */}
            {/* =============================================================== */}
            <div
              className={`mt-4 p-4 sm:p-5 rounded-3xl border transition-all ${
                themeMode === 'dark'
                  ? 'bg-gradient-to-br from-[#0B1E4A]/90 via-[#0F265C]/90 to-[#181B52]/90 border-blue-400/35 text-white shadow-xl shadow-blue-950/40'
                  : 'bg-gradient-to-br from-white/95 via-[#F6F9FF]/95 to-[#EFEAFF]/95 border-[#BACBF5] text-[#123B92] shadow-lg shadow-indigo-100/50'
              }`}
            >
              {/* Header with Title on Left and Mail History button on Right corner */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-blue-200/40 dark:border-blue-400/20">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      themeMode === 'dark'
                        ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/30'
                        : 'bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/20'
                    }`}
                  >
                    <Key className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className={`text-sm sm:text-base font-black tracking-tight ${
                      themeMode === 'dark' ? 'text-white' : 'text-[#123B92]'
                    }`}>
                      Recovery Mail
                    </h3>
                  </div>
                </div>

                {/* Right Corner: Mail History Button */}
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setIsHistoryOpen(true);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 ${
                    themeMode === 'dark'
                      ? 'bg-blue-600/30 hover:bg-blue-600/50 border-blue-400/40 text-sky-200'
                      : 'bg-white hover:bg-blue-50 border-blue-300 text-blue-700'
                  }`}
                  title="View Mail History"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Mail History</span>
                  {mailHistory.length > 0 && (
                    <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-blue-600 text-white">
                      {mailHistory.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Directly Embedded Recovery Mail Feature (No Modal Required) */}
              <div className="space-y-3 pt-1">
                {/* Email Input Field with Paste & Clear Buttons */}
                <div className="space-y-1.5">
                  <label className={`block text-xs font-bold ${
                    themeMode === 'dark' ? 'text-sky-200' : 'text-slate-700'
                  }`}>
                    Recovery Email Address
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={recoveryEmailInput}
                      onChange={(e) => setRecoveryEmailInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleFetchRecoveryCode();
                        }
                      }}
                      placeholder="Enter recovery email address..."
                      className={`w-full pl-3.5 pr-20 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                        themeMode === 'dark'
                          ? 'bg-[#081533] border-blue-400/30 text-white placeholder-slate-400 focus:border-amber-400 focus:ring-1 focus:ring-amber-400'
                          : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                      }`}
                    />

                    <div className="absolute right-1.5 flex items-center gap-1">
                      {recoveryEmailInput && (
                        <button
                          type="button"
                          onClick={() => setRecoveryEmailInput('')}
                          className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
                          title="Clear input"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handlePasteRecoveryEmail}
                        className={`px-2 py-1 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1 cursor-pointer active:scale-95 ${
                          themeMode === 'dark'
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                        }`}
                        title="Paste from clipboard"
                      >
                        <Clipboard className="w-3 h-3" />
                        <span>Paste</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Row: Get Verification Code Button + Dedicated Clear Button */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isRecoveryLoading}
                    onClick={handleFetchRecoveryCode}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:opacity-95 disabled:opacity-80 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRecoveryLoading ? 'animate-spin' : ''}`} />
                    <span>{isRecoveryLoading ? 'Checking Mailbox...' : 'Get Verification Code'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClearRecovery}
                    className={`px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 shrink-0 ${
                      themeMode === 'dark'
                        ? 'bg-rose-500/20 hover:bg-rose-500/30 border-rose-400/40 text-rose-300'
                        : 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700'
                    }`}
                    title="Clear recovery input and verification code"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear</span>
                  </button>
                </div>

                {/* Result Display Card (Appears after fetch) */}
                {recoveryResult && (
                  <div className={`p-3.5 rounded-2xl border transition-all animate-in fade-in duration-200 ${
                    recoveryResult.success && recoveryResult.latestCode
                      ? (themeMode === 'dark'
                          ? 'bg-[#062418]/90 border-emerald-400/40 text-white'
                          : 'bg-emerald-50 border-emerald-300 text-emerald-950')
                      : (themeMode === 'dark'
                          ? 'bg-[#1C1628]/90 border-amber-400/30 text-slate-200'
                          : 'bg-slate-50 border-slate-300 text-slate-700')
                  }`}>
                    {recoveryResult.success && recoveryResult.latestCode ? (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            Verification Code Received
                          </span>
                          {recoveryResult.receivedAt && (
                            <span className="text-[11px] font-medium opacity-75">
                              {recoveryResult.receivedAt}
                            </span>
                          )}
                        </div>

                        {/* Code Display with One-Touch Copy */}
                        <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white dark:bg-[#041710] border border-emerald-400/30">
                          <span className="font-mono text-xl sm:text-2xl font-black tracking-widest text-emerald-600 dark:text-emerald-400 select-all">
                            {recoveryResult.latestCode}
                          </span>
                          <button
                            type="button"
                            onClick={async () => {
                              if (recoveryResult.latestCode) {
                                await copyToClipboard(recoveryResult.latestCode);
                                sounds.playSuccessChime();
                                setIsRecoveryCopied(true);
                                triggerToast(`Copied Code: ${recoveryResult.latestCode}`, 'code');
                                setTimeout(() => setIsRecoveryCopied(false), 2000);
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shrink-0"
                          >
                            {isRecoveryCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>
                        </div>

                        {recoveryResult.sender && (
                          <p className="text-xs opacity-80 truncate">
                            Sender: <span className="font-semibold">{recoveryResult.sender}</span>
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs py-1">
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>{recoveryResult.error || 'No code received in this mailbox yet.'}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-3xl border-0 shadow-xl">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#1870E9] mb-2" />
            <p className="text-xs font-semibold text-slate-700">Loading active mailbox...</p>
          </div>
        )}
      </main>
      </div>

      {/* =================================================================== */}
      {/* MODALS                                                              */}
      {/* =================================================================== */}
      {/* 1. Domain Select Modal (Serial 1-20 list) */}
      <SelectOptionsModal
        isOpen={isSelectModalOpen}
        onClose={() => setIsSelectModalOpen(false)}
        currentDomain={selectedDomain}
        onSelectDomain={handleSelectDomain}
        isLoading={isLoadingAddress}
        themeMode={themeMode}
      />

      {/* 2. Inbox Drawer */}
      {activeAccount && (
        <InboxDrawer
          isOpen={isInboxOpen}
          onClose={() => {
            setIsInboxOpen(false);
            setActiveTopic('home');
          }}
          account={activeAccount}
          onRefreshInbox={handleManualRefresh}
          isRefreshing={isRefreshingInbox}
          onTriggerToast={triggerToast}
          onNewGmail={handleNewAddress}
          onRecordCopiedEmail={recordCopiedEmail}
          themeMode={themeMode}
        />
      )}

      {/* 3. Mail History Modal (Bottom Left) */}
      <MailHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => {
          setIsHistoryOpen(false);
          setActiveTopic('home');
        }}
        history={mailHistory}
        onClearHistory={handleClearHistory}
        onDeleteHistoryItem={handleDeleteHistoryItem}
        onTriggerToast={triggerToast}
        themeMode={themeMode}
      />

      {/* 4. Replacement Mail Code Modal (Bottom Right) */}
      <ReplacementCodeModal
        isOpen={isReplacementModalOpen}
        onClose={() => {
          setIsReplacementModalOpen(false);
          setActiveTopic('home');
        }}
        defaultEmail={activeAccount?.address || ''}
        onTriggerToast={triggerToast}
        onCodeReceived={(email, code, details) => {
          const currentClockTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
          const cleanEmail = email.trim().toLowerCase();

          setActiveAccount((prev) => {
            if (!prev) {
              return {
                id: `acc-${Date.now()}`,
                address: cleanEmail,
                domain: cleanEmail.split('@')[1] || 'mailto.plus',
                provider: 'Temp Mail Plus',
                providerUrl: `https://tempmail.plus/en/#!${cleanEmail}`,
                createdAt: new Date().toISOString(),
                expiresInMinutes: 60,
                latestCode: code,
                codeReceivedAt: currentClockTime,
                messages: details?.subject ? [{
                  id: `rec-${Date.now()}`,
                  sender: details.sender || 'Verification Service',
                  fromEmail: details.fromEmail || 'noreply@service.com',
                  subject: details.subject || 'Verification Email',
                  snippet: `Code: ${code}`,
                  receivedAt: currentClockTime,
                  verificationCode: code,
                  body: `Verification Code: ${code}`,
                  isRead: false,
                }] : [],
              };
            }

            const updatedMessages = details?.subject && !prev.messages.some((m) => m.verificationCode === code)
              ? [{
                  id: `rec-${Date.now()}`,
                  sender: details.sender || 'Verification Service',
                  fromEmail: details.fromEmail || 'noreply@service.com',
                  subject: details.subject || 'Verification Email',
                  snippet: `Code: ${code}`,
                  receivedAt: currentClockTime,
                  verificationCode: code,
                  body: `Verification Code: ${code}`,
                  isRead: false,
                }, ...prev.messages]
              : prev.messages;

            return {
              ...prev,
              address: cleanEmail,
              latestCode: code,
              codeReceivedAt: currentClockTime,
              messages: updatedMessages,
            };
          });
        }}
        themeMode={themeMode}
      />

      {/* 5. Name Generator Modal */}
      <NameGeneratorModal
        isOpen={isNameGenOpen}
        onClose={() => {
          setIsNameGenOpen(false);
          setActiveTopic('home');
        }}
        onTriggerToast={triggerToast}
        themeMode={themeMode}
      />

      {/* 7. Password Generator Modal */}
      <PasswordGeneratorModal
        isOpen={isPasswordGenOpen}
        onClose={() => {
          setIsPasswordGenOpen(false);
          setActiveTopic('home');
        }}
        onTriggerToast={triggerToast}
        themeMode={themeMode}
      />

      {/* 8. Verification Code Details Page */}
      {activeAccount && (
        <VerificationCodeDetailsPage
          isOpen={isOtpDetailsOpen}
          onClose={() => {
            setIsOtpDetailsOpen(false);
            setActiveTopic('home');
          }}
          account={activeAccount}
          clientNetwork={clientNetwork}
          onTriggerToast={triggerToast}
          themeMode={themeMode}
        />
      )}

      {/* 9. UID Live Check Full Scan Page */}
      <UidLiveCheckPage
        isOpen={isUidLiveCheckOpen}
        onClose={() => {
          setIsUidLiveCheckOpen(false);
          setActiveTopic('home');
        }}
        onTriggerToast={triggerToast}
        themeMode={themeMode}
      />

      {/* 10. Comprehensive English Features & Usage Guide Page */}
      <TopicUsageGuidePage
        isOpen={isUsageGuideOpen}
        onClose={() => {
          setIsUsageGuideOpen(false);
          setActiveTopic('home');
        }}
        initialTopic={selectedGuideTopic}
        themeMode={themeMode}
      />



      {/* =================================================================== */}
      {/* ALWAYS VISIBLE BOTTOM NAVIGATION BAR: DOCKED AT SCREEN BOTTOM (Z-75)*/}
      {/* Remains permanently visible on screen across all tools and views    */}
      {/* =================================================================== */}
      <footer className={`fixed bottom-0 inset-x-0 z-[75] py-1 px-1 sm:px-2 border-t backdrop-blur-xl transition-colors duration-300 ${
        themeMode === 'dark'
          ? 'bg-[#09152E]/95 border-blue-400/25 text-white shadow-[0_-4px_25px_rgba(0,0,0,0.6)]'
          : 'bg-[#F2F6FE]/95 border-[#BACBF5] text-[#123B92] shadow-[0_-4px_20px_rgba(18,59,146,0.12)]'
      }`}>
        <NavTopicBar
          activeTopic={activeTopic}
          onSelectTopic={handleSelectTopic}
          mailHistoryCount={mailHistory.length}
          themeMode={themeMode}
        />
      </footer>
    </div>
  );
}
