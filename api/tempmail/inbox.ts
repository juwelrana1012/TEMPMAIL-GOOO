/**
 * Universal Vercel Serverless Function: GET /api/tempmail/inbox
 * Completely self-contained with zero external file dependencies.
 * Guaranteed 100% Vercel production compatibility without ERR_MODULE_NOT_FOUND.
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

  // Strip recipient username and digits
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

  // Strip email usernames
  const emailUserMatches = [...combined.matchAll(/([a-zA-Z0-9._%+-]+)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)];
  for (const em of emailUserMatches) {
    const uDigits = em[1].replace(/\D/g, '');
    if (uDigits.length >= 4) {
      combined = combined.split(uDigits).join(' [EMAIL_USER_NUM] ');
    }
  }

  combined = combined.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, ' [EMAIL] ');
  combined = combined.replace(/https?:\/\/[^\s"'<>]+/gi, ' [URL] ');
  // Strip reference IDs, tracking IDs, order numbers, case numbers, account IDs, Facebook IDs, etc.
  combined = combined.replace(/(?:facebook\s*id|fb\s*id|user\s*id|account\s*id|client\s*id|device\s*id|session\s*id|login\s*id|post\s*id|message\s*id|\bid)[\s:#*-]+[0-9]{4,20}/gi, ' [ID_STRIPPED] ');
  combined = combined.replace(/(?:ref(?:erence)?|tracking|case|ticket|order|invoice)[\s:#*-]+[0-9]{4,20}/gi, ' [REF_ID] ');

  const cleanVal = (v: string) => (v || '').replace(/[\s\-_[\]().:]/g, '');

  const prefixMatch = combined.match(/\b(?:FB|G|VK|TG|MS|IG|DC|EA)[-\s]?([0-9]{4}[\s-]?[0-9]{4}|[0-9]{3}[\s-]?[0-9]{3}|[0-9]{4,8})\b/i);
  if (prefixMatch && prefixMatch[1]) {
    const cleaned = cleanVal(prefixMatch[1]);
    if (cleaned.length >= 4 && cleaned.length <= 8) return cleaned;
  }

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
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const rawEmail = (req.query?.email || req.body?.email || '') as string;
    const provider = (req.query?.provider || req.body?.provider || '') as string;

    if (!rawEmail || !rawEmail.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid email address required' });
    }

    const email = rawEmail.trim().toLowerCase();
    const [userPart, domainPart] = email.split('@');
    const cleanUser = userPart.replace(/[^a-z0-9]/g, '');

    const messages: any[] = [];
    let latestCode: string | null = null;

    // 1. If domain is tempmailpro.io, query tempmailpro.io directly
    if (domainPart === 'tempmailpro.io' || provider === 'TempMailPro' || email.includes('tempmailpro.io')) {
      try {
        const lastActivated = (global as any).PRO_INBOX_ACTIVATED?.get(email) || 0;
        if (Date.now() - lastActivated > 180000) {
          try {
            await fetch('https://tempmailpro.io/api/emails/activate-session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ address: email }),
              signal: AbortSignal.timeout(4000),
            });
            if (!(global as any).PRO_INBOX_ACTIVATED) (global as any).PRO_INBOX_ACTIVATED = new Map<string, number>();
            (global as any).PRO_INBOX_ACTIVATED.set(email, Date.now());
          } catch {}
        }

        let proRes = await fetch(`https://tempmailpro.io/api/emails/guest/${encodeURIComponent(email)}`, {
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(5000),
        });

        // Re-activate if session expired
        if (proRes.status === 200) {
          const clone = proRes.clone();
          const testBody = await clone.json().catch(() => null);
          if (testBody && testBody.error === 'SESSION_EXPIRED') {
            await fetch('https://tempmailpro.io/api/emails/activate-session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ address: email }),
              signal: AbortSignal.timeout(4000),
            });
            proRes = await fetch(`https://tempmailpro.io/api/emails/guest/${encodeURIComponent(email)}`, {
              headers: { 'Accept': 'application/json' },
              signal: AbortSignal.timeout(5000),
            });
          }
        }

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
              const senderName = item.fromName || (item.from || '').split('@')[0] || 'Service';
              const timestamp = item.createdAt ? Date.parse(item.createdAt) : Date.now();

              messages.push({
                id: String(item._id || item.id || Math.random()),
                sender: senderName,
                senderAvatar: senderName.charAt(0).toUpperCase() || 'P',
                fromEmail: item.from || 'noreply@service.com',
                subject: item.subject || 'Verification Email',
                snippet: (textBody || item.subject || '').substring(0, 140),
                receivedAt: item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : 'Just now',
                verificationCode: code,
                body: textBody || htmlBody || '',
                isRead: false,
                timestamp,
              });
            }
          }
        }
      } catch (err: any) {
        console.warn('Vercel TempMailPro fetch warning:', err?.message);
      }
    }

    // 2. Check Temp Mail Plus inboxes in parallel
    const tempMailTargets = new Set<string>();
    tempMailTargets.add(email);
    if (cleanUser && domainPart !== 'mailto.plus') {
      tempMailTargets.add(`${cleanUser}@mailto.plus`);
    }

    const tempMailPromises = Array.from(tempMailTargets).map(async (targetMail) => {
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

            const code = extractSmartOtpCode(
              item.subject || '',
              textBody || item.text || item.snippet || '',
              htmlBody || item.html || '',
              email
            );

            const senderName = item.from_name || (item.from_mail ? item.from_mail.split('@')[0] : 'Sender');
            const senderEmail = item.from_mail || '';
            const timestamp = item.time ? Date.parse(item.time) : Date.now();

            messages.push({
              id: String(item.mail_id || Math.random()),
              sender: senderName,
              senderAvatar: senderName.charAt(0).toUpperCase() || 'M',
              fromEmail: senderEmail,
              subject: item.subject || 'Verification Email',
              snippet: (textBody || item.snippet || item.subject || '').substring(0, 140),
              receivedAt: item.time || 'Just now',
              verificationCode: code,
              body: textBody || htmlBody || item.subject || '',
              isRead: false,
              timestamp,
            });
          }
        }
      } catch (err: any) {
        console.warn('TempMailPlus fetch warning in Vercel handler:', err?.message);
      }
    });

    // 3. Check Guerrilla Mail in parallel
    const guerrillaPromise = (async () => {
      try {
        const initResp = await fetch('https://api.guerrillamail.com/ajax.php?f=get_email_address', {
          signal: AbortSignal.timeout(5000),
        });
        if (!initResp.ok) return;

        const initData = await initResp.json();
        const sid = initData?.sid_token;
        if (!sid) return;

        await fetch(
          `https://api.guerrillamail.com/ajax.php?f=set_email_user&email_user=${encodeURIComponent(cleanUser)}&sid_token=${sid}&lang=en`,
          { signal: AbortSignal.timeout(5000) }
        );

        const checkResp = await fetch(
          `https://api.guerrillamail.com/ajax.php?f=check_email&seq=0&sid_token=${sid}`,
          { signal: AbortSignal.timeout(5000) }
        );

        if (checkResp.ok) {
          const checkData = await checkResp.json();
          const gList = checkData?.list || [];

          for (const item of gList) {
            const isGuerrillaSystemMail =
              item.mail_from === 'no-reply@guerrillamail.com' ||
              (item.mail_from && item.mail_from.toLowerCase().includes('guerrillamail')) ||
              (item.mail_subject && item.mail_subject.toLowerCase().includes('welcome to guerrilla')) ||
              item.mail_id === 1 ||
              item.mail_id === '1';

            if (isGuerrillaSystemMail) continue;

            let bodyText = item.mail_body || item.mail_excerpt || '';

            if ((!bodyText || bodyText.length < 80) && item.mail_id && item.mail_id !== 1) {
              try {
                const fetchResp = await fetch(
                  `https://api.guerrillamail.com/ajax.php?f=fetch_email&email_id=${item.mail_id}&sid_token=${sid}`,
                  { signal: AbortSignal.timeout(4000) }
                );
                if (fetchResp.ok) {
                  const fetchDetail = await fetchResp.json();
                  if (fetchDetail?.mail_body) {
                    bodyText = fetchDetail.mail_body;
                  }
                }
              } catch {}
            }

            const code = extractSmartOtpCode(item.mail_subject || '', bodyText, '', email);
            const timestamp = item.mail_date ? Date.parse(item.mail_date) : Date.now();

            messages.push({
              id: String(item.mail_id || Math.random()),
              sender: item.mail_from || 'Verification Service',
              senderAvatar: (item.mail_from || 'G').charAt(0).toUpperCase(),
              fromEmail: item.mail_from || '',
              subject: item.mail_subject || 'Verification Email',
              snippet: (item.mail_excerpt || bodyText).substring(0, 140),
              receivedAt: item.mail_date || 'Just now',
              verificationCode: code,
              body: bodyText,
              isRead: false,
              timestamp,
            });
          }
        }
      } catch (err: any) {
        console.warn('Guerrilla fetch warning in Vercel handler:', err?.message);
      }
    })();

    await Promise.allSettled([...tempMailPromises, guerrillaPromise]);

    // Deduplicate messages by id or subject+time
    const uniqueMap = new Map<string, any>();
    for (const m of messages) {
      const key = `${m.fromEmail}_${m.subject}_${m.receivedAt}`;
      if (!uniqueMap.has(m.id) && !uniqueMap.has(key)) {
        uniqueMap.set(m.id, m);
        uniqueMap.set(key, m);
      }
    }

    const uniqueMessages = Array.from(new Set(uniqueMap.values()));

    // Safe timestamp-based descending sort (No NaN)
    const getSafeTime = (m: any): number => {
      if (typeof m.timestamp === 'number' && !isNaN(m.timestamp) && m.timestamp > 0) return m.timestamp;
      if (m.receivedAt && m.receivedAt !== 'Just now') {
        const parsed = Date.parse(m.receivedAt);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
      return 0;
    };

    uniqueMessages.sort((a, b) => {
      const diff = getSafeTime(b) - getSafeTime(a);
      if (!isNaN(diff) && diff !== 0) return diff;
      return String(b.id || '').localeCompare(String(a.id || ''));
    });

    // Find latest verification code from newest message
    const withCode = uniqueMessages.find((m) => m.verificationCode);
    if (withCode) {
      latestCode = withCode.verificationCode;
    }

    return res.status(200).json({
      success: true,
      count: uniqueMessages.length,
      messages: uniqueMessages,
      latestCode,
      provider: provider || 'Temp Mail',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Fatal error in Vercel /api/tempmail/inbox:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to fetch inbox',
      messages: [],
      latestCode: null,
    });
  }
}
