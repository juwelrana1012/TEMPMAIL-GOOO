process.env.VERCEL = '1';
import app from '../server.js';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Restore the requested path from catch-all route params
  if (req.query && req.query.path) {
    const segments = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path;
    const queryIdx = req.url.indexOf('?');
    const queryString = queryIdx !== -1 ? req.url.substring(queryIdx) : '';
    req.url = '/api/' + segments + queryString;
  }

  return new Promise((resolve) => {
    res.on('finish', resolve);
    res.on('close', resolve);
    app(req, res);
  });
}
