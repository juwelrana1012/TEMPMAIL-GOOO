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

  const urlMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9._-]+)/i);
  if (urlMatch && urlMatch[1] && !['p', 'reel', 'stories', 'explore', 'direct'].includes(urlMatch[1].toLowerCase())) {
    return urlMatch[1].replace(/^@+/, '').trim();
  }
  const tokens = trimmed.split(/[\s|:;,]+/);
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

export async function verifyInstagramRecord(record: string): Promise<ProcessedRecord> {
  const username = extractUidFromRecord(record);

  if (!username || username.length === 0) {
    return {
      originalRecord: record,
      uid: 'N/A',
      status: 'UNABLE_TO_VERIFY',
      detail: 'No identifiable username found in record',
    };
  }

  const cacheKey = `ig:${username.toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return { ...cached, originalRecord: record };
  }

  try {
    const res = await axios.get(
      `https://www.instagram.com/${encodeURIComponent(username)}/embed/`,
      {
        validateStatus: () => true,
        timeout: 4500,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      }
    );

    if (res.status === 404) {
      const resObj: ProcessedRecord = {
        originalRecord: record,
        uid: username,
        status: 'DEAD',
        detail: 'Account does not exist or removed',
      };
      setCached(cacheKey, resObj);
      return resObj;
    }

    const html = typeof res.data === 'string' ? res.data : '';
    if (html.includes('"isProfileEmbed":true') || html.includes('"owner_id":') || html.includes('profile_link') || html.includes('instagr.am')) {
      const resObj: ProcessedRecord = {
        originalRecord: record,
        uid: username,
        status: 'LIVE',
        detail: 'Verified Active Instagram Account',
      };
      setCached(cacheKey, resObj);
      return resObj;
    }

    const resObj: ProcessedRecord = {
      originalRecord: record,
      uid: username,
      status: 'DEAD',
      detail: 'Account does not exist or removed',
    };
    setCached(cacheKey, resObj);
    return resObj;
  } catch (error: any) {
    return {
      originalRecord: record,
      uid: username,
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
        platform: 'instagram',
        error: 'Please enter at least one Instagram record into the input box.',
      });
    }

    const batch = records.slice(0, 100);
    const liveRecords: string[] = [];
    const deadRecords: string[] = [];
    const results: ProcessedRecord[] = [];

    const concurrency = 25;
    for (let i = 0; i < batch.length; i += concurrency) {
      const chunk = batch.slice(i, i + concurrency);
      const chunkResults = await Promise.all(chunk.map((rec) => verifyInstagramRecord(rec)));

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
      platform: 'instagram',
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
      platform: 'instagram',
      error: error.message || 'An error occurred while verifying Instagram records.',
    });
  }
}
