import React, { useEffect, useState } from 'react';
import { Upload, Copy, Trash2, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';

export default function MediaLibrary({ authToken }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState('');
  const [pendingDeleteFilename, setPendingDeleteFilename] = useState(null);

  async function fetchMedia() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/media', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        const json = await res.json();
        setMedia(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMedia();
  }, [authToken]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: formData
      });
      if (res.ok) {
        fetchMedia();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(''), 3000);
  };

  const confirmDelete = async () => {
    const filename = pendingDeleteFilename;
    setPendingDeleteFilename(null);
    try {
      const res = await fetch(`/api/admin/media/${filename}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) fetchMedia();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-primary">Media Library</h2>
          <p className="text-xs text-on-surface-variant">Upload photos and videos to use anywhere across the website</p>
        </div>

        <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-bold text-xs shadow-md hover:shadow-cyan-500/40 transition-all flex items-center gap-2">
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
          <input type="file" onChange={handleFileUpload} accept="image/*,video/*" className="hidden" />
        </label>
      </div>

      {copiedUrl && (
        <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2 border border-emerald-500/40">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>URL copied to clipboard: {copiedUrl}</span>
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-xs text-outline">Loading media library...</div>
      ) : media.length === 0 ? (
        <div className="p-8 text-center text-xs text-outline">No media files uploaded yet.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media.map((file) => (
            <div
              key={file.filename}
              className="bg-surface-container-low rounded-xl border border-outline-variant/30 overflow-hidden space-y-2 p-2 group relative"
            >
              <div className="h-32 rounded-lg bg-surface-container-high overflow-hidden flex items-center justify-center">
                <img
                  src={file.url}
                  alt={file.filename}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-on-surface truncate block">{file.filename}</span>
                <span className="text-[10px] text-outline block">{(file.size / 1024).toFixed(0)} KB</span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20">
                <button
                  onClick={() => handleCopy(file.url)}
                  className="p-1.5 rounded bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary text-[10px] font-bold flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> Copy URL
                </button>
                <button
                  onClick={() => setPendingDeleteFilename(file.filename)}
                  className="p-1.5 rounded text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pendingDeleteFilename !== null && (
        <ConfirmDialog
          title="Delete this file?"
          message={`${pendingDeleteFilename} will be permanently removed from storage.`}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDeleteFilename(null)}
        />
      )}
    </div>
  );
}
