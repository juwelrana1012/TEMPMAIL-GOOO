/**
 * Universal Vercel Serverless Function: POST /api/tempmail/send-test
 * Self-contained test verification email generator without server.ts dependency
 */

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const email = req.body?.email || req.body?.address || req.query?.email;
    const service = req.body?.service || req.query?.service || 'Google Security';
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();

    let subject = '';
    let sender = '';
    let fromEmail = '';
    let body = '';

    const lowerService = String(service).toLowerCase();
    if (lowerService.includes('google')) {
      subject = `${generatedCode} is your Google verification code`;
      sender = 'Google Security';
      fromEmail = 'noreply@google.com';
      body = `Hi Juwel,\n\nUse this code to verify your account:\n\n${generatedCode}\n\nThis code will expire in 10 minutes. If you did not request this code, you can safely ignore this email.\n\nThanks,\nThe Google Accounts team`;
    } else if (lowerService.includes('binance')) {
      subject = `[Binance] Verification Code: ${generatedCode}`;
      sender = 'Binance Security';
      fromEmail = 'do-not-reply@binance.com';
      body = `Dear Binancian,\n\nYour security verification code is:\n\n${generatedCode}\n\nThe verification code will be valid for 30 minutes. Please do not share this code with anyone.\n\nBinance Team`;
    } else if (lowerService.includes('facebook')) {
      subject = `${generatedCode} is your Facebook security code`;
      sender = 'Facebook';
      fromEmail = 'security@facebookmail.com';
      body = `Hi,\n\nHere is your security confirmation code:\n\n${generatedCode}\n\nEnter this code on Facebook to confirm your action.`;
    } else {
      subject = `Your verification code is ${generatedCode}`;
      sender = String(service);
      fromEmail = `support@${lowerService.replace(/\s+/g, '')}.com`;
      body = `Hello,\n\nYour verification code is: ${generatedCode}\n\nPlease enter this code to complete verification.`;
    }

    const testMail = {
      id: `test-${Date.now()}`,
      sender,
      senderAvatar: sender.charAt(0).toUpperCase(),
      fromEmail,
      subject,
      snippet: body.substring(0, 140),
      receivedAt: new Date().toLocaleTimeString(),
      verificationCode: generatedCode,
      body,
      isRead: false,
    };

    return res.status(200).json({
      success: true,
      message: `Test email sent from ${sender}`,
      verificationCode: generatedCode,
      mail: testMail,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || 'Failed to send test email' });
  }
}
