import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import pool, { query, initDb } from './db.js';
import { seedDatabase } from './seed.js';
import { uploadFile, listFiles, deleteFile } from './storage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required. Refusing to start with an insecure default.');
}
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 5000;

const ROLES = { SUPER_ADMIN: 'Super Admin', CLIENT_ADMIN: 'Client Admin' };

const app = express();

app.use(helmet({
  contentSecurityPolicy: false // the SPA sets its own CSP needs; avoid breaking inline styles/scripts used by Vite build
}));

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

// Scoped to /api only — static assets (JS/CSS bundle) are requested with the
// crossorigin attribute by the Vite build and must not be rejected by this check.
// A request to its own serving origin (the SPA calling its own API) is always
// allowed; allowedOrigins covers genuinely cross-origin cases like the Vite dev server.
app.use('/api', cors((req, callback) => {
  const selfOrigin = `${req.protocol}://${req.get('host')}`;
  callback(null, {
    origin(origin, cb) {
      if (!origin || origin === selfOrigin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error('Not allowed by CORS'));
    }
  });
}));

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

const publicFormLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false, skipSuccessfulRequests: true });
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false });
app.use('/api', apiLimiter);

// Prevent CDN / Vercel Edge caching of API routes
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Serve the built frontend in production
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}

const ALLOWED_UPLOAD_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp4', '.webm', '.mov']);

// Uploads are held in memory only long enough to forward them to Supabase Storage —
// nothing is written to the (ephemeral, read-only-on-Vercel) local filesystem.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mimeOk = file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/');
    if (mimeOk && ALLOWED_UPLOAD_EXTENSIONS.has(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only image/video files with an approved extension are allowed'));
    }
  }
});

// Wraps an async route handler so rejected promises reach the error handler
function ah(handler) {
  return (req, res, next) => handler(req, res, next).catch(next);
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'You do not have permission to perform this action' });
    }
    next();
  };
}

async function logActivity(userEmail, action, details = '') {
  try {
    await query('INSERT INTO activity_logs (user_email, action, details) VALUES ($1, $2, $3)', [userEmail, action, details]);
  } catch (err) {
    console.error('Log activity error:', err);
  }
}

// ==========================================
// 1. PUBLIC REST API ENDPOINTS
// ==========================================

app.get('/api/content', ah(async (req, res) => {
  const { rows } = await query('SELECT key, value FROM content');
  const contentMap = {};
  rows.forEach(r => contentMap[r.key] = r.value);
  res.json(contentMap);
}));

app.get('/api/settings', ah(async (req, res) => {
  const { rows } = await query('SELECT key, value FROM settings');
  const settingsMap = {};
  rows.forEach(r => settingsMap[r.key] = r.value);
  res.json(settingsMap);
}));

app.get('/api/programs', ah(async (req, res) => {
  const { rows } = await query('SELECT * FROM programs WHERE is_published = true ORDER BY display_order ASC, id ASC');
  res.json(rows);
}));

app.get('/api/coaches', ah(async (req, res) => {
  const { rows } = await query('SELECT * FROM coaches WHERE is_published = true ORDER BY display_order ASC, id ASC');
  res.json(rows);
}));

app.get('/api/events', ah(async (req, res) => {
  const { rows } = await query('SELECT * FROM events WHERE is_published = true ORDER BY id DESC');
  res.json(rows);
}));

app.get('/api/achievements', ah(async (req, res) => {
  const { rows } = await query('SELECT * FROM achievements ORDER BY display_order ASC, id ASC');
  res.json(rows);
}));

app.get('/api/gallery', ah(async (req, res) => {
  const { rows } = await query('SELECT * FROM gallery WHERE is_published = true ORDER BY display_order ASC, id DESC');
  res.json(rows);
}));

app.get('/api/testimonials', ah(async (req, res) => {
  const { rows } = await query('SELECT * FROM testimonials WHERE is_published = true ORDER BY id ASC');
  res.json(rows);
}));

app.get('/api/locations', ah(async (req, res) => {
  const { rows } = await query('SELECT * FROM locations WHERE is_published = true ORDER BY display_order ASC, id ASC');
  res.json(rows);
}));

