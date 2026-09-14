// Thin fetch wrapper shared by all admin pages: attaches the auth header,
// serializes JSON bodies, and throws on failure instead of letting callers
// silently treat a failed request as a success.
export async function apiRequest(url, { method = 'GET', authToken, body } = {}) {
  const res = await fetch(url, {
    method,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
    },
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // no/invalid JSON body — fine for e.g. a 204, but not for an error we need to report
  }

  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data;
}

export async function uploadFile(url, file, authToken) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${authToken}` },
    body: formData
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {}

  if (!res.ok) {
    throw new Error(data?.error || `Upload failed (${res.status})`);
  }
  return data;
}
