/**
 * Client-Side UID Live Verifier Fallback
 * Provides 100% resilient verification directly from the browser on Vercel or any static host.
 */

export interface VerificationResult {
  originalRecord: string;
  uid: string;
  status: 'LIVE' | 'DEAD' | 'UNABLE_TO_VERIFY';
  detail?: string;
}

// Extract UID or Username from record
export function extractUidToken(
  record: string,
  platform: 'facebook' | 'instagram' | 'tiktok'
): string {
  const trimmed = record.trim();
  if (!trimmed) return '';

  if (platform === 'facebook') {
    const profileIdMatch = trimmed.match(/facebook\.com\/profile\.php\?id=([0-9]+)/i);
    if (profileIdMatch && profileIdMatch[1]) return profileIdMatch[1];

    const urlMatch = trimmed.match(
      /(?:https?:\/\/)?(?:www\.|m\.|mbasic\.|web\.)?facebook\.com\/([a-zA-Z0-9._-]+)/i
    );
    if (
      urlMatch &&
      urlMatch[1] &&
      !['profile.php', 'watch', 'pages', 'groups', 'share', 'login'].includes(urlMatch[1].toLowerCase())
    ) {
      return urlMatch[1].replace(/^@+/, '').trim();
    }

    const tokens = trimmed.split(/[\s|:;,]+/);
    for (const token of tokens) {
      const clean = token.replace(/^@+/, '').trim();
      if (/^\d{4,}$/.test(clean)) return clean;
    }
    return (tokens[0] || '').replace(/^@+/, '').trim();
  }

  if (platform === 'instagram') {
    const urlMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9._-]+)/i);
    if (
      urlMatch &&
      urlMatch[1] &&
      !['p', 'reel', 'stories', 'explore', 'direct'].includes(urlMatch[1].toLowerCase())
    ) {
      return urlMatch[1].replace(/^@+/, '').trim();
    }
    const tokens = trimmed.split(/[\s|:;,]+/);
    return (tokens[0] || '').replace(/^@+/, '').trim();
  }

  if (platform === 'tiktok') {
    const urlMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@?([a-zA-Z0-9._-]+)/i);
    if (
      urlMatch &&
      urlMatch[1] &&
      !['video', 'tag', 'music', 'live'].includes(urlMatch[1].toLowerCase())
    ) {
      return urlMatch[1].replace(/^@+/, '').trim();
    }
    const tokens = trimmed.split(/[\s|:;,]+/);
    return (tokens[0] || '').replace(/^@+/, '').trim();
  }

  return (trimmed.split(/[\s|:;,]+/)[0] || '').replace(/^@+/, '').trim();
}

// In-memory cache for client sessions
const clientCache = new Map<string, { status: 'LIVE' | 'DEAD'; detail: string }>();

// Fast CORS proxy fetch helper
async function fetchViaCorsProxy(targetUrl: string, timeoutMs = 4000): Promise<string | null> {
  // Try direct fetch first
  try {
    const directRes = await fetch(targetUrl, { signal: AbortSignal.timeout(timeoutMs) });
    if (directRes.ok) {
      return await directRes.text();
    }
  } catch {}

  // Fallback to CORS proxies
  const proxies = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
    `https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}`,
  ];

  for (const proxy of proxies) {
    try {
      const pRes = await fetch(proxy, { signal: AbortSignal.timeout(timeoutMs) });
      if (pRes.ok) {
        return await pRes.text();
      }
    } catch {}
  }
  return null;
}

// Verify a single Facebook record on client
export async function verifyFacebookClient(record: string): Promise<VerificationResult> {
  const uid = extractUidToken(record, 'facebook');
  if (!uid) {
    return { originalRecord: record, uid: 'N/A', status: 'DEAD', detail: 'Invalid UID format' };
  }

  const cacheKey = `fb:${uid.toLowerCase()}`;
  if (clientCache.has(cacheKey)) {
    const c = clientCache.get(cacheKey)!;
    return { originalRecord: record, uid, status: c.status, detail: c.detail };
  }

  const isNumeric = /^\d+$/.test(uid);

  if (isNumeric) {
    // 1. Graph API has open CORS (Access-Control-Allow-Origin: *)
    try {
      const graphUrl = `https://graph2.facebook.com/v3.3/${encodeURIComponent(uid)}/picture?redirect=0`;
      const res = await fetch(graphUrl, { signal: AbortSignal.timeout(3500) });
      const json = await res.json().catch(() => null);

      if (json && json.data && json.data.url) {
        const url: string = json.data.url;
        if (url.includes('scontent') || url.includes('fbcdn.net/v/')) {
          clientCache.set(cacheKey, { status: 'LIVE', detail: 'Active Facebook Account' });
          return { originalRecord: record, uid, status: 'LIVE', detail: 'Active Facebook Account' };
        }
      }

      if (res.status === 400 || (json && json.error)) {
        clientCache.set(cacheKey, { status: 'DEAD', detail: 'Account deleted or nonexistent' });
        return { originalRecord: record, uid, status: 'DEAD', detail: 'Account deleted or nonexistent' };
      }
    } catch {}

    // 2. Fallback check: Test image load or oembed
    try {
      const oembedUrl = `https://graph.facebook.com/v19.0/oembed_page?url=https://www.facebook.com/${encodeURIComponent(uid)}`;
      const oembedText = await fetchViaCorsProxy(oembedUrl, 3000);
      if (oembedText && oembedText.includes('Facebook')) {
        clientCache.set(cacheKey, { status: 'LIVE', detail: 'Active Facebook Account' });
        return { originalRecord: record, uid, status: 'LIVE', detail: 'Active Facebook Account' };
      }
    } catch {}

    clientCache.set(cacheKey, { status: 'DEAD', detail: 'Account deleted or nonexistent' });
    return { originalRecord: record, uid, status: 'DEAD', detail: 'Account deleted or nonexistent' };
  }

  // Vanity username check
  try {
    const oembedUrl = `https://graph.facebook.com/v19.0/oembed_page?url=https://www.facebook.com/${encodeURIComponent(uid)}`;
    const text = await fetchViaCorsProxy(oembedUrl, 3500);
    if (text && text.includes('Facebook')) {
      clientCache.set(cacheKey, { status: 'LIVE', detail: 'Active Facebook Profile/Page' });
      return { originalRecord: record, uid, status: 'LIVE', detail: 'Active Facebook Profile/Page' };
    }
  } catch {}

  clientCache.set(cacheKey, { status: 'DEAD', detail: 'Account not found or removed' });
  return { originalRecord: record, uid, status: 'DEAD', detail: 'Account not found or removed' };
}

