process.env.VERCEL = '1';
import app from '../server.js';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // If a subpath was forwarded via query parameter or header
  if (req.query && req.query.__path) {
    const sub = Array.isArray(req.query.__path) ? req.query.__path.join('/') : req.query.__path;
    const queryIdx = req.url.indexOf('?');
    const queryString = queryIdx !== -1 ? req.url.substring(queryIdx) : '';
    req.url = (sub.startsWith('/') ? sub : '/' + sub) + queryString;
  }

  return new Promise((resolve) => {
    res.on('finish', resolve);
    res.on('close', resolve);
    app(req, res);
  });
}
