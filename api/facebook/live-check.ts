import axios from 'axios';

export interface ProcessedRecord {
  originalRecord: string;
  uid: string;
  status: 'LIVE' | 'DEAD' | 'UNABLE_TO_VERIFY';
  detail?: string;
}

function parseOriginalRecords(rawInput: any): string[] {
  let text = '';
  if (Array.isArray(rawInput)) {
    text = rawInput.join('\n');
  } else if (typeof rawInput === 'string') {
    text = rawInput;
  } else {
    return [];
  }

  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function extractUidFromRecord(record: string): string {
  const trimmed = record.trim();
  if (!trimmed) return '';

  // 1. profile.php?id=1000...
  const profileIdMatch = trimmed.match(/facebook\.com\/profile\.php\?id=([0-9]+)/i);
  if (profileIdMatch && profileIdMatch[1]) return profileIdMatch[1];

  // 2. facebook.com/username
  const urlMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.|m\.|mbasic\.|web\.)?facebook\.com\/([a-zA-Z0-9._-]+)/i);
  if (urlMatch && urlMatch[1] && !['profile.php', 'watch', 'pages', 'groups', 'share', 'login'].includes(urlMatch[1].toLowerCase())) {
    return urlMatch[1].replace(/^@+/, '').trim();
  }

  // 3. Delimited tokens (e.g. UID|pass|2fa)
  const tokens = trimmed.split(/[\s|:;,]+/);
  for (const token of tokens) {
    const clean = token.replace(/^@+/, '').trim();
    if (/^\d{4,}$/.test(clean)) {
      return clean;
    }
  }
  return (tokens[0] || '').replace(/^@+/, '').trim();
}

const uidCache = new Map<string, { result: ProcessedRecord; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function getCached(key: string): ProcessedRecord | null {
  const c = uidCache.get(key);
  if (c && Date.now() - c.ts < CACHE_TTL) return c.result;
  if (c) uidCache.delete(key);
  return null;
}

function setCached(key: string, result: ProcessedRecord) {
  if (result.status === 'UNABLE_TO_VERIFY') return;
  if (uidCache.size > 2000) {
    const firstKey = uidCache.keys().next().value;
    if (firstKey) uidCache.delete(firstKey);
  }
  uidCache.set(key, { result, ts: Date.now() });
}

export async function verifyFacebookRecord(record: string): Promise<ProcessedRecord> {
  const uid = extractUidFromRecord(record);

  if (!uid || uid.length === 0) {
    return {
      originalRecord: record,
      uid: 'N/A',
      status: 'DEAD',
      detail: 'No identifiable UID found in record',
    };
  }

  const cacheKey = `fb:${uid.toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return { ...cached, originalRecord: record };
  }

  try {
    const isNumericUid = /^\d+$/.test(uid);

    if (isNumericUid) {
      const picRes = await axios.get(
        `https://graph2.facebook.com/v3.3/${encodeURIComponent(uid)}/picture?redirect=0`,
        {
          validateStatus: () => true,
          timeout: 4000,
        }
      );

      if (picRes.status === 400 || picRes.data?.error) {
        const resObj: ProcessedRecord = {
          originalRecord: record,
          uid,
          status: 'DEAD',
          detail: 'Account deleted, suspended, or nonexistent',
        };
        setCached(cacheKey, resObj);
        return resObj;
      }

      if (picRes.status === 200 && picRes.data?.data?.url) {
        const avatarUrl = picRes.data.data.url;

        // If it has an active CDN profile image, account is LIVE
        if (avatarUrl.includes('scontent') || avatarUrl.includes('fbcdn.net/v/')) {
          const resObj: ProcessedRecord = {
            originalRecord: record,
            uid,
            status: 'LIVE',
            detail: 'Active Facebook Account',
          };
          setCached(cacheKey, resObj);
          return resObj;
        }

        // Default silhouette check via oembed
        try {
          const oembedRes = await axios.get(
            `https://graph.facebook.com/v19.0/oembed_page?url=https://www.facebook.com/${encodeURIComponent(uid)}`,
            {
              validateStatus: () => true,
              timeout: 3000,
            }
          );

          if (oembedRes.status === 200 && oembedRes.data?.provider_name === 'Facebook') {
            const resObj: ProcessedRecord = {
              originalRecord: record,
              uid,
              status: 'LIVE',
              detail: 'Active Facebook Account',
            };
            setCached(cacheKey, resObj);
            return resObj;
          }
        } catch {}

        const resObj: ProcessedRecord = {
          originalRecord: record,
          uid,
          status: 'DEAD',
          detail: 'Account deleted, suspended, or nonexistent',
        };
        setCached(cacheKey, resObj);
        return resObj;
      }
    } else {
      // Username / vanity slug check via Facebook oembed
      const oembedRes = await axios.get(
        `https://graph.facebook.com/v19.0/oembed_page?url=https://www.facebook.com/${encodeURIComponent(uid)}`,
        {
          validateStatus: () => true,
          timeout: 3500,
        }
      );

      if (oembedRes.status === 200 && oembedRes.data?.provider_name === 'Facebook') {
        const resObj: ProcessedRecord = {
          originalRecord: record,
          uid,
          status: 'LIVE',
          detail: 'Active Facebook Profile/Page',
        };
        setCached(cacheKey, resObj);
        return resObj;
      }

      const resObj: ProcessedRecord = {
        originalRecord: record,
        uid,
        status: 'DEAD',
        detail: 'Account does not exist, disabled, or removed',
      };
      setCached(cacheKey, resObj);
      return resObj;
    }

    const resObj: ProcessedRecord = {
      originalRecord: record,
      uid,
      status: 'DEAD',
      detail: 'Account does not exist, disabled, or removed',
    };
    setCached(cacheKey, resObj);
    return resObj;
  } catch (error: any) {
    return {
      originalRecord: record,
      uid,
      status: 'DEAD',
      detail: error.message || 'Verification connection timeout',
    };
  }
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const rawInput = req.body?.uids || req.body?.records || req.body;
    const records = parseOriginalRecords(rawInput);

    if (records.length === 0) {
      return res.status(400).json({
        success: false,
        platform: 'facebook',
        error: 'Please enter at least one Facebook record into the input box.',
      });
    }

    const batch = records.slice(0, 100);
    const liveRecords: string[] = [];
    const deadRecords: string[] = [];
    const results: ProcessedRecord[] = [];

    const concurrency = 25;
    for (let i = 0; i < batch.length; i += concurrency) {
      const chunk = batch.slice(i, i + concurrency);
      const chunkResults = await Promise.all(chunk.map((rec) => verifyFacebookRecord(rec)));

      for (const item of chunkResults) {
        results.push(item);
        if (item.status === 'LIVE') {
          liveRecords.push(item.originalRecord);
        } else {
          deadRecords.push(item.originalRecord);
        }
      }
    }

    return res.status(200).json({
      success: true,
      platform: 'facebook',
      totalChecked: batch.length,
      totalLive: liveRecords.length,
      totalDead: deadRecords.length,
      totalUnverified: 0,
      liveRecords,
      deadRecords,
      unverifiedRecords: [],
      results,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      platform: 'facebook',
      error: error.message || 'An error occurred while verifying Facebook records.',
    });
  }
}