app.get('/api/faqs', ah(async (req, res) => {
  const { rows } = await query('SELECT * FROM faqs WHERE is_published = true ORDER BY display_order ASC, id ASC');
  res.json(rows);
}));

app.post('/api/trial-bookings', publicFormLimiter, ah(async (req, res) => {
  const { athlete_name, age, parent_phone, email, discipline, location, experience, message } = req.body;
  if (!athlete_name || !parent_phone || !email || !discipline) {
    return res.status(400).json({ error: 'Please fill in all required fields' });
  }

  const { rows } = await query(
    `INSERT INTO trial_bookings (athlete_name, age, parent_phone, email, discipline, location, experience, message, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'New') RETURNING id`,
    [athlete_name, Number(age) || 0, parent_phone, email, discipline, location || 'Main Arena', experience || 'First Timer', message || '']
  );

  await logActivity('Public Visitor', 'New Trial Booking Created', `Athlete: ${athlete_name}, Phone: ${parent_phone}`);

  res.status(201).json({
    success: true,
    booking_id: rows[0].id,
    message: 'Free Trial Booking submitted successfully! Our coaching team will call you shortly.'
  });
}));

app.post('/api/contact-enquiries', publicFormLimiter, ah(async (req, res) => {
  const { name, phone, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  const { rows } = await query(
    `INSERT INTO contact_enquiries (name, phone, email, subject, message, status) VALUES ($1,$2,$3,$4,$5,'New') RETURNING id`,
    [name, phone || '', email, subject || 'General Enquiry', message]
  );

  await logActivity('Public Visitor', 'New Contact Enquiry', `From: ${name} (${email})`);

  res.status(201).json({
    success: true,
    enquiry_id: rows[0].id,
    message: 'Thank you for reaching out! We have received your message.'
  });
}));

// ==========================================
// 2. AUTHENTICATION API
// ==========================================

app.post('/api/auth/login', loginLimiter, ah(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
  const user = rows[0];
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });

  const validPassword = bcrypt.compareSync(password, user.password_hash);
  if (!validPassword) return res.status(401).json({ error: 'Invalid email or password' });

  const token = jwt.sign({ id: user.id, username: user.username, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

  await logActivity(user.email, 'Admin Login Successful', `Role: ${user.role}`);

  res.json({
    token,
    user: { id: user.id, username: user.username, email: user.email, role: user.role }
  });
}));

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// ==========================================
// 3. LEADS ENDPOINTS — Client Admin + Super Admin
// ==========================================

const leadsAccess = [authenticateToken, requireRole(ROLES.SUPER_ADMIN, ROLES.CLIENT_ADMIN)];

app.get('/api/admin/dashboard', ...leadsAccess, ah(async (req, res) => {
  const isSuperAdmin = req.user.role === ROLES.SUPER_ADMIN;
  const count = async (sql, params = []) => Number((await query(sql, params)).rows[0].count);

  const totalBookings = await count('SELECT COUNT(*) as count FROM trial_bookings');
  const newBookings = await count("SELECT COUNT(*) as count FROM trial_bookings WHERE status = 'New'");
  const totalEnquiries = await count('SELECT COUNT(*) as count FROM contact_enquiries');
  const newEnquiries = await count("SELECT COUNT(*) as count FROM contact_enquiries WHERE status = 'New'");
  const recentBookings = (await query('SELECT * FROM trial_bookings ORDER BY id DESC LIMIT 5')).rows;

  const payload = { totalBookings, newBookings, totalEnquiries, newEnquiries, recentBookings };

  if (isSuperAdmin) {
    payload.totalPrograms = await count('SELECT COUNT(*) as count FROM programs');
    payload.totalCoaches = await count('SELECT COUNT(*) as count FROM coaches');
    payload.totalEvents = await count('SELECT COUNT(*) as count FROM events');
    payload.totalGallery = await count('SELECT COUNT(*) as count FROM gallery');
    payload.recentLogs = (await query('SELECT * FROM activity_logs ORDER BY id DESC LIMIT 8')).rows;
  }

  res.json(payload);
}));

