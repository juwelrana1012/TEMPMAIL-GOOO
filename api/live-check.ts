import { verifyFacebookRecord } from './facebook/live-check';
import { verifyInstagramRecord } from './instagram/live-check';
import { verifyTikTokRecord } from './tiktok/live-check';

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
    const platform = (req.body?.platform || req.query?.platform || 'facebook').toLowerCase();
    const rawInput = req.body?.uids || req.body?.records || req.body;

    let records: string[] = [];
    if (Array.isArray(rawInput)) {
      records = rawInput;
    } else if (typeof rawInput === 'string') {
      records = rawInput.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
    }

    if (records.length === 0) {
      return res.status(400).json({ success: false, error: 'No records provided' });
    }

    const batch = records.slice(0, 100);
    const liveRecords: string[] = [];
    const deadRecords: string[] = [];
    const results: any[] = [];

    const concurrency = 25;
    for (let i = 0; i < batch.length; i += concurrency) {
      const chunk = batch.slice(i, i + concurrency);
      const chunkResults = await Promise.all(
        chunk.map((rec) => {
          if (platform === 'instagram') return verifyInstagramRecord(rec);
          if (platform === 'tiktok') return verifyTikTokRecord(rec);
          return verifyFacebookRecord(rec);
        })
      );

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
      platform,
      totalChecked: batch.length,
      totalLive: liveRecords.length,
      totalDead: deadRecords.length,
      totalUnverified: 0,
      liveRecords,
      deadRecords,
      unverifiedRecords: [],
      results,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || 'Verification error' });
  }
}
