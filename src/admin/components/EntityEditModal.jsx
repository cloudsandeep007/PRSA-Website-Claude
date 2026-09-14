import React, { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import ImageUploaderField from './ImageUploaderField';
import ImageCropperModal from './ImageCropperModal';
import { useImageUpload } from '../hooks/useImageUpload';

// Generic add/edit form for every simple content entity (programs, coaches,
// events, achievements, gallery, testimonials, locations, faqs). The field
// list comes from src/admin/config/contentEntities.js — this component only
// knows how to render text/textarea/image fields, not what each entity means.
export default function EntityEditModal({ entityKey, entityConfig, item, authToken, onCancel, onSave }) {
  const [form, setForm] = useState(item);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { cropTarget, uploading, selectAndCrop, handleCropComplete, handleCropCancel } = useImageUpload(authToken);

  const setField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSelectImage = (field) => async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    try {
      const url = await selectAndCrop(file, field.aspect);
      setField(field.key, url);
    } catch (err) {
      if (err.message !== 'cancelled') setError(err.message);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    try {
      await onSave(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const isEdit = !!item.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-primary uppercase">
          {isEdit ? `Edit ${entityConfig.label}` : `Add New ${entityConfig.label}`}
        </h3>

        <div className="space-y-3 text-xs">
          {entityConfig.fields.map((field) => {
            if (field.type === 'image') {
              return (
                <ImageUploaderField
                  key={field.key}
                  label={field.label}
                  value={form[field.key]}
                  onChange={(value) => setField(field.key, value)}
                  onSelectFile={handleSelectImage(field)}
                />
              );
            }
            if (field.type === 'textarea') {
              return (
                <div key={field.key}>
                  <label className="block text-on-surface-variant font-bold mb-1">{field.label}</label>
                  <textarea
                    rows={field.rows || 3}
                    value={form[field.key] || ''}
                    onChange={(e) => setField(field.key, e.target.value)}
                    className="w-full bg-surface-container-high p-2.5 rounded border border-outline-variant/30 text-on-surface"
                  />
                </div>
              );
            }
            return (
              <div key={field.key}>
                <label className="block text-on-surface-variant font-bold mb-1">{field.label}</label>
                <input
                  type="text"
                  value={form[field.key] || ''}
                  onChange={(e) => setField(field.key, e.target.value)}
                  className="w-full bg-surface-container-high p-2.5 rounded border border-outline-variant/30 text-on-surface"
                />
              </div>
            );
          })}
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/20">
          <button onClick={onCancel} disabled={saving} className="px-4 py-2 rounded bg-surface-container-high text-xs font-bold text-on-surface disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || uploading}
            className="px-6 py-2 rounded bg-primary-container text-on-primary-container text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            <span>{saving ? 'Saving...' : 'Save Item'}</span>
          </button>
        </div>
      </div>

      {cropTarget && (
        <ImageCropperModal
          imageSrc={cropTarget.imageSrc}
          defaultAspect={cropTarget.aspect}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
}