app.get('/api/admin/trial-bookings', ...leadsAccess, ah(async (req, res) => {
  const { status, search } = req.query;
  const conditions = [];
  const params = [];
  if (status) {
    params.push(status);
    conditions.push(`status = $${params.length}`);
  }
  if (search) {
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    conditions.push(`(athlete_name ILIKE $${params.length - 2} OR parent_phone ILIKE $${params.length - 1} OR email ILIKE $${params.length})`);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const { rows } = await query(`SELECT * FROM trial_bookings ${where} ORDER BY id DESC`, params);
  res.json(rows);
}));

app.put('/api/admin/trial-bookings/:id', ...leadsAccess, ah(async (req, res) => {
  const { status, notes } = req.body;
  await query('UPDATE trial_bookings SET status = $1, notes = $2 WHERE id = $3', [status, notes || '', req.params.id]);
  await logActivity(req.user.email, 'Updated Trial Booking Status', `ID: ${req.params.id} -> Status: ${status}`);
  res.json({ success: true });
}));

app.delete('/api/admin/trial-bookings/:id', ...leadsAccess, ah(async (req, res) => {
  await query('DELETE FROM trial_bookings WHERE id = $1', [req.params.id]);
  await logActivity(req.user.email, 'Deleted Trial Booking', `ID: ${req.params.id}`);
  res.json({ success: true });
}));

app.get('/api/admin/contact-enquiries', ...leadsAccess, ah(async (req, res) => {
  const { rows } = await query('SELECT * FROM contact_enquiries ORDER BY id DESC');
  res.json(rows);
}));

app.put('/api/admin/contact-enquiries/:id', ...leadsAccess, ah(async (req, res) => {
  const { status, notes } = req.body;
  await query('UPDATE contact_enquiries SET status = $1, notes = $2 WHERE id = $3', [status, notes || '', req.params.id]);
  await logActivity(req.user.email, 'Updated Contact Enquiry Status', `ID: ${req.params.id} -> Status: ${status}`);
  res.json({ success: true });
}));

app.delete('/api/admin/contact-enquiries/:id', ...leadsAccess, ah(async (req, res) => {
  await query('DELETE FROM contact_enquiries WHERE id = $1', [req.params.id]);
  await logActivity(req.user.email, 'Deleted Contact Enquiry', `ID: ${req.params.id}`);
  res.json({ success: true });
}));

// ==========================================
// 4. SUPER ADMIN ONLY: CONTENT, MEDIA, SYSTEM
// ==========================================

const superAdminOnly = [authenticateToken, requireRole(ROLES.SUPER_ADMIN)];

app.put('/api/admin/content', ...superAdminOnly, ah(async (req, res) => {
  const contentObj = req.body;
  for (const [key, value] of Object.entries(contentObj)) {
    await query('INSERT INTO content (key, value, updated_at) VALUES ($1,$2,NOW()) ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()', [key, String(value)]);
  }
  await logActivity(req.user.email, 'Updated Content', `Keys: ${Object.keys(contentObj).join(', ')}`);
  res.json({ success: true, message: 'Content updated successfully' });
}));

app.put('/api/admin/settings', ...superAdminOnly, ah(async (req, res) => {
  const settingsObj = req.body;
  for (const [key, value] of Object.entries(settingsObj)) {
    await query('INSERT INTO settings (key, value, updated_at) VALUES ($1,$2,NOW()) ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()', [key, String(value)]);
  }
  await logActivity(req.user.email, 'Updated Settings', `Keys: ${Object.keys(settingsObj).join(', ')}`);
  res.json({ success: true, message: 'Settings updated successfully' });
}));

function registerCrud(entity, { table, columns, insertPlaceholders, publishable = true }) {
  const base = `/api/admin/${entity}`;

  // Admin list: unlike the public GET, this returns every row (including unpublished drafts)
  app.get(base, ...superAdminOnly, ah(async (req, res) => {
    const { rows } = await query(`SELECT * FROM ${table} ORDER BY id DESC`);
    res.json(rows);
  }));

  app.post(base, ...superAdminOnly, ah(async (req, res) => {
    const values = columns.map(c => req.body[c]);
    const { rows } = await query(
      `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${insertPlaceholders}) RETURNING id`,
      values
    );
    await logActivity(req.user.email, `Created ${table}`, String(req.body[columns[0]] ?? rows[0].id));
    res.json({ success: true, id: rows[0].id });
  }));

  app.put(`${base}/:id`, ...superAdminOnly, ah(async (req, res) => {
    const cols = publishable ? [...columns, 'is_published'] : columns;
    const setClauses = cols.map((c, i) => `${c} = $${i + 1}`).join(', ');
    const values = cols.map(c => c === 'is_published' ? !!req.body.is_published : req.body[c]);
    values.push(req.params.id);
    await query(`UPDATE ${table} SET ${setClauses} WHERE id = $${values.length}`, values);
    await logActivity(req.user.email, `Updated ${table}`, `ID: ${req.params.id}`);
    res.json({ success: true });
  }));

  app.delete(`${base}/:id`, ...superAdminOnly, ah(async (req, res) => {
    await query(`DELETE FROM ${table} WHERE id = $1`, [req.params.id]);
    await logActivity(req.user.email, `Deleted ${table}`, `ID: ${req.params.id}`);
    res.json({ success: true });
  }));
}

registerCrud('programs', {
  table: 'programs',
  columns: ['name', 'age_group', 'level', 'short_desc', 'full_desc', 'image_url', 'schedule', 'duration', 'display_order'],
  insertPlaceholders: '$1,$2,$3,$4,$5,$6,$7,$8,$9'
});
registerCrud('coaches', {
  table: 'coaches',
  columns: ['name', 'position', 'photo_url', 'experience', 'specialization', 'achievements', 'bio', 'display_order'],
  insertPlaceholders: '$1,$2,$3,$4,$5,$6,$7,$8'
});
registerCrud('events', {
  table: 'events',
  columns: ['title', 'category', 'date_str', 'time_str', 'location', 'description', 'image_url', 'registration_status'],
  insertPlaceholders: '$1,$2,$3,$4,$5,$6,$7,$8'
});
registerCrud('achievements', {
  table: 'achievements',
  columns: ['title', 'category', 'year', 'count_label', 'description', 'image_url', 'display_order'],
  insertPlaceholders: '$1,$2,$3,$4,$5,$6,$7',
  publishable: false
});
registerCrud('gallery', {
  table: 'gallery',
  columns: ['title', 'category', 'media_type', 'url', 'caption', 'display_order'],
  insertPlaceholders: '$1,$2,$3,$4,$5,$6'
});
registerCrud('testimonials', {
  table: 'testimonials',
  columns: ['name', 'role_desc', 'quote', 'rating', 'photo_url'],
  insertPlaceholders: '$1,$2,$3,$4,$5'
});
registerCrud('locations', {
  table: 'locations',
  columns: ['name', 'tag_label', 'address', 'phone', 'schedule', 'maps_url', 'description', 'photo_url', 'display_order'],
  insertPlaceholders: '$1,$2,$3,$4,$5,$6,$7,$8,$9'
});
registerCrud('faqs', {
  table: 'faqs',
  columns: ['question', 'answer', 'category', 'display_order'],
  insertPlaceholders: '$1,$2,$3,$4'
});

// Media Manager: Upload File (streamed to Supabase Storage, never touches local disk)
app.post('/api/admin/media/upload', ...superAdminOnly, upload.single('file'), ah(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const ext = path.extname(req.file.originalname).toLowerCase();
  const filename = `upload-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const url = await uploadFile(filename, req.file.buffer, req.file.mimetype);
  await logActivity(req.user.email, 'Uploaded Media File', url);
  res.json({
    success: true,
    url,
    filename,
    originalName: req.file.originalname,
    size: req.file.size
  });
}));

// Media Manager: List Uploaded Files
app.get('/api/admin/media', ...superAdminOnly, ah(async (req, res) => {
  const mediaFiles = await listFiles();
  res.json(mediaFiles);
}));

// Media Manager: Delete File
app.delete('/api/admin/media/:filename', ...superAdminOnly, ah(async (req, res) => {
  const safeName = path.basename(req.params.filename);
  await deleteFile(safeName);
  await logActivity(req.user.email, 'Deleted Media File', safeName);
  res.json({ success: true });
}));

app.get('/api/admin/activity-logs', ...superAdminOnly, ah(async (req, res) => {
  const { rows } = await query('SELECT * FROM activity_logs ORDER BY id DESC LIMIT 100');
  res.json(rows);
}));

// Backup: JSON export of all content tables (Postgres has no simple file-based backup like SQLite did)
const BACKUP_TABLES = ['programs', 'coaches', 'events', 'achievements', 'gallery', 'testimonials', 'locations', 'faqs', 'content', 'settings', 'trial_bookings', 'contact_enquiries'];

app.get('/api/admin/backup', ...superAdminOnly, ah(async (req, res) => {
  const backup = { exportedAt: new Date().toISOString() };
  for (const table of BACKUP_TABLES) {
    backup[table] = (await query(`SELECT * FROM ${table}`)).rows;
  }
  await logActivity(req.user.email, 'Created Database Backup (JSON export)');
  res.setHeader('Content-Disposition', `attachment; filename="prsa-backup-${Date.now()}.json"`);
  res.json(backup);
}));

// Developer Portal: Real-time System & Database Diagnostics
app.get('/api/admin/developer/status', ...superAdminOnly, ah(async (req, res) => {
  const memory = process.memoryUsage();
  const count = async (table) => Number((await query(`SELECT COUNT(*) as count FROM ${table}`)).rows[0].count);

  const tableCounts = {};
  for (const table of [...BACKUP_TABLES, 'users', 'activity_logs']) {
    tableCounts[table] = await count(table);
  }

  const mediaFiles = await listFiles();
  const mediaCount = mediaFiles.length;
  const totalSizeBytes = mediaFiles.reduce((sum, f) => sum + (f.size || 0), 0);

  res.json({
    success: true,
    serverTime: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    nodeVersion: process.version,
    platform: process.platform,
    memory: {
      rssMB: (memory.rss / (1024 * 1024)).toFixed(2),
      heapTotalMB: (memory.heapTotal / (1024 * 1024)).toFixed(2),
      heapUsedMB: (memory.heapUsed / (1024 * 1024)).toFixed(2)
    },
    tableCounts,
    mediaCount,
    mediaSizeMB: (totalSizeBytes / (1024 * 1024)).toFixed(2)
  });
}));

// Sitemap.xml Endpoint
app.get('/sitemap.xml', (req, res) => {
  const baseUrl = req.protocol + '://' + req.get('host');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${baseUrl}/#about-philosophy</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${baseUrl}/#programs</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>${baseUrl}/#coaches</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>${baseUrl}/#trial</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
</urlset>`;
  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

app.get('/robots.txt', (req, res) => {
  const baseUrl = req.protocol + '://' + req.get('host');
  res.header('Content-Type', 'text/plain');
  res.send(`User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: ${baseUrl}/sitemap.xml`);
});

// SPA Fallback for production React router
app.get('*', (req, res) => {
  const indexPath = path.join(distDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send('PRSA Backend API Server is Running! Access API at /api/...');
  }
});

// Centralized JSON error handler — keeps the API contract JSON-only instead of Express's default HTML error page
app.use((err, req, res, next) => {
  console.error('Unhandled request error:', err);
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'Origin not allowed' });
  }
  if (err instanceof multer.MulterError || /Only image\/video/.test(err.message || '')) {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Internal server error' });
});

const isServerless = !!(process.env.VERCEL || process.env.AWS_EXECUTION_ENV || process.env.LAMBDA_TASK_ROOT);

let readyPromise = null;
export function ensureReady() {
  if (!readyPromise) {
    readyPromise = seedDatabase().catch(e => {
      console.error('DB init/seed error:', e);
      readyPromise = null;
      throw e;
    });
  }
  return readyPromise;
}

if (!isServerless) {
  ensureReady().then(() => {
    app.listen(PORT, () => {
      console.log(`\n🚀 PRSA Express Server running on http://localhost:${PORT}`);
    });
  });
}

export default app;
