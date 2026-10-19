/**
 * Secure encrypted storage for TOTP 2FA Secret Key
 * Protects secret key at rest using Web Crypto API (AES-GCM 256-bit)
 * Keeps secrets safe from plain-text exposure in local storage, URLs, or console logs.
 */

const STORAGE_KEY = '__totp_sec_store_v2__';
const SALT_KEY = '__totp_dev_salt__';

// Derive or retrieve device-specific key for AES-GCM
async function getEncryptionKey(): Promise<CryptoKey | null> {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    return null;
  }

  try {
    let saltHex = localStorage.getItem(SALT_KEY);
    if (!saltHex) {
      const saltBytes = new Uint8Array(16);
      window.crypto.getRandomValues(saltBytes);
      saltHex = Array.from(saltBytes).map(b => b.toString(16).padStart(2, '0')).join('');
      localStorage.setItem(SALT_KEY, saltHex);
    }

    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(`totp_secure_device_token_${saltHex}_v2`),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    const salt = new Uint8Array(saltHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));

    return await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  } catch {
    return null;
  }
}

// Lightweight obfuscation fallback if Web Crypto is restricted (e.g. older browser/sandbox)
function fallbackObfuscate(text: string): string {
  const enc = encodeURIComponent(text);
  let out = '';
  for (let i = 0; i < enc.length; i++) {
    out += String.fromCharCode(enc.charCodeAt(i) ^ 0x4f);
  }
  return btoa(out);
}

function fallbackDeobfuscate(encoded: string): string {
  try {
    const raw = atob(encoded);
    let out = '';
    for (let i = 0; i < raw.length; i++) {
      out += String.fromCharCode(raw.charCodeAt(i) ^ 0x4f);
    }
    return decodeURIComponent(out);
  } catch {
    return '';
  }
}

/**
 * Save user's Secret Key securely
 */
export async function saveSecretKey(rawSecret: string): Promise<boolean> {
  if (!rawSecret || typeof rawSecret !== 'string') return false;
  const clean = rawSecret.trim();
  if (!clean) return false;

  try {
    const cryptoKey = await getEncryptionKey();
    if (cryptoKey && window.crypto?.subtle) {
      const iv = new Uint8Array(12);
      window.crypto.getRandomValues(iv);
      const encoded = new TextEncoder().encode(clean);

      const cipherBuffer = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        encoded
      );

      const cipherBytes = new Uint8Array(cipherBuffer);
      const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
      const cipherHex = Array.from(cipherBytes).map(b => b.toString(16).padStart(2, '0')).join('');

      const payload = JSON.stringify({
        v: 2,
        mode: 'aes-gcm',
        iv: ivHex,
        data: cipherHex,
        updatedAt: Date.now(),
      });

      localStorage.setItem(STORAGE_KEY, payload);
      // Clean up any legacy unencrypted keys
      localStorage.removeItem('totp_active_secret');
      return true;
    } else {
      // Fallback obfuscation
      const obfuscated = fallbackObfuscate(clean);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        v: 2,
        mode: 'fallback',
        data: obfuscated,
        updatedAt: Date.now(),
      }));
      localStorage.removeItem('totp_active_secret');
      return true;
    }
  } catch {
    try {
      const obfuscated = fallbackObfuscate(clean);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        v: 2,
        mode: 'fallback',
        data: obfuscated,
        updatedAt: Date.now(),
      }));
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Retrieve user's Secret Key securely
 */
export async function getStoredSecretKey(): Promise<string | null> {
  try {
    const rawPayload = localStorage.getItem(STORAGE_KEY);
    if (!rawPayload) {
      // Check legacy key for migration
      const legacy = localStorage.getItem('totp_active_secret');
      if (legacy && legacy.trim()) {
        await saveSecretKey(legacy.trim());
        return legacy.trim();
      }
      return null;
    }

    const parsed = JSON.parse(rawPayload);
    if (parsed.mode === 'aes-gcm' && parsed.iv && parsed.data) {
      const cryptoKey = await getEncryptionKey();
      if (!cryptoKey || !window.crypto?.subtle) {
        return null;
      }

      const iv = new Uint8Array(parsed.iv.match(/.{1,2}/g)!.map((b: string) => parseInt(b, 16)));
      const cipherBytes = new Uint8Array(parsed.data.match(/.{1,2}/g)!.map((b: string) => parseInt(b, 16)));

      const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        cipherBytes
      );

      return new TextDecoder().decode(decryptedBuffer);
    } else if (parsed.mode === 'fallback' && parsed.data) {
      return fallbackDeobfuscate(parsed.data);
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Check if a Secret Key is configured
 */
export function hasStoredSecretKey(): boolean {
  try {
    return Boolean(localStorage.getItem(STORAGE_KEY) || localStorage.getItem('totp_active_secret'));
  } catch {
    return false;
  }
}

/**
 * Get masked version for UI (e.g. JBSW •••• •••• 3PXP)
 */
export async function getMaskedSecretKey(): Promise<string> {
  const secret = await getStoredSecretKey();
  if (!secret) return '';
  const clean = secret.replace(/[\s-_=]/g, '').toUpperCase();
  if (clean.length <= 8) {
    return clean.substring(0, 2) + '••••' + clean.slice(-2);
  }
  return clean.substring(0, 4) + ' •••• •••• ' + clean.slice(-4);
}

/**
 * Clear stored secret key
 */
export function clearStoredSecretKey(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('totp_active_secret');
  } catch {}
}
