/**
 * Universal Vercel Serverless Function: POST /api/tempmail/replacement-code
 * Self-contained recovery & replacement code retrieval with 8-digit precision
 */

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

function extractSmartOtpCode(
  subject = '',
  text = '',
  html = '',
  recipientEmail = ''
): string | null {
  const directCandidate = (text || '').trim();
  const directNormalized = normalizeNumerals(directCandidate);

  const isDirectEmail = directCandidate.includes('@') && !directCandidate.includes(' ');
  if (!isDirectEmail && directCandidate.length >= 4 && directCandidate.length <= 15) {
    const directPrefixMatch = directNormalized.match(/^(?:G|FB|VK|TG|MS|ID)[-\s]?([0-9]{4,8})$/i);
    if (directPrefixMatch && directPrefixMatch[1]) {
      return directPrefixMatch[1];
    }

    const strippedOnlyDigits = directNormalized.replace(/[\s\-_[\]().:]/g, '');
    if (/^[0-9]{4,8}$/.test(strippedOnlyDigits)) {
      const num = parseInt(strippedOnlyDigits, 10);
      if (!(strippedOnlyDigits.length === 4 && num >= 2020 && num <= 2030)) {
        return strippedOnlyDigits;
      }
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

  const emailUserMatches = [...combined.matchAll(/([a-zA-Z0-9._%+-]+)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)];
  for (const em of emailUserMatches) {
    const uDigits = em[1].replace(/\D/g, '');
    if (uDigits.length >= 4) {
      combined = combined.split(uDigits).join(' [EMAIL_USER_NUM] ');
    }
  }

  combined = combined.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, ' [EMAIL] ');
  combined = combined.replace(/https?:\/\/[^\s"'<>]+/gi, ' [URL] ');
  combined = combined.replace(/\b(?:98052|94025|94043|90210|10001)\b/g, ' ');
  combined = combined.replace(/(?:ref(?:erence)?|tracking|case|ticket|order|invoice|account\s*id|user\s*id|client\s*id)[\s:#*-]+[0-9]{4,15}/gi, ' [REF_ID] ');

  const cleanVal = (v: string) => (v || '').replace(/[\s\-_[\]().:]/g, '');

  const prefixMatch = combined.match(/\b(?:FB|G|VK|TG|MS|ID|IG)[-\s]?([0-9]{4}[\s-]?[0-9]{4}|[0-9]{3}[\s-]?[0-9]{3}|[0-9]{4,8})\b/i);
  if (prefixMatch && prefixMatch[1]) {
    const cleaned = cleanVal(prefixMatch[1]);
    if (cleaned.length >= 4 && cleaned.length <= 8) return cleaned;
  }

  if (subject) {
    const sClean = normalizeNumerals(subject)
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, ' ')
      .replace(/https?:\/\/[^\s"'<>]+/gi, ' ');

    const sPrefix = sClean.match(/\b(?:FB|G|VK|TG|MS|ID|IG)[-\s]?([0-9]{4}[\s-]?[0-9]{4}|[0-9]{3}[\s-]?[0-9]{3}|[0-9]{4,8})\b/i);
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
      if (cleaned.length >= 4 && cleaned.length <= 8) {
        return cleaned;
      }
    }
  }

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
    if (val.length >= 4 && val.length <= 8) {
      return val;
    }
  }

  const lines = combined.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = cleanVal(line.trim());
    if (/^[0-9]{5,8}$/.test(trimmed)) {
      if (!(trimmed.length === 8 && (trimmed.startsWith('202') || trimmed.startsWith('201') || trimmed.startsWith('199')))) {
        return trimmed;
      }
    }
  }

  const genSpaced = combined.match(/\b([0-9]{4})[\s-]([0-9]{4})\b/);
  if (genSpaced && genSpaced[1] && genSpaced[2]) {
    const joined = `${genSpaced[1]}${genSpaced[2]}`;
    if (!joined.startsWith('202') && !joined.startsWith('199')) {
      return joined;
    }
  }

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

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const rawEmail = (req.body?.email || req.body?.address || req.query?.email || '') as string;
    if (!rawEmail || !rawEmail.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid email address is required' });
    }

    const email = rawEmail.trim().toLowerCase();
    const [userPart, domainPart] = email.split('@');
    const cleanUser = userPart.replace(/[^a-z0-9]/g, '');
    const companionEmail = `${cleanUser}@mailto.plus`;

    const allFoundMessages: any[] = [];

    // 1. If tempmailpro.io, query tempmailpro.io
    if (domainPart === 'tempmailpro.io' || email.includes('tempmailpro.io')) {
      try {
        await fetch('https://tempmailpro.io/api/emails/activate-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: email }),
          signal: AbortSignal.timeout(4000),
        });

        const proRes = await fetch(`https://tempmailpro.io/api/emails/guest/${encodeURIComponent(email)}`, {
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(5000),
        });

        if (proRes.ok) {
          const proData = await proRes.json();
          if (Array.isArray(proData)) {
            for (const item of proData) {
              let textBody = item.text || item.textPreview || item.body || '';
              let htmlBody = item.html || '';

              if (item._id && (!textBody || textBody.length < 50)) {
                try {
                  const detailRes = await fetch(`https://tempmailpro.io/api/emails/guest/${encodeURIComponent(email)}/${item._id}`, {
                    headers: { 'Accept': 'application/json' },
                    signal: AbortSignal.timeout(4000),
                  });
                  if (detailRes.ok) {
                    const detail = await detailRes.json();
                    textBody = detail.text || detail.body || textBody;
                    htmlBody = detail.html || htmlBody;
                  }
                } catch {}
              }

              const code = extractSmartOtpCode(item.subject || '', textBody, htmlBody, email);
              allFoundMessages.push({
                id: String(item._id || item.id || Math.random()),
                sender: item.fromName || (item.from || '').split('@')[0] || 'Service',
                fromEmail: item.from || 'noreply@service.com',
                subject: item.subject || 'Verification Email',
                snippet: (textBody || item.subject || '').substring(0, 140),
                receivedAt: item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : 'Just now',
                verificationCode: code,
                body: textBody || htmlBody || '',
                timestamp: item.createdAt ? Date.parse(item.createdAt) : Date.now(),
              });
            }
          }
        }
      } catch (err: any) {
        console.warn('TempMailPro recovery fetch warning:', err?.message);
      }
    }

    // 2. Check Temp Mail Plus
    const targets = new Set<string>([email]);
    if (domainPart !== 'mailto.plus') {
      targets.add(companionEmail);
    }

    for (const targetMail of targets) {
      try {
        const url = `https://tempmail.plus/api/mails?email=${encodeURIComponent(targetMail)}&limit=20&epin=`;
        const resp = await fetch(url, {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
          signal: AbortSignal.timeout(6000),
        });

        if (resp.ok) {
          const data = await resp.json();
          const list = data?.mail_list || [];

          for (const item of list) {
            let textBody = '';
            let htmlBody = '';

            if (item.mail_id) {
              try {
                const detailUrl = `https://tempmail.plus/api/mails/${item.mail_id}?email=${encodeURIComponent(targetMail)}&epin=`;
                const detailResp = await fetch(detailUrl, {
                  headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                  },
                  signal: AbortSignal.timeout(4000),
                });
                if (detailResp.ok) {
                  const detail = await detailResp.json();
                  textBody = detail.text || '';
                  htmlBody = detail.html || '';
                }
              } catch {}
            }

            const extractedCode = extractSmartOtpCode(item.subject || '', textBody, htmlBody, email);
            const itemId = String(item.mail_id || Math.random());
            if (!allFoundMessages.some((m) => m.id === itemId)) {
              allFoundMessages.push({
                id: itemId,
                sender: item.from_name || (item.from_mail ? item.from_mail.split('@')[0] : 'Sender'),
                fromEmail: item.from_mail || '',
                subject: item.subject || '(No Subject)',
                snippet: (textBody || item.text || item.subject || '').substring(0, 140),
                receivedAt: item.time || 'Just now',
                verificationCode: extractedCode,
                body: textBody || htmlBody || '',
                timestamp: item.time ? Date.parse(item.time) : Date.now(),
              });
            }
          }
        }
      } catch (err: any) {
        console.warn('Temp Mail Plus recovery fetch warning:', err?.message);
      }
    }

    if (allFoundMessages.length === 0) {
      return res.json({
        success: false,
        error: 'No emails found in this mailbox yet. Ensure the verification code was dispatched to this address.',
        messageCount: 0,
      });
    }

    // Sort newest first
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

    allFoundMessages.sort((a, b) => {
      const diff = getSafeTime(b) - getSafeTime(a);
      if (!isNaN(diff) && diff !== 0) return diff;
      return String(b.id || '').localeCompare(String(a.id || ''));
    });

    // Find message containing real verification code
    const messageWithCode = allFoundMessages.find((m) => m.verificationCode);

    if (!messageWithCode || !messageWithCode.verificationCode) {
      return res.json({
        success: false,
        error: `Found ${allFoundMessages.length} message(s), but no verification code was detected inside the email content.`,
        messageCount: allFoundMessages.length,
      });
    }

    return res.json({
      success: true,
      email,
      latestCode: messageWithCode.verificationCode,
      sender: messageWithCode.sender,
      subject: messageWithCode.subject,
      receivedAt: messageWithCode.receivedAt,
      messageCount: allFoundMessages.length,
    });
  } catch (err: any) {
    console.error('Error in recovery/replacement-code:', err);
    return res.status(500).json({ success: false, error: err?.message || 'Recovery failed' });
  }
}
