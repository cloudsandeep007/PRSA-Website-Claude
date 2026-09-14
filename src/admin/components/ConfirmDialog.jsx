import React from 'react';
import { AlertTriangle } from 'lucide-react';

// In-app replacement for window.confirm(): native confirm() dialogs behave
// unreliably in some browser contexts (auto-dismissed or suppressed), so
// every destructive action in the admin UI uses this instead.
export default function ConfirmDialog({ title = 'Are you sure?', message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl max-w-sm w-full p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-primary">{title}</h3>
        </div>

        {message && <p className="text-xs text-on-surface-variant">{message}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onCancel} className="px-4 py-2 rounded bg-surface-container-high text-xs font-bold text-on-surface">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-500/90 hover:bg-red-500 text-white text-xs font-bold">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
