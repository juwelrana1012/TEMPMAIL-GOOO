// ============================================================================
// TEMPORARY MAIL & REAL-TIME OTP EXTRACTION ENGINE (Node.js / Express)
// Domain: tempmailpro.io
// High-Precision 8-Digit Confirmation & Verification Code Detection
// ============================================================================

import express, { Request, Response } from 'express';
import { io as ioClient, Socket } from 'socket.io-client';
import axios from 'axios';

export interface StoredOtpMessage {
  id: string;
  recipient: string;
  sender: string;
  senderName: string;
  subject: string;
  bodyText: string;
  bodyHtml: string;
  receivedAt: string;
  otpCode: string | null;
  timestamp: number;
}

export const messagesStore: StoredOtpMessage[] = [];
export const activeAddresses = new Set<string>();
let proSocket: Socket | null = null;
export let isProSocketConnected = false;

function normalizeNumerals(input: string): string {
  if (!input) return '';
  const bengaliDigits: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
  };
  const arabicDigits: Record<string, string> = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
  };

  return input
    .replace(/[০-৯]/g, (d) => bengaliDigits[d] || d)
    .replace(/[٠-٩]/g, (d) => arabicDigits[d] || d);
}

// 1. Automatic High-Precision OTP & 8-Digit Confirmation Code Extractor
export function extractVerificationCode(
  text?: string,
  subject?: string,
  html?: string,
  recipientEmail?: string
): string | null {
  const directCandidate = (text || '').trim();
  const directNorm = normalizeNumerals(directCandidate);

  // If text is a standalone code
  if (!directCandidate.includes('@') && directCandidate.length >= 4 && directCandidate.length <= 15) {
    const pfx = directNorm.match(/^(?:G|FB|VK|TG|MS|ID)[-\s]?([0-9]{4,8})$/i);
    if (pfx && pfx[1]) return pfx[1];
    const stripped = directNorm.replace(/[\s\-_[\]().:]/g, '');
    if (/^[0-9]{4,8}$/.test(stripped)) {
      const n = parseInt(stripped, 10);
      if (!(stripped.length === 4 && n >= 2020 && n <= 2030)) return stripped;
    }
  }

  const cleanHtml = (html || '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');

  let combined = `${subject || ''}\n${text || ''}\n${cleanHtml}`;
  combined = normalizeNumerals(combined);

  // 1. CRITICAL SANITIZATION:
  // Strip recipient username and digits (e.g. user84920193@tempmailpro.io)
  // so usernames with 6-8 digits are NEVER mistaken for an OTP/confirmation code!
  if (recipientEmail) {
    const userPart = recipientEmail.split('@')[0] || '';
    if (userPart.length >= 3) {
      combined = combined.split(userPart).join(' [RECIPIENT_USER] ');
    }
    const userDigits = userPart.replace(/\D/g, '');
    if (userDigits.length >= 4) {
      combined = combined.split(userDigits).join(' [USER_NUM] ');
    }
  }

  // Also strip any other email username numbers found in the text
  const emailUserMatches = [...combined.matchAll(/([a-zA-Z0-9._%+-]+)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)];
  for (const em of emailUserMatches) {
    const uDigits = em[1].replace(/\D/g, '');
    if (uDigits.length >= 4) {
      combined = combined.split(uDigits).join(' [EMAIL_USER_NUM] ');
    }
  }

  // Strip all emails
  combined = combined.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, ' [EMAIL] ');

  // Strip all URLs
  combined = combined.replace(/https?:\/\/[^\s"'<>]+/gi, ' [URL] ');

  // Strip corporate zip codes
  combined = combined.replace(/\b(?:98052|94025|94043|90210|10001)\b/g, ' ');

  // Strip reference IDs, tracking IDs, order numbers, case numbers, account IDs, Facebook IDs, etc.
  combined = combined.replace(/(?:facebook\s*id|fb\s*id|user\s*id|account\s*id|client\s*id|device\s*id|session\s*id|login\s*id|post\s*id|message\s*id|\bid)[\s:#*-]+[0-9]{4,20}/gi, ' [ID_STRIPPED] ');
  combined = combined.replace(/(?:ref(?:erence)?|tracking|case|ticket|order|invoice)[\s:#*-]+[0-9]{4,20}/gi, ' [REF_ID] ');

  const cleanVal = (v: string) => (v || '').replace(/[\s\-_[\]().:]/g, '');

  // 2. Prefixed codes: FB-84920193, G-84920193, MS-84920193, TG-12345 (Exclude ID to prevent matching user/account IDs)
  const prefixMatch = combined.match(/\b(?:FB|G|VK|TG|MS|IG|DC|EA)[-\s]?([0-9]{4}[\s-]?[0-9]{4}|[0-9]{3}[\s-]?[0-9]{3}|[0-9]{4,8})\b/i);
  if (prefixMatch && prefixMatch[1]) {
    const cleaned = cleanVal(prefixMatch[1]);
    if (cleaned.length >= 4 && cleaned.length <= 8) return cleaned;
  }

  // 3. Subject Line Inspection
  if (subject) {
    const sClean = normalizeNumerals(subject)
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, ' ')
      .replace(/https?:\/\/[^\s"'<>]+/gi, ' ')
      .replace(/(?:facebook\s*id|user\s*id|account\s*id|\bid)[\s:#*-]+[0-9]{4,20}/gi, ' ');

    const sPrefix = sClean.match(/\b(?:FB|G|VK|TG|MS|IG|DC|EA)[-\s]?([0-9]{4}[\s-]?[0-9]{4}|[0-9]{3}[\s-]?[0-9]{3}|[0-9]{4,8})\b/i);
    if (sPrefix && sPrefix[1]) {
      const c = cleanVal(sPrefix[1]);
      if (c.length >= 4 && c.length <= 8) return c;
    }

    const sExplicit = sClean.match(
      /(?:(?:8[\s-]?(?:digit|ডিজিট)|eight[\s-]?digit)?\s*(?:confirmation|verification|security|recovery|single-use|one-time|identity|access|login|facebook|microsoft|কনফার্মেশন|ভেরিফিকেশন|নিরাপত্তা|রিকভারি|লগইন)[\s\w-]{0,35}?(?:code|otp|passcode|pin|কোড|ওটিপি|পিন)[\s:—–=is#*হলো-]+|(?:use|enter|type|input)\s+[^:0-9\n\r]{0,35}?(?:code|confirm|verify)[\s:—–=is#*-]+)([0-9]{4}[\s-]?[0-9]{4}|[0-9]{3}[\s-]?[0-9]{3}|[0-9]{4,8})\b/i
    );
    if (sExplicit && sExplicit[1]) {
      const c = cleanVal(sExplicit[1]);
      if (c.length >= 4 && c.length <= 8) return c;
    }

    const sRev = sClean.match(
      /\b([0-9]{4}[\s-]?[0-9]{4}|[0-9]{3}[\s-]?[0-9]{3}|[0-9]{4,8})\b[\s\r\n]+(?:is\s+your|to\s+confirm|to\s+verify|to\s+reset|to\s+recover|for\s+recovery|for\s+verification|is\s+the\s+code|হলো\s+আপনার|কোডটি\s+ব্যবহার|-)/i
    );
    if (sRev && sRev[1]) {
      const c = cleanVal(sRev[1]);
      if (c.length >= 4 && c.length <= 8) return c;
    }

    const sGeneric = sClean.match(/(?:code|otp|কোড|ওটিপি)[\s:—–=is#*-]+([0-9]{4}[\s-]?[0-9]{4}|[0-9]{3}[\s-]?[0-9]{3}|[0-9]{4,8})\b/i);
    if (sGeneric && sGeneric[1]) {
      const c = cleanVal(sGeneric[1]);
      if (c.length >= 4 && c.length <= 8) return c;
    }
  }

  // 4. Dedicated High-Priority Confirmation & Security Patterns (Allows newlines & spaced 8-digit codes)
  const highPriorityPatterns = [
    /(?:(?:8[\s-]?(?:digit|ডিজিট)|eight[\s-]?digit)?\s*(?:confirmation|verification|security|recovery|single-use|one-time|identity|access|login|facebook|microsoft|কনফার্মেশন|ভেরিফিকেশন|নিরাপত্তা|রিকভারি|লগইন)[\s\w-]{0,35}?(?:code|otp|passcode|pin|কোড|ওটিপি|পিন)[\s\r\n:—–=is#*হলো-]+)([0-9]{4}[\s-]?[0-9]{4}|[0-9]{3}[\s-]?[0-9]{3}|[0-9]{4,8})\b/i,
    /(?:(?:use|enter|type|input)\s+[^:0-9\n\r]{0,35}?(?:code|confirm|verify)[\s\r\n:—–=is#*-]+)([0-9]{4}[\s-]?[0-9]{4}|[0-9]{3}[\s-]?[0-9]{3}|[0-9]{4,8})\b/i,
    /(?:code\s+(?:for|to|is|in)\s+[^:0-9\n\r]{1,40})[\s\r\n:—–=is#*-]+([0-9]{4}[\s-]?[0-9]{4}|[0-9]{3}[\s-]?[0-9]{3}|[0-9]{4,8})\b/i,
    /(?:your|the)\s+(?:single-use\s+|one-time\s+|8-digit\s+|eight-digit\s+)?(?:code|otp|passcode|pin)[\s\r\n:—–=is#*-]+([0-9]{4}[\s-]?[0-9]{4}|[0-9]{3}[\s-]?[0-9]{3}|[0-9]{4,8})\b/i,
    /\b([0-9]{4}[\s-]?[0-9]{4}|[0-9]{3}[\s-]?[0-9]{3}|[0-9]{4,8})\b[\s\r\n]+(?:is\s+your|to\s+confirm|to\s+verify|to\s+reset|to\s+recover|for\s+recovery|for\s+verification|is\s+the\s+code|হলো\s+আপনার|কোডটি\s+ব্যবহার)/i,
  ];

  for (const pattern of highPriorityPatterns) {
    const m = combined.match(pattern);
    if (m && m[1]) {
      const cleaned = cleanVal(m[1]);
      if (cleaned.length >= 4 && cleaned.length <= 8) return cleaned;
    }
  }

  // 5. HTML tags
  const htmlTagMatch =
    (html || '').match(
      /<(?:b|strong|h[1-4]|span|div|td)[^>]*class=["'][^"']*(?:code|otp|token|verify|recovery|confirm)[^"']*["'][^>]*>\s*([0-9]{4}[\s-]?[0-9]{4}|[0-9]{3}[\s-]?[0-9]{3}|[0-9]{4,8})\s*<\/(?:b|strong|h[1-4]|span|div|td)>/i
    ) ||
    (html || '').match(
      /<(?:b|strong|h[1-4]|div|span|td)[^>]*style=["'][^"']*(?:font-size:\s*(?:2[0-9]|3[0-9]|4[0-9])px|letter-spacing)[^"']*["'][^>]*>\s*([0-9]{4}[\s-]?[0-9]{4}|[0-9]{3}[\s-]?[0-9]{3}|[0-9]{4,8})\s*<\/(?:b|strong|h[1-4]|div|span|td)>/i
    ) ||
    (html || '').match(
      /<(?:b|strong|h[1-4])[^>]*>\s*([0-9]{4}[\s-]?[0-9]{4}|[0-9]{3}[\s-]?[0-9]{3}|[0-9]{5,8})\s*<\/(?:b|strong|h[1-4])>/i
    );
  if (htmlTagMatch && htmlTagMatch[1]) {
    const val = cleanVal(htmlTagMatch[1]);
    if (val.length >= 4 && val.length <= 8) return val;
  }

  // 6. Standalone line with 5-8 digits
  const lines = combined.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = cleanVal(line.trim());
    if (/^[0-9]{5,8}$/.test(trimmed)) {
      if (!(trimmed.length === 8 && (trimmed.startsWith('202') || trimmed.startsWith('201') || trimmed.startsWith('199')))) {
        return trimmed;
      }
    }
  }

  // 7. Spaced 8-digit OTP (e.g. 8492 0193)
  const genSpaced = combined.match(/\b([0-9]{4})[\s-]([0-9]{4})\b/);
  if (genSpaced && genSpaced[1] && genSpaced[2]) {
    const joined = `${genSpaced[1]}${genSpaced[2]}`;
    if (!joined.startsWith('202') && !joined.startsWith('199')) {
      return joined;
    }
  }

  // 8. Intelligent token scoring across all 4-8 digit numbers
  const allMatches = [...combined.matchAll(/\b([0-9]{4,8})\b/g)];
  let bestCandidate: string | null = null;
  let bestScore = -1;

  for (const match of allMatches) {
    const val = match[1];
    const index = match.index ?? 0;
    const num = parseInt(val, 10);

    if (val.length === 4 && num >= 2020 && num <= 2030) continue;
    if (val.length === 8 && (val.startsWith('202') || val.startsWith('201') || val.startsWith('199'))) {
      const month = parseInt(val.substring(4, 6), 10);
      const day = parseInt(val.substring(6, 8), 10);
      if (month >= 1 && month <= 12 && day >= 1 && day <= 31) continue;
    }

    const surrounding = combined
      .substring(Math.max(0, index - 40), Math.min(combined.length, index + 50))
      .toLowerCase();
    if (
      surrounding.includes(':') &&
      (surrounding.includes('am') || surrounding.includes('pm') || /:\d\d:/.test(surrounding))
    ) {
      continue;
    }

    let score = 0;
    if (val.length === 8) score += 40;
    else if (val.length === 6) score += 25;
    else if (val.length === 5) score += 15;
    else score += 8;

    if (/confirmation|security|recovery|verify|confirm|microsoft|facebook|single-use|code|otp|কোড|ওটিপি/.test(surrounding)) {
      score += 45;
    }

    if (score > bestScore) {
      bestScore = score;
      bestCandidate = val;
    }
  }

  return bestCandidate;
}

// 2. Incoming email processing
export async function processIncomingEmail(item: any, fallbackRecipient: string = ''): Promise<void> {
  if (!item) return;
  const emailId = String(item._id || item.id || Date.now());
  const recipient = (item.recipient || item.to || fallbackRecipient || '').toLowerCase().trim();
  if (!recipient) return;

  const subject = item.subject || '(No Subject)';
  let bodyText = item.text || item.textPreview || item.body || '';
  let bodyHtml = item.html || `<p>${bodyText}</p>`;

  // If text is truncated or missing, fetch full email detail from tempmailpro.io
  if ((!bodyText || bodyText.length < 50) && item._id && recipient.includes('tempmailpro.io')) {
    try {
      const fullRes = await axios.get(
        `https://tempmailpro.io/api/emails/guest/${encodeURIComponent(recipient)}/${item._id}`,
        {
          timeout: 4000,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        }
      );
      if (fullRes.data) {
        bodyText = fullRes.data.text || fullRes.data.body || bodyText;
        bodyHtml = fullRes.data.html || bodyHtml;
      }
    } catch {}
  }

  // Pass recipient so usernames/account digits are stripped!
  const otpCode = extractVerificationCode(bodyText, subject, bodyHtml, recipient) || item.otpCode || null;

  const timestamp = typeof item.timestamp === 'number' && !isNaN(item.timestamp) && item.timestamp > 0
    ? item.timestamp
    : (item.createdAt || item.date ? Date.parse(item.createdAt || item.date) : 0) || Date.now();

  const newMsg: StoredOtpMessage = {
    id: emailId,
    recipient,
    sender: item.from || item.sender || 'noreply@service.com',
    senderName: item.fromName || (item.from || '').split('@')[0] || 'Service',
    subject,
    bodyText,
    bodyHtml,
    receivedAt: item.createdAt || item.date || new Date().toISOString(),
    otpCode: otpCode || null,
    timestamp,
  };

  const existingIdx = messagesStore.findIndex((m) => m.id === emailId);
  if (existingIdx !== -1) {
    messagesStore[existingIdx] = newMsg;
  } else {
    messagesStore.unshift(newMsg);
  }

  if (messagesStore.length > 500) {
    messagesStore.length = 500;
  }
}

// 3. Live socket connection (tempmailpro.io)
export function initLiveSocket(): void {
  try {
    proSocket = ioClient('https://tempmailpro.io', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 2500,
      timeout: 10000,
    });

    proSocket.on('connect', () => {
      isProSocketConnected = true;
      for (const addr of activeAddresses) {
        proSocket?.emit('join_room', addr.toLowerCase());
      }
    });

    proSocket.on('join_denied', async (data: any) => {
      const reason = data?.reason || 'UNKNOWN';
      if (reason === 'NO_SESSION') {
        for (const addr of activeAddresses) {
          try {
            await axios.post(
              'https://tempmailpro.io/api/emails/activate-session',
              { address: addr },
              { timeout: 4000 }
            );
            proSocket?.emit('join_room', addr);
          } catch {}
        }
      }
    });

    proSocket.on('new_email', async (rawEmail: any) => {
      if (rawEmail) {
        await processIncomingEmail(rawEmail);
      }
    });

    proSocket.on('disconnect', () => {
      isProSocketConnected = false;
    });

    proSocket.on('connect_error', () => {
      isProSocketConnected = false;
    });
  } catch (err) {
    console.error('Socket init error:', err);
  }
}

// Initialize socket immediately
initLiveSocket();

// 4. Mail session activation & robust polling engine
const sessionActivatedAt = new Map<string, number>();
const lastFetchAt = new Map<string, number>();

export async function ensureMailSessionActive(cleanAddr: string, force = false): Promise<void> {
  const lastActive = sessionActivatedAt.get(cleanAddr) || 0;
  // Session activation on tempmailpro.io is valid for at least 5 minutes.
  // Avoid calling activate-session more than once every 3 minutes unless force=true (SESSION_EXPIRED)
  if (!force && Date.now() - lastActive < 180000) {
    return;
  }
  try {
    const actRes = await axios.post(
      'https://tempmailpro.io/api/emails/activate-session',
      { address: cleanAddr },
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        timeout: 4000,
        validateStatus: () => true,
      }
    );
    if (actRes.status === 200 || actRes.data?.success) {
      sessionActivatedAt.set(cleanAddr, Date.now());
    }
  } catch {}
}

export async function activateMailSession(address: string): Promise<void> {
  if (!address || !address.toLowerCase().includes('tempmailpro.io')) return;
  const cleanAddr = address.toLowerCase().trim();

  activeAddresses.add(cleanAddr);

  if (proSocket && isProSocketConnected) {
    proSocket.emit('join_room', cleanAddr);
  }

  // Ensure session is activated with tempmailpro.io
  await ensureMailSessionActive(cleanAddr);

  // Debounce guest fetching to 1 second so rapid calls don't hammer, but never block 2.5s or 60s
  const lastFetch = lastFetchAt.get(cleanAddr) || 0;
  if (Date.now() - lastFetch < 1000) {
    return;
  }
  lastFetchAt.set(cleanAddr, Date.now());

  try {
    let res = await axios.get(
      `https://tempmailpro.io/api/emails/guest/${encodeURIComponent(cleanAddr)}`,
      {
        timeout: 5000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        validateStatus: () => true,
      }
    );

    // If session expired, re-activate session immediately and retry once
    if (res.data && res.data.error === 'SESSION_EXPIRED') {
      await ensureMailSessionActive(cleanAddr, true);
      res = await axios.get(
        `https://tempmailpro.io/api/emails/guest/${encodeURIComponent(cleanAddr)}`,
        { timeout: 5000 }
      );
    }

    if (res.status === 200 && Array.isArray(res.data)) {
      for (const item of res.data) {
        // Fetch full email content if needed
        let fullItem = item;
        if (item._id && (!item.text || item.text.length < 50)) {
          try {
            const detailRes = await axios.get(
              `https://tempmailpro.io/api/emails/guest/${encodeURIComponent(cleanAddr)}/${item._id}`,
              { timeout: 4000 }
            );
            if (detailRes.data) {
              fullItem = { ...item, ...detailRes.data };
            }
          } catch {}
        }
        await processIncomingEmail(fullItem, cleanAddr);
      }
    }
  } catch {
    // Socket will handle live incoming mail
  }
}

// ============================================================================
// 5. Main Endpoint: /api/otp (Direct code retrieval)
// ============================================================================
export const tempMailProRouter = express.Router();

export function getCombinedEmailsForAddress(address: string): StoredOtpMessage[] {
  const cleanAddr = address.toLowerCase().trim();
  const list: StoredOtpMessage[] = [...messagesStore.filter((m) => m.recipient.toLowerCase().trim() === cleanAddr)];

  const localMap: Map<string, any> | undefined = (global as any).LOCAL_INBOXES;
  if (localMap) {
    const directMsgs = localMap.get(cleanAddr) || [];
    const userOnly = cleanAddr.split('@')[0].replace(/[^a-z0-9]/g, '');
    const companionEmail = `${userOnly}@mailto.plus`;
    const companionMsgs = localMap.get(companionEmail) || [];
    const allLocal = [...directMsgs, ...companionMsgs];

    for (const item of allLocal) {
      if (!list.some((m) => m.id === String(item.id))) {
        const itemTime = typeof item.timestamp === 'number' && !isNaN(item.timestamp)
          ? item.timestamp
          : (item.receivedAt ? Date.parse(item.receivedAt) : 0) || Date.now();

        list.push({
          id: String(item.id || Math.random()),
          recipient: cleanAddr,
          sender: item.fromEmail || item.sender || 'noreply@service.com',
          senderName: item.sender || (item.fromEmail || '').split('@')[0] || 'Service',
          subject: item.subject || '(No Subject)',
          bodyText: item.body || '',
          bodyHtml: item.html || `<p>${item.body || ''}</p>`,
          receivedAt: item.receivedAt || new Date().toISOString(),
          otpCode: extractVerificationCode(item.body, item.subject, item.html, cleanAddr) || item.verificationCode || null,
          timestamp: itemTime,
        });
      }
    }
  }

  // Sort strictly by newest chronological timestamp first (guaranteed no NaN)
  list.sort((a, b) => {
    const tA = typeof a.timestamp === 'number' && !isNaN(a.timestamp) ? a.timestamp : 0;
    const tB = typeof b.timestamp === 'number' && !isNaN(b.timestamp) ? b.timestamp : 0;
    if (tA !== tB) return tB - tA;
    return String(b.id || '').localeCompare(String(a.id || ''));
  });

  return list;
}

tempMailProRouter.get('/api/otp', async (req: Request, res: Response) => {
  const address = (String(req.query.address || '')).toLowerCase().trim();
  if (!address) {
    return res.status(400).json({
      success: false,
      error: 'Address is required. e.g. /api/otp?address=user@tempmailpro.io',
    });
  }

  await activateMailSession(address);

  // Search messages for matching email
  const emails = getCombinedEmailsForAddress(address);
  // Pick the verification code from the MOST RECENT email
  const messageWithOtp = emails.find((m) => Boolean(m.otpCode)) || emails[0];

  return res.json({
    success: true,
    domain: 'tempmailpro.io',
    address,
    hasCode: Boolean(messageWithOtp?.otpCode),
    code: messageWithOtp?.otpCode || null,
    sender: messageWithOtp?.senderName || messageWithOtp?.sender || null,
    subject: messageWithOtp?.subject || null,
    receivedAt: messageWithOtp?.receivedAt || null,
    totalEmails: emails.length,
  });
});

// Endpoint to retrieve OTP code as plain text
tempMailProRouter.get('/api/otp/text', async (req: Request, res: Response) => {
  const address = (String(req.query.address || '')).toLowerCase().trim();
  if (!address) return res.send('');

  await activateMailSession(address);

  const emails = getCombinedEmailsForAddress(address);
  const msg = emails.find((m) => Boolean(m.otpCode));
  return res.type('text/plain').send(msg?.otpCode || '');
});

export default tempMailProRouter;
