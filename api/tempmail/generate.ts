export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const body = req.body || {};
    const query = req.query || {};

    const requestedProvider = body.provider || query.provider || 'Temp Mail Plus';
    const requestedDomain = body.domain || query.domain || 'mailto.plus';
    const requestedUser = body.username || query.username || '';

    // Generate random username if not provided
    const cleanUser = requestedUser
      ? requestedUser.toLowerCase().replace(/[^a-z0-9]/g, '')
      : 'user' + Math.floor(100000 + Math.random() * 900000);

    let targetDomain = requestedDomain;
    let providerName = requestedProvider;

    if (targetDomain === 'sharklasers.com') {
      providerName = 'SharkLasers';
    } else if (targetDomain.includes('guerrilla') || targetDomain === 'spam4.me' || targetDomain === 'pokemail.net') {
      providerName = 'Guerrilla Mail';
    }

    const address = `${cleanUser}@${targetDomain}`;

    // If Guerrilla Mail, prime the session in background (non-blocking)
    if (providerName === 'Guerrilla Mail' || providerName === 'SharkLasers') {
      (async () => {
        try {
          const initResp = await fetch('https://api.guerrillamail.com/ajax.php?f=get_email_address', {
            signal: AbortSignal.timeout(2000),
          });
          if (initResp.ok) {
            const initData = await initResp.json();
            if (initData?.sid_token) {
              await fetch(
                `https://api.guerrillamail.com/ajax.php?f=set_email_user&email_user=${encodeURIComponent(cleanUser)}&sid_token=${initData.sid_token}&lang=en`,
                { signal: AbortSignal.timeout(2000) }
              );
            }
          }
        } catch {}
      })();
    }

    // If Temp Mail Plus, activate mailbox with 48h TTL in background (non-blocking)
    if (targetDomain.includes('mailto.plus') || providerName === 'Temp Mail Plus') {
      (async () => {
        try {
          await fetch(`https://tempmail.plus/api/box?email=${encodeURIComponent(address)}&epin=`, {
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'Accept': 'application/json',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            },
            signal: AbortSignal.timeout(3000),
          });
        } catch {}
      })();
    }

    let providerUrl = `https://tempmail.plus/en/#!${cleanUser}@${targetDomain}`;
    if (providerName === 'Guerrilla Mail' || providerName === 'SharkLasers') {
      providerUrl = 'https://www.guerrillamail.com/';
    }

    return res.status(200).json({
      success: true,
      address,
      domain: targetDomain,
      provider: providerName,
      providerUrl,
      createdAt: new Date().toLocaleTimeString(),
      isLiveExternal: true,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to generate email',
    });
  }
}
