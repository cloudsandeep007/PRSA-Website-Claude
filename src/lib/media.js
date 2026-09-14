// Base URL for the Supabase Storage "media" bucket. Used only for hardcoded
// fallback/placeholder assets (default images before API data loads, or admin
// "new item" defaults) — real content comes from the database via the API.
export const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_BASE_URL || '';

export function mediaUrl(filename) {
  return `${MEDIA_BASE_URL}/${filename}`;
}
