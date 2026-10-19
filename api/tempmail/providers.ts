export default function handler(_req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Cache-Control', 'public, max-age=3600');

  const providers = [
    {
      id: 'temp-mail-plus',
      name: 'Temp Mail Plus',
      domains: [
        'mailto.plus',
        'fexpost.com',
        'fexbox.org',
        'mailbox.in.ua',
        'rover.info',
        'chitthi.in',
        'fextemp.com',
        'any.pink',
        'merepost.com',
      ],
      features: ['Auto Refresh', 'Instant Codes', 'Attachments', '100% Live Inbound'],
      recommended: true,
      badge: 'Live Inbound',
      isLiveExternal: true,
      baseUrl: 'https://tempmail.plus',
    },
    {
      id: 'sharklasers',
      name: 'SharkLasers',
      domains: ['sharklasers.com', 'guerrillamail.com', 'guerrillamailblock.com', 'spam4.me', 'pokemail.net'],
      features: ['High Deliverability', 'Real-time Inbox', 'Guerrilla Backbone'],
      badge: 'Fast & Secure',
      isLiveExternal: true,
      baseUrl: 'https://www.guerrillamail.com',
    },
    {
      id: 'mail-cx',
      name: 'Mail.cx',
      domains: ['mail.cx', 'uqu.me', 'ddker.com', '9k3r.com'],
      features: ['Clean Reputation', 'Disposable', 'Real-time Push'],
      badge: 'Official API',
      isLiveExternal: true,
      baseUrl: 'https://mail.cx',
    },
    {
      id: 'tmailor',
      name: 'Tmailor',
      domains: ['tmailor.com', 'tmailr.com', 'tmailor.net'],
      features: ['Ultra-fast', 'Worldwide DNS', 'Spam-Free'],
      badge: 'Global CDN',
      isLiveExternal: true,
      baseUrl: 'https://tmailor.com',
    },
    {
      id: 'tempmailpro',
      name: 'TempMailPro',
      domains: ['tempmailpro.io', 'tempmailpro.net'],
      features: ['Pro Grade', 'Anti-Spam Filter', 'Clean IPs'],
      badge: 'Pro Grade',
      isLiveExternal: true,
      baseUrl: 'https://tempmailpro.io',
    },
  ];

  return res.status(200).json({ success: true, providers });
}
