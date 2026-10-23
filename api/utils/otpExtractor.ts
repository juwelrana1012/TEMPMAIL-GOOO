/**
 * Smart OTP & 8-Digit Confirmation Verification Code Extractor for Vercel Serverless Functions
 * Zero-dependency, pure JavaScript/TypeScript regex engine
 */

export function normalizeNumerals(input: string): string {
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

export function extractSmartOtpCode(
  subject = '',
  text = '',
  html = '',
  recipientEmail = ''
): string | null {
  const directCandidate = (text || '').trim();
  const directNormalized = normalizeNumerals(directCandidate);

  const isDirectEmail = directCandidate.includes('@') && !directCandidate.includes(' ');
  if (!isDirectEmail && directCandidate.length >= 4 && directCandidate.length <= 15) {
    const directPrefixMatch = directNormalized.match(/^(?:G|FB|VK|TG|MS|ID|IG)[-\s]?([0-9]{4,8})$/i);
    if (directPrefixMatch && directPrefixMatch[1]) {
      return directPrefixMatch[1];
    }

    const strippedOnlyDigits = directNormalized.replace(/[\s\-_[\]().:<>]/g, '');
    if (/^[0-9]{4,8}$/.test(strippedOnlyDigits)) {
      const num = parseInt(strippedOnlyDigits, 10);
      if (!(strippedOnlyDigits.length === 4 && num >= 2020 && num <= 2030)) {
        return strippedOnlyDigits;
      }
    }
  }

  // Pre-process angle-bracketed numbers so <123456> or <123 456> are NEVER stripped as HTML tags!
  const unwrapAngleBrackets = (str: string) =>
    (str || '').replace(/<([0-9]{3,8}(?:[\s-][0-9]{3,8})?)>/g, ' $1 ');

  const unwrapSubject = unwrapAngleBrackets(subject);
  const unwrapText = unwrapAngleBrackets(text);
  const unwrapHtml = unwrapAngleBrackets(html);

  const cleanHtml = unwrapHtml
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(?:nbsp|#160|#8239);/gi, ' ')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');

  let combined = `${unwrapSubject}\n${unwrapText}\n${cleanHtml}`;
  combined = normalizeNumerals(combined);

  // Strip recipient username and digits so account numbers are NEVER mistaken for OTP
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

  combined = combined.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, ' [EMAIL] ');
  combined = combined.replace(/https?:\/\/[^\s"'<>]+/gi, ' [URL] ');
  // Strip reference IDs, tracking IDs, order numbers, case numbers, account IDs, Facebook IDs, etc.
  combined = combined.replace(/(?:facebook\s*id|fb\s*id|user\s*id|account\s*id|client\s*id|device\s*id|session\s*id|login\s*id|post\s*id|message\s*id|\bid)[\s:#*-]+[0-9]{4,20}/gi, ' [ID_STRIPPED] ');
  combined = combined.replace(/(?:ref(?:erence)?|tracking|case|ticket|order|invoice)[\s:#*-]+[0-9]{4,20}/gi, ' [REF_ID] ');

  const cleanVal = (v: string) => (v || '').replace(/[\s\-_[\]().:<>]/g, '');

  const prefixMatch = combined.match(/\b(?:FB|G|VK|TG|MS|IG|DC|EA)[-\s]?([0-9]{4}[\s-]?[0-9]{4}|[0-9]{3}[\s-]?[0-9]{3}|[0-9]{4,8})\b/i);
  if (prefixMatch && prefixMatch[1]) {
    const cleaned = cleanVal(prefixMatch[1]);
    if (cleaned.length >= 4 && cleaned.length <= 8) return cleaned;
  }

  if (subject) {
    const sClean = normalizeNumerals(unwrapSubject)
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, ' ')
      .replace(/https?:\/\/[^\s"'<>]+/gi, ' ')
      .replace(/(?:facebook\s*id|user\s*id|account\s*id|\bid)[\s:#*-]+[0-9]{4,20}/gi, ' ');

    const sPrefix = sClean.match(/\b(?:FB|G|VK|TG|MS|IG|DC|EA)[-\s]?([0-9]{4}[\s-]?[0-9]{4}|[0-9]{3}[\s-]?[0-9]{3}|[0-9]{4,8})\b/i);
    if (sPrefix && sPrefix[1]) {
      const c = cleanVal(sPrefix[1]);
      if (c.length >= 4 && c.length <= 8) return c;
    }

    // Specific Instagram subject matchers:
    // "<123456> is your Instagram code", "123 456 is your Instagram code", "Your Instagram code is 123456"
    const sInstagram = sClean.match(
      /(?:(?:your\s+)?(?:instagram|insta|ig|ইনস্টাগ্রাম)[\s\w-]{0,35}?(?:code|otp|passcode|pin|কোড)[\s:—–=is#*হলো-]+([0-9]{3}[\s-]?[0-9]{3}|[0-9]{4,8})|([0-9]{3}[\s-]?[0-9]{3}|[0-9]{4,8})\b[\s\r\n]+(?:is\s+your|to\s+confirm|to\s+verify|to\s+reset|to\s+recover|হলো\s+আপনার)[\s\w-]{0,25}?(?:instagram|insta|ig|account|ইনস্টাগ্রাম))/i
    );
    if (sInstagram) {
      const codeFound = sInstagram[1] || sInstagram[2];
      if (codeFound) {
        const c = cleanVal(codeFound);
        if (c.length >= 4 && c.length <= 8) return c;
      }
    }

    const sExplicit = sClean.match(
      /(?:(?:8[\s-]?(?:digit|ডিজিট)|eight[\s-]?digit)?\s*(?:confirmation|verification|security|recovery|single-use|one-time|identity|access|login|facebook|instagram|microsoft|google|binance|কনফার্মেশন|ভেরিফিকেশন|নিরাপত্তা|রিকভারি|লগইন|ইনস্টাগ্রাম)[\s\w-]{0,35}?(?:code|otp|passcode|pin|কোড|ওটিপি|পিন)[\s:—–=is#*হলো-]+|(?:use|enter|type|input)\s+[^:0-9\n\r]{0,35}?(?:code|confirm|verify)[\s:—–=is#*-]+)([0-9]{4}[\s-]?[0-9]{4}|[0-9]{3}[\s-]?[0-9]{3}|[0-9]{4,8})\b/i
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
    // Instagram specific
    /(?:(?:your\s+)?(?:instagram|insta|ig|ইনস্টাগ্রাম)[\s\w-]{0,35}?(?:code|otp|passcode|pin|কোড)[\s\r\n:—–=is#*হলো-]+)([0-9]{3}[\s-]?[0-9]{3}|[0-9]{4,8})\b/i,
    /\b([0-9]{3}[\s-]?[0-9]{3}|[0-9]{4,8})\b[\s\r\n]+(?:is\s+your\s+(?:instagram|insta|ig|security|confirmation|verification)\s+code|is\s+your\s+code|হলো\s+আপনার\s+ইনস্টাগ্রাম)/i,
    /(?:(?:8[\s-]?(?:digit|ডিজিট)|eight[\s-]?digit)?\s*(?:confirmation|verification|security|recovery|single-use|one-time|identity|access|login|facebook|instagram|microsoft|কনফার্মেশন|ভেরিফিকেশন|নিরাপত্তা|রিকভারি|লগইন|ইনস্টাগ্রাম)[\s\w-]{0,35}?(?:code|otp|passcode|pin|কোড|ওটিপি|পিন)[\s\r\n:—–=is#*হলো-]+)([0-9]{4}[\s-]?[0-9]{4}|[0-9]{3}[\s-]?[0-9]{3}|[0-9]{4,8})\b/i,
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

  // Spaced 8-digit OTP
  const genSpaced8 = combined.match(/\b([0-9]{4})[\s-]([0-9]{4})\b/);
  if (genSpaced8 && genSpaced8[1] && genSpaced8[2]) {
    const joined = `${genSpaced8[1]}${genSpaced8[2]}`;
    if (!joined.startsWith('202') && !joined.startsWith('199')) {
      return joined;
    }
  }

  // Spaced 6-digit OTP (Instagram, WhatsApp, Discord)
  const genSpaced6 = combined.match(/\b([0-9]{3})[\s-]([0-9]{3})\b/);
  if (genSpaced6 && genSpaced6[1] && genSpaced6[2]) {
    const joined = `${genSpaced6[1]}${genSpaced6[2]}`;
    const idx = genSpaced6.index ?? 0;
    const surrounding = combined.substring(Math.max(0, idx - 50), Math.min(combined.length, idx + 60)).toLowerCase();
    if (/instagram|insta|ig|facebook|whatsapp|verify|code|otp|confirm|security|লগইন|কোড/.test(surrounding)) {
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
    else if (val.length === 6) score += 35;
    else if (val.length === 5) score += 20;
    else score += 10;

    if (/confirmation|security|recovery|verify|confirm|microsoft|facebook|instagram|insta|ig|google|binance|single-use|code|otp|কোড|ওটিপি/.test(surrounding)) {
      score += 45;
    }

    if (score > bestScore) {
      bestScore = score;
      bestCandidate = val;
    }
  }

  if (bestCandidate) {
    return bestCandidate;
  }

  return null;
}
