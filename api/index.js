import app, { ensureReady } from '../server/index.js';

export default async function handler(req, res) {
  try {
    await ensureReady();
  } catch (err) {
    res.status(500).json({ error: 'Service is temporarily unavailable (database initialization failed)' });
    return;
  }
  return app(req, res);
}
