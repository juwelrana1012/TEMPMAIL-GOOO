/**
 * Bulletproof clipboard and auto-copy utility.
 * Handles iframes, background timers, un-focused tabs, mobile iOS/Android,
 * and deferred clipboard write when user switches back to the tab.
 */

// Track last successfully copied code and pending codes
let currentClipboardText: string | null = null;
try {
  if (typeof localStorage !== 'undefined') {
    currentClipboardText = localStorage.getItem('__last_app_clipboard__');
  }
} catch {}

let pendingAutoCopyCode: string | null = null;
let pendingAutoCopyTimestamp = 0;
let autoCopyListenersAttached = false;
const copySubscribers = new Set<(code: string) => void>();

/**
 * Explicitly cancels any pending verification auto-copy
 * (e.g. when user clicks Refresh, switches tabs, or performs manual action)
 */
export function cancelPendingAutoCopy(): void {
  pendingAutoCopyCode = null;
  pendingAutoCopyTimestamp = 0;
}

export function subscribeToAutoCopy(cb: (code: string) => void): () => void {
  copySubscribers.add(cb);
  return () => {
    copySubscribers.delete(cb);
  };
}

function notifySubscribers(code: string) {
  copySubscribers.forEach((cb) => {
    try {
      cb(code);
    } catch (e) {
      console.warn('Subscriber error:', e);
    }
  });
}

function rememberCopiedText(text: string) {
  currentClipboardText = text;
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('__latest_clipboard_text__', text);
    }
  } catch {}
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('__last_app_clipboard__', text);
    }
  } catch {}
}

export function recordCopiedText(text: string) {
  if (!text || typeof text !== 'string') return;
  const clean = text.trim();
  if (!clean) return;
  rememberCopiedText(clean);
}

export function getLastKnownClipboard(): string | null {
  if (currentClipboardText && currentClipboardText.trim()) {
    return currentClipboardText.trim();
  }
  try {
    if (typeof sessionStorage !== 'undefined') {
      const s = sessionStorage.getItem('__latest_clipboard_text__');
      if (s && s.trim()) {
        currentClipboardText = s.trim();
        return s.trim();
      }
    }
  } catch {}
  try {
    if (typeof localStorage !== 'undefined') {
      const l = localStorage.getItem('__last_app_clipboard__');
      if (l && l.trim()) {
        currentClipboardText = l.trim();
        return l.trim();
      }
    }
  } catch {}
  return null;
}

/**
 * Actively syncs text from the system clipboard into local storage & memory.
 * Captures external keys copied outside this tab / app.
 */
export async function syncSystemClipboard(): Promise<string | null> {
  if (typeof navigator === 'undefined' || !navigator.clipboard || typeof navigator.clipboard.readText !== 'function') {
    return getLastKnownClipboard();
  }

  try {
    if (typeof window !== 'undefined' && typeof window.focus === 'function') {
      window.focus();
    }
    const text = await navigator.clipboard.readText();
    if (text && text.trim()) {
      recordCopiedText(text.trim());
      return text.trim();
    }
  } catch (err) {
    // Browser may require user activation or explicit permission
  }
  return getLastKnownClipboard();
}

/**
 * Prime & request clipboard permission on user interaction so that
 * the entire session retains active permission to read the keyboard clipboard.
 */
export async function primeClipboardPermission(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return false;

  try {
    if (navigator.permissions && typeof navigator.permissions.query === 'function') {
      const status = await navigator.permissions.query({ name: 'clipboard-read' as any });
      if (status.state === 'granted') {
        syncSystemClipboard();
        return true;
      }
    }
  } catch {}

  if (typeof navigator.clipboard.readText === 'function') {
    try {
      const initialText = await navigator.clipboard.readText();
      if (initialText && initialText.trim()) {
        recordCopiedText(initialText.trim());
      }
      return true;
    } catch {
      // Permission prompt was dismissed or blocked
    }
  }
  return false;
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  // Sniff copy and cut events in the window
  const captureCopyEvent = () => {
    try {
      const selected = window.getSelection()?.toString();
      if (selected && selected.trim()) {
        recordCopiedText(selected.trim());
      }
    } catch {}
  };
  document.addEventListener('copy', captureCopyEvent, { passive: true, capture: true });
  document.addEventListener('cut', captureCopyEvent, { passive: true, capture: true });

  // Sniff paste event across the document
  document.addEventListener(
    'paste',
    (e: ClipboardEvent) => {
      try {
        const text = e.clipboardData?.getData('text');
        if (text && text.trim()) {
          recordCopiedText(text.trim());
        }
      } catch {}
    },
    { passive: true, capture: true }
  );

  // Read system clipboard whenever user returns to this tab from an external app or site
  const handleReturnToTab = () => {
    syncSystemClipboard();
  };
  window.addEventListener('focus', handleReturnToTab, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      handleReturnToTab();
    }
  }, { passive: true });
}

