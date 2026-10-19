/**
 * Universal Vercel Serverless Function: POST /api/tempmail/two-factor-code
 * Self-contained 2FA handler
 */

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return res.status(200).json({
      success: true,
      code,
      generatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || 'Failed 2FA generation' });
  }
}
