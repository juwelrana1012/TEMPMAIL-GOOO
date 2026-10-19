import { useEffect, useState } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;
const promptListeners = new Set<(prompt: BeforeInstallPromptEvent | null) => void>();

if (typeof window !== 'undefined') {
  if ((window as any).__pwaInstallPrompt) {
    globalDeferredPrompt = (window as any).__pwaInstallPrompt;
  }

  (window as any).__onPWAInstallPrompt = (e: BeforeInstallPromptEvent) => {
    globalDeferredPrompt = e;
    promptListeners.forEach((fn) => fn(globalDeferredPrompt));
  };

  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    globalDeferredPrompt = e as BeforeInstallPromptEvent;
    (window as any).__pwaInstallPrompt = e;
    promptListeners.forEach((fn) => fn(globalDeferredPrompt));
  });

  window.addEventListener('appinstalled', () => {
    globalDeferredPrompt = null;
    if ((window as any).__pwaInstallPrompt) {
      (window as any).__pwaInstallPrompt = null;
    }
    promptListeners.forEach((fn) => fn(null));
  });
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    () => globalDeferredPrompt || (typeof window !== 'undefined' ? (window as any).__pwaInstallPrompt : null)
  );
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isAndroid, setIsAndroid] = useState<boolean>(false);
  const [isInIframe, setIsInIframe] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    setIsAndroid(/android/.test(userAgent));
    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true);
    }

    const checkStandalone = () => {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://');
      setIsInstalled(isStandalone);
    };

    checkStandalone();

    if ((window as any).__pwaInstallPrompt && !globalDeferredPrompt) {
      globalDeferredPrompt = (window as any).__pwaInstallPrompt;
      setDeferredPrompt(globalDeferredPrompt);
    }

    const listener = (prompt: BeforeInstallPromptEvent | null) => {
      setDeferredPrompt(prompt);
      checkStandalone();
    };

    promptListeners.add(listener);

    return () => {
      promptListeners.delete(listener);
    };
  }, []);

  const install = async (): Promise<boolean> => {
    let promptEvent =
      deferredPrompt ||
      globalDeferredPrompt ||
      (typeof window !== 'undefined' ? (window as any).__pwaInstallPrompt : null);

    // If not ready immediately, poll briefly for up to 800ms
    if (!promptEvent && typeof window !== 'undefined') {
      for (let i = 0; i < 8; i++) {
        await new Promise((res) => setTimeout(res, 100));
        promptEvent =
          globalDeferredPrompt || (window as any).__pwaInstallPrompt;
        if (promptEvent) {
          setDeferredPrompt(promptEvent);
          break;
        }
      }
    }

    if (!promptEvent) return false;

    try {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice && choice.outcome === 'accepted') {
        globalDeferredPrompt = null;
        setDeferredPrompt(null);
        if (typeof window !== 'undefined') {
          (window as any).__pwaInstallPrompt = null;
          try {
            localStorage.setItem('tempmailgo_first_launch_after_install', 'true');
          } catch {}
        }
        setIsInstalled(true);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return {
    isInstallable: !!(
      deferredPrompt ||
      globalDeferredPrompt ||
      (typeof window !== 'undefined' && (window as any).__pwaInstallPrompt)
    ),
    isInstalled,
    isIOS,
    isAndroid,
    isInIframe,
    install,
  };
}
