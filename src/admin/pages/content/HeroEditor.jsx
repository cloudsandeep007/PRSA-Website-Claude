import React, { useState } from 'react';
import { Save, Plus, Trash2, CheckCircle2, Image as ImageIcon, Layers, AlertCircle, Crop, Film, Play, Sliders, Loader2 } from 'lucide-react';
import ImageCropperModal from '../../components/ImageCropperModal';
import { apiRequest, uploadFile } from '../../lib/apiClient';
import { useImageUpload } from '../../hooks/useImageUpload';
import { mediaUrl } from '../../../lib/media';

function parseSlideshow(raw) {
  if (!raw) return [mediaUrl('prsa_media_10.jpg'), mediaUrl('prsa_media_02.jpg'), mediaUrl('prsa_media_01.jpg')];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {
    if (typeof raw === 'string') return raw.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
}

export default function HeroEditor({ content, onContentChange, authToken }) {
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const { cropTarget, uploading, selectAndCrop, handleCropComplete, handleCropCancel } = useImageUpload(authToken);

  const set = (patch) => onContentChange({ ...content, ...patch });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedMsg('');
    setErrMsg('');
    try {
      await apiRequest('/api/admin/content', { method: 'PUT', authToken, body: content });
      setSavedMsg('✅ Homepage Hero content saved and is now live!');
      setTimeout(() => setSavedMsg(''), 5000);
    } catch (err) {
      setErrMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageFieldUpload = (fieldName, aspect) => async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    try {
      const url = await selectAndCrop(file, aspect);
      set({ [fieldName]: url });
    } catch (err) {
      if (err.message !== 'cancelled') setErrMsg(err.message);
    }
  };

  const handleAddSlideshowImage = async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    try {
      const url = await selectAndCrop(file, 16 / 9);
      const updated = [...currentSlideshow, url];
      set({ hero_slideshow_urls: JSON.stringify(updated) });
    } catch (err) {
      if (err.message !== 'cancelled') setErrMsg(err.message);
    }
  };

  const handleRemoveSlideshowImage = (indexToRemove) => {
    const updated = currentSlideshow.filter((_, idx) => idx !== indexToRemove);
    set({ hero_slideshow_urls: JSON.stringify(updated) });
  };

  const handleDirectVideoUpload = async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;

    setUploadingVideo(true);
    setErrMsg('');
    try {
      const result = await uploadFile('/api/admin/media/upload', file, authToken);
      set({ hero_video_url: result.url, hero_type: 'video' });
    } catch (err) {
      setErrMsg(`Video upload failed: ${err.message}`);
    } finally {
      setUploadingVideo(false);
    }
  };

  const currentSlideshow = parseSlideshow(content.hero_slideshow_urls);

  return (
    <form onSubmit={handleSave} className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 space-y-6">
      {savedMsg && (
        <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2 border border-emerald-500/40">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{savedMsg}</span>
        </div>
      )}

      <div className="bg-surface-container-high/40 p-4 rounded-xl border border-primary-container/30 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-primary flex items-center gap-2">
            <Sliders className="w-4 h-4 text-primary-container" />
            <span>HERO BACKGROUND DISPLAY TYPE</span>
          </label>
          <span className="text-[10px] text-on-surface-variant">Choose how the background of your homepage hero renders</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => set({ hero_type: 'photo' })}
            className={`p-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              (content.hero_type || 'photo') === 'photo'
                ? 'bg-primary-container text-on-primary-container border-primary-container shadow-lg'
                : 'bg-surface-container-low text-on-surface border-outline-variant/30 hover:border-primary-container/50'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Single Static Photo</span>
          </button>

          <button
            type="button"
            onClick={() => set({ hero_type: 'video' })}
            className={`p-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              content.hero_type === 'video'
                ? 'bg-primary-container text-on-primary-container border-primary-container shadow-lg'
                : 'bg-surface-container-low text-on-surface border-outline-variant/30 hover:border-primary-container/50'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Background Video</span>
          </button>

          <button
            type="button"
            onClick={() => set({ hero_type: 'slideshow' })}
            className={`p-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              content.hero_type === 'slideshow'
                ? 'bg-primary-container text-on-primary-container border-primary-container shadow-lg'
                : 'bg-surface-container-low text-on-surface border-outline-variant/30 hover:border-primary-container/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Photo Slideshow (Carousel)</span>
          </button>
        </div>

        {(content.hero_type || 'photo') === 'photo' && (
          <div className="pt-2 space-y-2">
            <label className="text-xs font-bold text-on-surface-variant block">SINGLE HERO BACKGROUND IMAGE</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={content.hero_bg_image || ''}
                onChange={(e) => set({ hero_bg_image: e.target.value })}
                placeholder={mediaUrl('prsa_media_10.jpg')}
                className="flex-1 bg-surface-container-high text-xs p-3 rounded-lg border border-outline-variant/30 text-on-surface"
              />
              <label className="cursor-pointer px-4 py-3 rounded-lg bg-primary-container text-on-primary-container font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-md">
                <Crop className="w-4 h-4" />
                <span>Upload & Crop Banner</span>
                <input type="file" accept="image/*" onChange={handleImageFieldUpload('hero_bg_image', 16 / 9)} className="hidden" />
              </label>
            </div>
          </div>
        )}

        {content.hero_type === 'video' && (
          <div className="pt-2 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-on-surface-variant block">BACKGROUND VIDEO URL (.MP4 File, YouTube URL, or Uploaded Video)</label>
              <span className="text-[10px] text-primary font-bold">💡 Tip: Use YouTube links or Video Presets for 100% cross-device compatibility</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pb-1 bg-surface-container-high/40 p-2.5 rounded-xl border border-outline-variant/30">
              <span className="text-[10px] font-extrabold text-on-surface-variant uppercase">1-Click HD Video Presets:</span>
              <button
                type="button"
                onClick={() => set({ hero_video_url: 'https://assets.mixkit.co/videos/preview/mixkit-skaters-racing-on-an-outdoor-rink-41561-large.mp4', hero_type: 'video' })}
                className="px-2.5 py-1 rounded-lg bg-surface-container-high text-primary font-semibold text-[11px] border border-outline-variant/30 hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center gap-1 shadow-sm"
              >
                <Play className="w-3 h-3 text-cyan-400" />
                <span>⚡ Speed Racing HD Preset</span>
              </button>
              <button
                type="button"
                onClick={() => set({ hero_video_url: 'https://assets.mixkit.co/videos/preview/mixkit-roller-skater-performing-tricks-in-a-skate-park-42777-large.mp4', hero_type: 'video' })}
                className="px-2.5 py-1 rounded-lg bg-surface-container-high text-primary font-semibold text-[11px] border border-outline-variant/30 hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center gap-1 shadow-sm"
              >
                <Play className="w-3 h-3 text-cyan-400" />
                <span>🏁 Slalom Agility HD Preset</span>
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={content.hero_video_url || ''}
                onChange={(e) => set({ hero_video_url: e.target.value })}
                placeholder="Paste MP4 link, YouTube URL (e.g. https://www.youtube.com/watch?v=...), or click Upload 👉"
                className="flex-1 bg-surface-container-high text-xs p-3 rounded-lg border border-outline-variant/30 text-on-surface"
              />
              <label className="cursor-pointer px-4 py-3 rounded-lg bg-primary-container text-on-primary-container font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-md hover:bg-cyan-400">
                <Loader2 className={`w-4 h-4 ${uploadingVideo ? 'animate-spin' : 'hidden'}`} />
                <span>{uploadingVideo ? 'Uploading Video...' : 'Upload Video File'}</span>
                <input type="file" accept="video/*" onChange={handleDirectVideoUpload} className="hidden" disabled={uploadingVideo} />
              </label>
            </div>

            {content.hero_video_url && (
              <div className="mt-2 p-3 bg-black/60 rounded-xl border border-primary-container/40 space-y-2">
                <div className="text-[11px] text-primary font-bold flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-primary-container" />
                  <span>Attached Hero Video Preview</span>
                </div>
                {content.hero_video_url.includes('youtube.com') || content.hero_video_url.includes('youtu.be') ? (
                  <div className="text-xs text-amber-300 font-semibold p-2 bg-amber-500/10 rounded-lg border border-amber-500/30">
                    📺 YouTube Video URL attached! YouTube video will auto-play muted seamlessly in the background on your live website.
                  </div>
                ) : (
                  <video src={content.hero_video_url} controls muted className="w-full max-h-48 rounded-lg object-contain bg-black" />
                )}
              </div>
            )}

            <div className="text-[10px] text-cyan-300">
              ℹ️ The background video automatically loops on mute. Make sure to click <strong>"Save Homepage Hero Changes"</strong> below to push live!
            </div>
          </div>
        )}

        {content.hero_type === 'slideshow' && (
          <div className="pt-2 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-on-surface-variant block">SLIDESHOW IMAGES ({currentSlideshow.length})</label>
              <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container font-bold text-xs flex items-center gap-1.5 shadow-md">
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Photo to Slideshow</span>
                <input type="file" accept="image/*" onChange={handleAddSlideshowImage} className="hidden" />
              </label>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {currentSlideshow.map((imgUrl, sIdx) => (
                <div key={sIdx} className="relative group bg-surface-container-high rounded-xl overflow-hidden border border-outline-variant/30">
                  <img src={imgUrl} alt={`Slide ${sIdx + 1}`} className="w-full h-24 object-cover" />
                  <div className="absolute top-1 left-1 bg-black/70 text-white font-bold text-[9px] px-1.5 py-0.5 rounded">
                    Slide {sIdx + 1}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSlideshowImage(sIdx)}
                    className="absolute top-1 right-1 p-1 rounded bg-red-500/80 text-white hover:bg-red-600 transition-all opacity-90 group-hover:opacity-100"
                    title="Remove Slide"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-on-surface-variant block mb-1">TOP STATUS BADGE</label>
          <input type="text" value={content.hero_badge || ''} onChange={(e) => set({ hero_badge: e.target.value })} className="w-full bg-surface-container-high text-xs p-3 rounded-lg border border-outline-variant/30 text-on-surface" />
        </div>
        <div>
          <label className="text-xs font-bold text-on-surface-variant block mb-1">LOCATION CORRIDOR BADGE</label>
          <input type="text" value={content.hero_sub_badge || ''} onChange={(e) => set({ hero_sub_badge: e.target.value })} className="w-full bg-surface-container-high text-xs p-3 rounded-lg border border-outline-variant/30 text-on-surface" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-on-surface-variant block mb-1">HERO HEADLINE PART 1</label>
          <input type="text" value={content.hero_title_1 || ''} onChange={(e) => set({ hero_title_1: e.target.value })} className="w-full bg-surface-container-high text-xs p-3 rounded-lg border border-outline-variant/30 text-on-surface" />
        </div>
        <div>
          <label className="text-xs font-bold text-on-surface-variant block mb-1">HERO HEADLINE PART 2 (GLOW TEXT)</label>
          <input type="text" value={content.hero_title_2 || ''} onChange={(e) => set({ hero_title_2: e.target.value })} className="w-full bg-surface-container-high text-xs p-3 rounded-lg border border-outline-variant/30 text-on-surface" />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-on-surface-variant block mb-1">HERO DESCRIPTION</label>
        <textarea rows={3} value={content.hero_description || ''} onChange={(e) => set({ hero_description: e.target.value })} className="w-full bg-surface-container-high text-xs p-3 rounded-lg border border-outline-variant/30 text-on-surface" />
      </div>

      <div className="pt-2 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="px-6 py-3.5 rounded-xl bg-primary-container text-on-primary-container font-bold text-xs shadow-lg hover:shadow-cyan-500/50 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-on-primary-container" />
              <span>Saving Hero Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Homepage Hero Changes</span>
            </>
          )}
        </button>

        {errMsg && (
          <div className="px-4 py-3 rounded-xl bg-red-500/20 text-red-300 text-xs font-bold flex items-center gap-2 border border-red-500/40">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errMsg}</span>
          </div>
        )}
      </div>

      {cropTarget && (
        <ImageCropperModal
          imageSrc={cropTarget.imageSrc}
          defaultAspect={cropTarget.aspect}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </form>
  );
}