/**
 * Robust copy to clipboard with comprehensive fallback for iframes and background environments.
 * Strictly copies ONLY the raw text without extra spaces, newlines, or labels.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text || typeof text !== 'string') return false;
  const clean = text.trim();
  if (!clean) return false;

  let success = false;

  // Strategy 1: Modern navigator.clipboard API
  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(clean);
      rememberCopiedText(clean);
      success = true;
      return true;
    } catch {
      // Permission denied or document not focused (e.g. running from background setInterval while user in another tab)
    }
  }

  // Strategy 2: Clean synchronous document.execCommand('copy') - works 100% without permission prompts
  if (typeof document !== 'undefined') {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = clean;
      // Critical: Do not make it readonly as some browser engines fail to copy readonly text!
      // Keep it in viewport with 0 opacity so focus() does not get rejected
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.width = '2em';
      textArea.style.height = '2em';
      textArea.style.padding = '0';
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';
      textArea.style.background = 'transparent';
      textArea.style.opacity = '0.01';
      textArea.style.pointerEvents = 'none';
      textArea.style.zIndex = '-9999';

      document.body.appendChild(textArea);
      textArea.focus({ preventScroll: true });
      textArea.select();
      textArea.setSelectionRange(0, clean.length);

      const execResult = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (execResult) {
        rememberCopiedText(clean);
        success = true;
        return true;
      }
    } catch (err) {
      console.warn('execCommand copy fallback warning:', err);
    }
  }

  return success;
}

/**
 * Ensures code is copied when tab is focused, without hijacking user button clicks or touches
 */
export function autoCopyVerificationCode(code: string): Promise<boolean> {
  if (!code) return Promise.resolve(false);

  pendingAutoCopyCode = code;
  pendingAutoCopyTimestamp = Date.now();

  // Try immediate copy if page is currently focused
  return copyToClipboard(code).then((ok) => {
    if (ok) {
      pendingAutoCopyCode = null;
      notifySubscribers(code);
      return true;
    }

    // If window not focused, set up focus listeners (expires after 5 seconds)
    setupDeferredCopyListeners();
    return false;
  });
}

function executePendingCopy() {
  if (!pendingAutoCopyCode) return;
  // Automatically expire after 5 seconds
  if (Date.now() - pendingAutoCopyTimestamp > 5000) {
    pendingAutoCopyCode = null;
    return;
  }
  const code = pendingAutoCopyCode;
  pendingAutoCopyCode = null;
  copyToClipboard(code).then((ok) => {
    if (ok) {
      notifySubscribers(code);
    }
  });
}

function setupDeferredCopyListeners() {
  if (autoCopyListenersAttached || typeof window === 'undefined') return;
  autoCopyListenersAttached = true;

  const handleFocusActivation = () => {
    if (pendingAutoCopyCode && Date.now() - pendingAutoCopyTimestamp <= 5000) {
      executePendingCopy();
    } else {
      pendingAutoCopyCode = null;
    }
  };

  // Only check on explicit window focus or tab visibility - NEVER hijack button clicks or pointerdown
  window.addEventListener('focus', handleFocusActivation, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      handleFocusActivation();
    }
  }, { passive: true });
}

/**
 * Read text from system clipboard with user activation preservation and fallback
 */
export async function readFromClipboard(): Promise<string | null> {
  // Strategy 1: Direct modern navigator.clipboard.readText() while transient user gesture is active
  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.readText === 'function') {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        recordCopiedText(text.trim());
        return text.trim();
      }
    } catch (err) {
      // Permission prompt was dismissed or iframe restriction
    }
  }

  // Strategy 2: Fallback to last known tracked clipboard text (captured from previous copy/paste events)
  const lastKnown = getLastKnownClipboard();
  if (lastKnown && lastKnown.trim()) {
    return lastKnown.trim();
  }

  return null;
}
