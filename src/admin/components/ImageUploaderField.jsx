import React from 'react';
import { AlertCircle, Crop } from 'lucide-react';

// Reusable image field: paste-a-URL input plus an "Upload & Crop" trigger
// that hands the selected file to the caller's onSelectFile (which opens
// the shared ImageCropperModal). Used by every entity edit form.
export default function ImageUploaderField({ label, value, onChange, onSelectFile }) {
  return (
    <div className="space-y-1.5 bg-surface-container-high/50 p-3 rounded-xl border border-outline-variant/30">
      <label className="block text-on-surface-variant font-bold text-xs uppercase">{label}</label>

      {value && (
        <div className="flex items-center gap-3 py-1">
          <img
            src={value}
            alt="Preview"
            className="w-16 h-16 rounded-lg object-cover border border-primary-container/40 bg-surface-container-high"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/100x100?text=Invalid+Image';
            }}
          />
          <div className="text-[11px] text-on-surface-variant space-y-0.5">
            <div className="font-semibold text-primary">Live Photo Preview</div>
            <div className="text-[10px] text-outline break-all line-clamp-1">{value}</div>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste direct image link (.jpg, .png) or upload & crop 👉"
          className="flex-1 bg-surface-container-high text-xs p-2.5 rounded-lg border border-outline-variant/30 text-on-surface"
        />

        <label className="cursor-pointer px-3 py-2 rounded-lg bg-primary-container text-on-primary-container font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-1.5 shrink-0 shadow-md">
          <Crop className="w-3.5 h-3.5" />
          <span>Upload & Crop</span>
          <input type="file" accept="image/*" onChange={onSelectFile} className="hidden" />
        </label>
      </div>

      <div className="text-[10px] text-amber-300/90 flex items-start gap-1 pt-1">
        <AlertCircle className="w-3 h-3 shrink-0 text-amber-400 mt-0.5" />
        <span>Click <strong>Upload & Crop</strong> to open the interactive cropper to align headshots or wide banners perfectly!</span>
      </div>
    </div>
  );
}