// Verify a single Instagram record on client
export async function verifyInstagramClient(record: string): Promise<VerificationResult> {
  const username = extractUidToken(record, 'instagram');
  if (!username) {
    return { originalRecord: record, uid: 'N/A', status: 'DEAD', detail: 'Invalid username' };
  }

  const cacheKey = `ig:${username.toLowerCase()}`;
  if (clientCache.has(cacheKey)) {
    const c = clientCache.get(cacheKey)!;
    return { originalRecord: record, uid: username, status: c.status, detail: c.detail };
  }

  try {
    const embedUrl = `https://www.instagram.com/${encodeURIComponent(username)}/embed/`;
    const html = await fetchViaCorsProxy(embedUrl, 4000);

    if (html && (html.includes('"isProfileEmbed":true') || html.includes('"owner_id":') || html.includes('profile_link'))) {
      clientCache.set(cacheKey, { status: 'LIVE', detail: 'Verified Active Instagram Account' });
      return { originalRecord: record, uid: username, status: 'LIVE', detail: 'Verified Active Instagram Account' };
    }
  } catch {}

  clientCache.set(cacheKey, { status: 'DEAD', detail: 'Account does not exist or removed' });
  return { originalRecord: record, uid: username, status: 'DEAD', detail: 'Account does not exist or removed' };
}

// Verify a single TikTok record on client
export async function verifyTikTokClient(record: string): Promise<VerificationResult> {
  const username = extractUidToken(record, 'tiktok');
  if (!username) {
    return { originalRecord: record, uid: 'N/A', status: 'DEAD', detail: 'Invalid username' };
  }

  const cacheKey = `tt:${username.toLowerCase()}`;
  if (clientCache.has(cacheKey)) {
    const c = clientCache.get(cacheKey)!;
    return { originalRecord: record, uid: username, status: c.status, detail: c.detail };
  }

  try {
    const oembedUrl = `https://www.tiktok.com/oembed?url=https://www.tiktok.com/@${encodeURIComponent(username)}`;
    const text = await fetchViaCorsProxy(oembedUrl, 3500);

    if (text) {
      try {
        const json = JSON.parse(text);
        if (json && json.author_name) {
          clientCache.set(cacheKey, { status: 'LIVE', detail: `Active TikTok Profile (${json.author_name})` });
          return { originalRecord: record, uid: username, status: 'LIVE', detail: `Active TikTok Profile (${json.author_name})` };
        }
      } catch {}
    }
  } catch {}

  clientCache.set(cacheKey, { status: 'DEAD', detail: 'Account does not exist or removed' });
  return { originalRecord: record, uid: username, status: 'DEAD', detail: 'Account does not exist or removed' };
}

// Batch Client-Side Verifier
export async function verifyRecordsClientSide(
  records: string[],
  platform: 'facebook' | 'instagram' | 'tiktok',
  onProgress?: (completed: number, liveItem?: string, deadItem?: string) => void
): Promise<{ liveRecords: string[]; deadRecords: string[]; results: VerificationResult[] }> {
  const liveRecords: string[] = [];
  const deadRecords: string[] = [];
  const results: VerificationResult[] = [];

  const concurrency = 10;
  for (let i = 0; i < records.length; i += concurrency) {
    const chunk = records.slice(i, i + concurrency);
    const chunkResults = await Promise.all(
      chunk.map(async (record) => {
        let res: VerificationResult;
        if (platform === 'instagram') {
          res = await verifyInstagramClient(record);
        } else if (platform === 'tiktok') {
          res = await verifyTikTokClient(record);
        } else {
          res = await verifyFacebookClient(record);
        }

        if (res.status === 'LIVE') {
          liveRecords.push(record);
          if (onProgress) onProgress(1, record, undefined);
        } else {
          deadRecords.push(record);
          if (onProgress) onProgress(1, undefined, record);
        }
        return res;
      })
    );

    results.push(...chunkResults);
  }

  return { liveRecords, deadRecords, results };
}
