import { useState } from 'react';
import { uploadFile } from '../lib/apiClient';

// Shared image select -> crop -> upload-to-Supabase-Storage flow, used by both
// the Hero editor and the generic entity edit form. No Base64/localStorage
// fallback: Supabase Storage is the one reliable path now, so a failed
// upload surfaces as a real error instead of embedding a giant data URL.
export function useImageUpload(authToken) {
  const [cropTarget, setCropTarget] = useState(null); // { imageSrc, aspect, resolve, reject }
  const [uploading, setUploading] = useState(false);

  const selectAndCrop = (file, aspect = 1) => new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file selected'));
    const reader = new FileReader();
    reader.onload = () => setCropTarget({ imageSrc: reader.result, aspect, resolve, reject });
    reader.onerror = () => reject(new Error('Could not read the selected file'));
    reader.readAsDataURL(file);
  });

  const handleCropComplete = async (croppedFile) => {
    if (!cropTarget) return;
    const { resolve, reject } = cropTarget;
    setUploading(true);
    try {
      const result = await uploadFile('/api/admin/media/upload', croppedFile, authToken);
      resolve(result.url);
    } catch (err) {
      reject(err);
    } finally {
      setUploading(false);
      setCropTarget(null);
    }
  };

  const handleCropCancel = () => {
    if (cropTarget) cropTarget.reject(new Error('cancelled'));
    setCropTarget(null);
  };

  return { cropTarget, uploading, selectAndCrop, handleCropComplete, handleCropCancel };
}
