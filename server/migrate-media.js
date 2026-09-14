import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from './db.js';
import { uploadFile, listFiles } from './storage.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');

const EXT_CONTENT_TYPE = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.gif': 'image/gif',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime'
};

async function migrateFiles() {
  if (!fs.existsSync(uploadsDir)) {
    console.log('No local uploads directory found, nothing to migrate.');
    return {};
  }

  const existingRemote = new Set((await listFiles()).map(f => f.filename));
  const localFiles = await fs.promises.readdir(uploadsDir);
  const urlMap = {}; // '/uploads/filename.jpg' -> supabase public URL

  for (const filename of localFiles) {
    const localPath = path.join(uploadsDir, filename);
    const oldUrl = `/uploads/${filename}`;

    if (existingRemote.has(filename)) {
      console.log(`Already migrated, skipping upload: ${filename}`);
      const { getPublicUrl } = await import('./storage.js');
      urlMap[oldUrl] = getPublicUrl(filename);
      continue;
    }

    const buffer = await fs.promises.readFile(localPath);
    const contentType = EXT_CONTENT_TYPE[path.extname(filename).toLowerCase()] || 'application/octet-stream';
    console.log(`Uploading ${filename} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)...`);
    const url = await uploadFile(filename, buffer, contentType);
    urlMap[oldUrl] = url;
  }

  return urlMap;
}

async function rewriteReferences(urlMap) {
  const oldUrls = Object.keys(urlMap);
  if (oldUrls.length === 0) return;

  // content/settings: TEXT values that may contain a bare /uploads/... path, or a JSON array of them (hero_slideshow_urls)
  const { rows: contentRows } = await query('SELECT key, value FROM content');
  for (const row of contentRows) {
    let newValue = row.value;
    for (const oldUrl of oldUrls) {
      if (newValue.includes(oldUrl)) {
        newValue = newValue.split(oldUrl).join(urlMap[oldUrl]);
      }
    }
    if (newValue !== row.value) {
      await query('UPDATE content SET value = $1 WHERE key = $2', [newValue, row.key]);
      console.log(`Updated content.${row.key}`);
    }
  }

  const tablesAndColumns = [
    ['programs', 'image_url'],
    ['coaches', 'photo_url'],
    ['events', 'image_url'],
    ['achievements', 'image_url'],
    ['gallery', 'url'],
    ['testimonials', 'photo_url'],
    ['locations', 'photo_url']
  ];

  for (const [table, column] of tablesAndColumns) {
    for (const oldUrl of oldUrls) {
      const { rowCount } = await query(
        `UPDATE ${table} SET ${column} = $1 WHERE ${column} = $2`,
        [urlMap[oldUrl], oldUrl]
      );
      if (rowCount > 0) console.log(`Updated ${rowCount} row(s) in ${table}.${column} (${oldUrl})`);
    }
  }
}

async function main() {
  console.log('Migrating local /public/uploads files to Supabase Storage...');
  const urlMap = await migrateFiles();
  console.log(`Uploaded/mapped ${Object.keys(urlMap).length} files.`);
  console.log('Rewriting database references...');
  await rewriteReferences(urlMap);
  console.log('Media migration complete.');
}

main().then(() => process.exit(0)).catch(err => {
  console.error('Media migration failed:', err);
  process.exit(1);
});
