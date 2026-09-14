import { StorageClient } from '@supabase/storage-js';

const BUCKET = process.env.SUPABASE_MEDIA_BUCKET || 'media';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required for media storage.');
}

const storageUrl = `${process.env.SUPABASE_URL.replace(/\/$/, '')}/storage/v1`;
const storage = new StorageClient(storageUrl, {
  apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
});

let bucketReady = null;
export async function ensureBucket() {
  if (!bucketReady) {
    bucketReady = (async () => {
      const { data: buckets, error } = await storage.listBuckets();
      if (error) throw error;
      if (!buckets.some(b => b.name === BUCKET)) {
        const { error: createError } = await storage.createBucket(BUCKET, {
          public: true,
          fileSizeLimit: '15MB'
        });
        if (createError && !/already exists/i.test(createError.message)) throw createError;
      }
    })();
  }
  return bucketReady;
}

export async function uploadFile(filename, buffer, contentType) {
  await ensureBucket();
  const { error } = await storage.from(BUCKET).upload(filename, buffer, {
    contentType,
    upsert: false
  });
  if (error) throw error;
  return getPublicUrl(filename);
}

export function getPublicUrl(filename) {
  const { data } = storage.from(BUCKET).getPublicUrl(filename);
  return data.publicUrl;
}

export async function listFiles() {
  await ensureBucket();
  const { data, error } = await storage.from(BUCKET).list('', {
    limit: 1000,
    sortBy: { column: 'created_at', order: 'desc' }
  });
  if (error) throw error;
  return data
    .filter(f => f.id) // skip folder placeholder entries
    .map(f => ({
      filename: f.name,
      url: getPublicUrl(f.name),
      size: f.metadata?.size ?? 0,
      created_at: f.created_at
    }));
}

export async function deleteFile(filename) {
  await ensureBucket();
  const { error } = await storage.from(BUCKET).remove([filename]);
  if (error) throw error;
}

export default storage;
