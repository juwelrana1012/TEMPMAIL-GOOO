import { extractSmartOtpCode } from '../utils/otpExtractor';


export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const text = (req.body?.text || req.query?.text || '') as string;
  const subject = (req.body?.subject || req.query?.subject || '') as string;
  const html = (req.body?.html || req.query?.html || '') as string;

  const code = extractSmartOtpCode(subject, text, html);

  return res.status(200).json({
    success: true,
    code,
    found: !!code,
  });
}
