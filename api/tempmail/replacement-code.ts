import { extractSmartOtpCode } from "../utils/otpExtractor";

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
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
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

            const bodySnippet = textBody || item.text || item.snippet || '';
            const extractedCode = extractSmartOtpCode(item.subject || '', bodySnippet, htmlBody || item.html || '', email);
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
