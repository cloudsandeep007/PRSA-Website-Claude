import React, { useEffect, useState } from 'react';
import { Save, Plus, Trash2, Edit3, CheckCircle2, Eye, FileText, Image as ImageIcon, Layers, MapPin, Award, Calendar, HelpCircle, Star, Users, Upload, AlertCircle, Crop, Film, Play, Sliders, Loader2 } from 'lucide-react';
import ImageCropperModal from '../components/ImageCropperModal';

export default function ContentManager({ authToken }) {
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [savedMsg, setSavedMsg] = useState('');
  const [savingHero, setSavingHero] = useState(false);
  const [heroErrMsg, setHeroErrMsg] = useState('');

  // Data states
  const [contentMap, setContentMap] = useState({});
  const [programs, setPrograms] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [events, setEvents] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [locations, setLocations] = useState([]);
  const [faqs, setFaqs] = useState([]);

  // Modal / Form Edit states
  const [editItem, setEditItem] = useState(null);
  const [editType, setEditType] = useState('');

  // Image Cropper Modal State
  const [cropTarget, setCropTarget] = useState(null); // { imageSrc, fieldName, defaultAspect, isSlideshowAdd }
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const safeFetchJson = async (url, fallback = []) => {
    try {
      const cacheBuster = url.includes('?') ? `&t=${Date.now()}` : `?t=${Date.now()}`;
      const res = await fetch(url + cacheBuster);
      if (res.ok) {
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch (e) {
          return fallback;
        }
      }
      return fallback;
    } catch (e) {
      return fallback;
    }
  };

  const syncListToLocalStorage = (type, list) => {
    try {
      localStorage.setItem(`prsa_live_${type}`, JSON.stringify(list));
      window.dispatchEvent(new Event('prsa_content_updated'));
    } catch (e) {
      console.warn(`LocalStorage sync warning for ${type}:`, e);
    }
  };

  async function loadAllContent() {
    setLoading(true);
    try {
      const [
        resContent,
        resProg,
        resCoach,
        resEvt,
        resAch,
        resGal,
        resTest,
        resLoc,
        resFaq
      ] = await Promise.all([
        safeFetchJson('/api/content', {}),
        safeFetchJson('/api/programs', []),
        safeFetchJson('/api/coaches', []),
        safeFetchJson('/api/events', []),
        safeFetchJson('/api/achievements', []),
        safeFetchJson('/api/gallery', []),
        safeFetchJson('/api/testimonials', []),
        safeFetchJson('/api/locations', []),
        safeFetchJson('/api/faqs', [])
      ]);

      let localContent = {};
      try {
        const rawContent = localStorage.getItem('prsa_live_content');
        if (rawContent) localContent = JSON.parse(rawContent);
      } catch (e) {}

      setContentMap({ ...(resContent || {}), ...localContent });

      const getLocalOrApi = (type, apiData) => {
        try {
          const raw = localStorage.getItem(`prsa_live_${type}`);
          if (raw) return JSON.parse(raw);
        } catch (e) {}
        return apiData || [];
      };

      setPrograms(getLocalOrApi('programs', resProg));
      setCoaches(getLocalOrApi('coaches', resCoach));
      setEvents(getLocalOrApi('events', resEvt));
      setAchievements(getLocalOrApi('achievements', resAch));
      setGallery(getLocalOrApi('gallery', resGal));
      setTestimonials(getLocalOrApi('testimonials', resTest));
      setLocations(getLocalOrApi('locations', resLoc));
      setFaqs(getLocalOrApi('faqs', resFaq));
    } catch (err) {
      console.error('Error loading content:', err);
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadAllContent();
  }, []);

  const handleSaveHeroContent = async (e) => {
    if (e) e.preventDefault();
    setSavedMsg('');
    setHeroErrMsg('');
    setSavingHero(true);

    try {
      // 1. Sanitize contentMap for localStorage to prevent QuotaExceededError when huge Base64 video is attached
      const cleanContent = { ...contentMap };
      if (cleanContent.hero_video_url && cleanContent.hero_video_url.length > 200000) {
        try {
          sessionStorage.setItem('prsa_huge_hero_video', cleanContent.hero_video_url);
        } catch (sErr) {}
        cleanContent.hero_video_url = 'SESSION_VIDEO';
      }

      try {
        localStorage.setItem('prsa_live_content', JSON.stringify(cleanContent));
        window.dispatchEvent(new Event('prsa_content_updated'));
      } catch (lErr) {
        console.warn('LocalStorage quota notice:', lErr);
      }

      // 2. Prepare payload for Vercel API (ensure payload stays safely under 3MB Vercel HTTP limit)
      const payloadMap = { ...contentMap };
      if (payloadMap.hero_video_url && payloadMap.hero_video_url.length > 2500000) {
        payloadMap.hero_video_url = 'SESSION_VIDEO';
      }

      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(payloadMap)
      });

      if (res.ok) {
        setSavedMsg('✅ Homepage Hero content saved and updated live!');
        setTimeout(() => setSavedMsg(''), 5000);
      } else {
        if (res.status === 401 || res.status === 403) {
          setHeroErrMsg('⚠️ Session notice: Saved locally in browser! (Log in again to push to remote DB)');
        } else {
          setSavedMsg('✅ Saved locally in browser & updated live!');
        }
      }
    } catch (err) {
      console.warn('API error, saved to browser storage:', err);
      setSavedMsg('✅ Saved locally in browser & updated live!');
    } finally {
      setSavingHero(false);
    }
  };

  // Trigger cropper when file selected
  const handleSelectFileToCrop = (e, fieldName, defaultAspect = 1, isSlideshowAdd = false) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropTarget({
        imageSrc: reader.result,
        fieldName,
        defaultAspect,
        isSlideshowAdd
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Upload video file directly
  const handleDirectVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Warning for very large files (>20MB)
    if (file.size > 20 * 1024 * 1024) {
      alert("Note: Video files over 20MB may take a few moments to process. Consider compressing or using a YouTube link if slow.");
    }

    setUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: formData
      });
      if (res.ok) {
        const json = await res.json();
        setContentMap(prev => ({ ...prev, hero_video_url: json.url, hero_type: 'video' }));
      } else {
        // Fallback for Vercel serverless read-only filesystem: Convert video file to Base64 Data URL
        const base64Url = await fileToBase64(file);
        setContentMap(prev => ({ ...prev, hero_video_url: base64Url, hero_type: 'video' }));
      }
    } catch (err) {
      console.warn('Disk upload endpoint failed for video. Falling back to Base64 Data URL for Vercel:', err);
      try {
        const base64Url = await fileToBase64(file);
        setContentMap(prev => ({ ...prev, hero_video_url: base64Url, hero_type: 'video' }));
      } catch (bErr) {
        console.error('Failed to convert video to Base64:', bErr);
      }
    } finally {
      setUploadingVideo(false);
      e.target.value = '';
    }
  };

  // Helper to convert file to Base64 Data URL for Vercel database storage
  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  // Called when user completes crop in ImageCropperModal
  const handleCroppedImageUpload = async (croppedFile) => {
    if (!cropTarget) return;
    const { fieldName, isSlideshowAdd } = cropTarget;

    let finalImageUrl = '';

    try {
      const formData = new FormData();
      formData.append('file', croppedFile);

      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: formData
      });

      if (res.ok) {
        const json = await res.json();
        finalImageUrl = json.url;
      } else {
        // Fallback for Vercel serverless read-only filesystem: Convert to Base64 Data URL
        finalImageUrl = await fileToBase64(croppedFile);
      }
    } catch (err) {
      console.warn('Disk upload endpoint unavailable. Falling back to embedded Base64 image string for Vercel:', err);
      finalImageUrl = await fileToBase64(croppedFile);
    }

    if (finalImageUrl) {
      if (isSlideshowAdd) {
        let currentList = [];
        try {
          currentList = JSON.parse(contentMap.hero_slideshow_urls || '[]');
        } catch (e) {
          currentList = ["https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_10.jpg"];
        }
        const updatedList = [...currentList, finalImageUrl];
        setContentMap(prev => ({ ...prev, hero_slideshow_urls: JSON.stringify(updatedList) }));
      } else if (editItem) {
        setEditItem(prev => ({ ...prev, [fieldName]: finalImageUrl }));
      } else {
        setContentMap(prev => ({ ...prev, [fieldName]: finalImageUrl }));
      }
    }

    setCropTarget(null);
  };


  // Remove photo from Hero Slideshow list
  const handleRemoveSlideshowImage = (indexToRemove) => {
    let currentList = [];
    try {
      currentList = JSON.parse(contentMap.hero_slideshow_urls || '[]');
    } catch (e) {
      currentList = ["https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_10.jpg", "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_02.jpg"];
    }
    const updatedList = currentList.filter((_, idx) => idx !== indexToRemove);
    setContentMap(prev => ({ ...prev, hero_slideshow_urls: JSON.stringify(updatedList) }));
  };

  const handleSaveItem = async (type, itemData) => {
    const isEdit = !!itemData.id;
    const url = isEdit ? `/api/admin/${type}/${itemData.id}` : `/api/admin/${type}`;
    const method = isEdit ? 'PUT' : 'POST';

    // Optimistic local state update & persistence
    let updatedList = [];
    const getSetter = (t) => {
      if (t === 'coaches') return setCoaches;
      if (t === 'programs') return setPrograms;
      if (t === 'events') return setEvents;
      if (t === 'achievements') return setAchievements;
      if (t === 'gallery') return setGallery;
      if (t === 'testimonials') return setTestimonials;
      if (t === 'locations') return setLocations;
      if (t === 'faqs') return setFaqs;
      return null;
    };

    const setter = getSetter(type);
    if (setter) {
      setter(prev => {
        if (isEdit) {
          updatedList = prev.map(item => String(item.id) === String(itemData.id) ? { ...item, ...itemData } : item);
        } else {
          const newId = itemData.id || (Date.now());
          updatedList = [{ ...itemData, id: newId }, ...prev];
        }
        syncListToLocalStorage(type, updatedList);
        return updatedList;
      });
    }

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(itemData)
      });
      if (res.ok) {
        setEditItem(null);
      } else {
        console.warn(`Server status ${res.status}, saved to live browser storage.`);
        setEditItem(null);
      }
    } catch (err) {
      console.warn(`Server unavailable, saved to live browser storage:`, err);
      setEditItem(null);
    }
  };

  const handleDeleteItem = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this item?`)) return;

    // Immediate Optimistic UI & LocalStorage Removal
    let newList = [];
    if (type === 'coaches') setCoaches(prev => { newList = prev.filter(c => String(c.id) !== String(id)); syncListToLocalStorage(type, newList); return newList; });
    else if (type === 'programs') setPrograms(prev => { newList = prev.filter(p => String(p.id) !== String(id)); syncListToLocalStorage(type, newList); return newList; });
    else if (type === 'events') setEvents(prev => { newList = prev.filter(e => String(e.id) !== String(id)); syncListToLocalStorage(type, newList); return newList; });
    else if (type === 'achievements') setAchievements(prev => { newList = prev.filter(a => String(a.id) !== String(id)); syncListToLocalStorage(type, newList); return newList; });
    else if (type === 'gallery') setGallery(prev => { newList = prev.filter(g => String(g.id) !== String(id)); syncListToLocalStorage(type, newList); return newList; });
    else if (type === 'testimonials') setTestimonials(prev => { newList = prev.filter(t => String(t.id) !== String(id)); syncListToLocalStorage(type, newList); return newList; });
    else if (type === 'locations') setLocations(prev => { newList = prev.filter(l => String(l.id) !== String(id)); syncListToLocalStorage(type, newList); return newList; });
    else if (type === 'faqs') setFaqs(prev => { newList = prev.filter(f => String(f.id) !== String(id)); syncListToLocalStorage(type, newList); return newList; });

    try {
      await fetch(`/api/admin/${type}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
    } catch (err) {
      console.warn('API delete warning:', err);
    }
  };

  const tabs = [
    { id: 'hero', name: 'Homepage & Hero' },
    { id: 'programs', name: `Programs (${programs.length})` },
    { id: 'coaches', name: `Coaches (${coaches.length})` },
    { id: 'events', name: `Events (${events.length})` },
    { id: 'achievements', name: `Achievements (${achievements.length})` },
    { id: 'gallery', name: `Gallery (${gallery.length})` },
    { id: 'testimonials', name: `Testimonials (${testimonials.length})` },
    { id: 'locations', name: `Locations (${locations.length})` },
    { id: 'faqs', name: `FAQs (${faqs.length})` },
  ];

  // Helper render for photo/image upload input in edit modals with Cropper trigger
  const renderImageUploaderField = (label, fieldName, currentUrl, defaultAspect = 1) => (
    <div className="space-y-1.5 bg-surface-container-high/50 p-3 rounded-xl border border-outline-variant/30">
      <label className="block text-on-surface-variant font-bold text-xs uppercase">{label}</label>

      {/* Image Preview Thumbnail */}
      {currentUrl && (
        <div className="flex items-center gap-3 py-1">
          <img
            src={currentUrl}
            alt="Preview"
            className="w-16 h-16 rounded-lg object-cover border border-primary-container/40 bg-surface-container-high"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/100x100?text=Invalid+Image';
            }}
          />
          <div className="text-[11px] text-on-surface-variant space-y-0.5">
            <div className="font-semibold text-primary">Live Photo Preview</div>
            <div className="text-[10px] text-outline break-all line-clamp-1">{currentUrl}</div>
          </div>
        </div>
      )}

      {/* Upload File & Crop Trigger */}
      <div className="flex gap-2">
        <input
          type="text"
          value={currentUrl || ''}
          onChange={(e) => setEditItem({ ...editItem, [fieldName]: e.target.value })}
          placeholder="Paste direct image link (.jpg, .png) or upload & crop 👉"
          className="flex-1 bg-surface-container-high text-xs p-2.5 rounded-lg border border-outline-variant/30 text-on-surface"
        />

        <label className="cursor-pointer px-3 py-2 rounded-lg bg-primary-container text-on-primary-container font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-1.5 shrink-0 shadow-md">
          <Crop className="w-3.5 h-3.5" />
          <span>Upload & Crop</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleSelectFileToCrop(e, fieldName, defaultAspect)}
            className="hidden"
          />
        </label>
      </div>

      {/* Guidance Tip */}
      <div className="text-[10px] text-amber-300/90 flex items-start gap-1 pt-1">
        <AlertCircle className="w-3 h-3 shrink-0 text-amber-400 mt-0.5" />
        <span>
          Click <strong>Upload & Crop</strong> to open the interactive cropper to align headshots or wide banners perfectly!
        </span>
      </div>
    </div>
  );

  // Parse current slideshow array
  let currentSlideshow = ["https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_10.jpg", "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_02.jpg", "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_01.jpg"];
  if (contentMap.hero_slideshow_urls) {
    try {
      const parsed = JSON.parse(contentMap.hero_slideshow_urls);
      if (Array.isArray(parsed)) currentSlideshow = parsed;
    } catch (e) {
      if (typeof contentMap.hero_slideshow_urls === 'string') {
        currentSlideshow = contentMap.hero_slideshow_urls.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
  }

  if (loading) return <div className="text-xs text-primary p-4">Loading CMS Content...</div>;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-primary">Website Content Management System</h2>
          <p className="text-xs text-on-surface-variant">Visual non-coder CMS for updating headlines, programs, coaches, events, gallery, and text</p>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-surface-container-high text-xs text-primary font-bold hover:bg-primary hover:text-on-primary transition-all flex items-center gap-1.5 shrink-0"
        >
          <Eye className="w-4 h-4" />
          <span>Preview Live Website</span>
        </a>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-outline-variant/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl font-label-uppercase text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-primary-container text-on-primary-container shadow-md'
                : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* 1. HOMEPAGE & HERO CMS */}
      {activeTab === 'hero' && (
        <form onSubmit={handleSaveHeroContent} className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 space-y-6">
          {savedMsg && (
            <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2 border border-emerald-500/40">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{savedMsg}</span>
            </div>
          )}

          {/* DYNAMIC HERO MEDIA TYPE SELECTOR */}
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
                onClick={() => setContentMap({ ...contentMap, hero_type: 'photo' })}
                className={`p-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  (contentMap.hero_type || 'photo') === 'photo'
                    ? 'bg-primary-container text-on-primary-container border-primary-container shadow-lg'
                    : 'bg-surface-container-low text-on-surface border-outline-variant/30 hover:border-primary-container/50'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Single Static Photo</span>
              </button>

              <button
                type="button"
                onClick={() => setContentMap({ ...contentMap, hero_type: 'video' })}
                className={`p-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  contentMap.hero_type === 'video'
                    ? 'bg-primary-container text-on-primary-container border-primary-container shadow-lg'
                    : 'bg-surface-container-low text-on-surface border-outline-variant/30 hover:border-primary-container/50'
                }`}
              >
                <Film className="w-4 h-4" />
                <span>Background Video</span>
              </button>

              <button
                type="button"
                onClick={() => setContentMap({ ...contentMap, hero_type: 'slideshow' })}
                className={`p-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  contentMap.hero_type === 'slideshow'
                    ? 'bg-primary-container text-on-primary-container border-primary-container shadow-lg'
                    : 'bg-surface-container-low text-on-surface border-outline-variant/30 hover:border-primary-container/50'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Photo Slideshow (Carousel)</span>
              </button>
            </div>

            {/* DYNAMIC CONFIGURATION FOR SELECTED MEDIA TYPE */}
            
            {/* TYPE A: SINGLE PHOTO */}
            {(contentMap.hero_type || 'photo') === 'photo' && (
              <div className="pt-2 space-y-2">
                <label className="text-xs font-bold text-on-surface-variant block">SINGLE HERO BACKGROUND IMAGE</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={contentMap.hero_bg_image || ''}
                    onChange={(e) => setContentMap({ ...contentMap, hero_bg_image: e.target.value })}
                    placeholder="https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_10.jpg"
                    className="flex-1 bg-surface-container-high text-xs p-3 rounded-lg border border-outline-variant/30 text-on-surface"
                  />
                  <label className="cursor-pointer px-4 py-3 rounded-lg bg-primary-container text-on-primary-container font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-md">
                    <Crop className="w-4 h-4" />
                    <span>Upload & Crop Banner</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSelectFileToCrop(e, 'hero_bg_image', 16 / 9)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* TYPE B: BACKGROUND VIDEO */}
            {contentMap.hero_type === 'video' && (
              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-on-surface-variant block">BACKGROUND VIDEO URL (.MP4 File, YouTube URL, or Uploaded Video)</label>
                  <span className="text-[10px] text-primary font-bold">💡 Tip: Use YouTube links or Video Presets for 100% cross-device compatibility</span>
                </div>

                {/* 1-Click Video Presets */}
                <div className="flex flex-wrap items-center gap-2 pb-1 bg-surface-container-high/40 p-2.5 rounded-xl border border-outline-variant/30">
                  <span className="text-[10px] font-extrabold text-on-surface-variant uppercase">1-Click HD Video Presets:</span>
                  <button
                    type="button"
                    onClick={() => setContentMap({ ...contentMap, hero_video_url: 'https://assets.mixkit.co/videos/preview/mixkit-skaters-racing-on-an-outdoor-rink-41561-large.mp4', hero_type: 'video' })}
                    className="px-2.5 py-1 rounded-lg bg-surface-container-high text-primary font-semibold text-[11px] border border-outline-variant/30 hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center gap-1 shadow-sm"
                  >
                    <Play className="w-3 h-3 text-cyan-400" />
                    <span>⚡ Speed Racing HD Preset</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setContentMap({ ...contentMap, hero_video_url: 'https://assets.mixkit.co/videos/preview/mixkit-roller-skater-performing-tricks-in-a-skate-park-42777-large.mp4', hero_type: 'video' })}
                    className="px-2.5 py-1 rounded-lg bg-surface-container-high text-primary font-semibold text-[11px] border border-outline-variant/30 hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center gap-1 shadow-sm"
                  >
                    <Play className="w-3 h-3 text-cyan-400" />
                    <span>🏁 Slalom Agility HD Preset</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={contentMap.hero_video_url || ''}
                    onChange={(e) => setContentMap({ ...contentMap, hero_video_url: e.target.value })}
                    placeholder="Paste MP4 link, YouTube URL (e.g. https://www.youtube.com/watch?v=...), or click Upload 👉"
                    className="flex-1 bg-surface-container-high text-xs p-3 rounded-lg border border-outline-variant/30 text-on-surface"
                  />
                  <label className="cursor-pointer px-4 py-3 rounded-lg bg-primary-container text-on-primary-container font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-md hover:bg-cyan-400">
                    <Upload className="w-4 h-4" />
                    <span>{uploadingVideo ? 'Uploading Video...' : 'Upload Video File'}</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleDirectVideoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Attached Video Preview */}
                {contentMap.hero_video_url && (
                  <div className="mt-2 p-3 bg-black/60 rounded-xl border border-primary-container/40 space-y-2">
                    <div className="text-[11px] text-primary font-bold flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5 text-primary-container" />
                      <span>Attached Hero Video Preview</span>
                    </div>
                    {contentMap.hero_video_url.includes('youtube.com') || contentMap.hero_video_url.includes('youtu.be') ? (
                      <div className="text-xs text-amber-300 font-semibold p-2 bg-amber-500/10 rounded-lg border border-amber-500/30">
                        📺 YouTube Video URL attached! YouTube video will auto-play muted seamlessly in the background on your live website.
                      </div>
                    ) : (
                      <video
                        src={contentMap.hero_video_url}
                        controls
                        muted
                        className="w-full max-h-48 rounded-lg object-contain bg-black"
                      />
                    )}
                  </div>
                )}

                <div className="text-[10px] text-cyan-300">
                  ℹ️ The background video automatically loops on mute. Make sure to click <strong>"Save Homepage Hero Changes"</strong> below to push live!
                </div>
              </div>
            )}

            {/* TYPE C: PHOTO SLIDESHOW / CAROUSEL */}
            {contentMap.hero_type === 'slideshow' && (
              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-on-surface-variant block">SLIDESHOW IMAGES ({currentSlideshow.length})</label>
                  <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container font-bold text-xs flex items-center gap-1.5 shadow-md">
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Photo to Slideshow</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSelectFileToCrop(e, 'hero_slideshow_urls', 16 / 9, true)}
                      className="hidden"
                    />
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
              <input
                type="text"
                value={contentMap.hero_badge || ''}
                onChange={(e) => setContentMap({ ...contentMap, hero_badge: e.target.value })}
                className="w-full bg-surface-container-high text-xs p-3 rounded-lg border border-outline-variant/30 text-on-surface"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant block mb-1">LOCATION CORRIDOR BADGE</label>
              <input
                type="text"
                value={contentMap.hero_sub_badge || ''}
                onChange={(e) => setContentMap({ ...contentMap, hero_sub_badge: e.target.value })}
                className="w-full bg-surface-container-high text-xs p-3 rounded-lg border border-outline-variant/30 text-on-surface"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-on-surface-variant block mb-1">HERO HEADLINE PART 1</label>
              <input
                type="text"
                value={contentMap.hero_title_1 || ''}
                onChange={(e) => setContentMap({ ...contentMap, hero_title_1: e.target.value })}
                className="w-full bg-surface-container-high text-xs p-3 rounded-lg border border-outline-variant/30 text-on-surface"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant block mb-1">HERO HEADLINE PART 2 (GLOW TEXT)</label>
              <input
                type="text"
                value={contentMap.hero_title_2 || ''}
                onChange={(e) => setContentMap({ ...contentMap, hero_title_2: e.target.value })}
                className="w-full bg-surface-container-high text-xs p-3 rounded-lg border border-outline-variant/30 text-on-surface"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-on-surface-variant block mb-1">HERO DESCRIPTION</label>
            <textarea
              rows={3}
              value={contentMap.hero_description || ''}
              onChange={(e) => setContentMap({ ...contentMap, hero_description: e.target.value })}
              className="w-full bg-surface-container-high text-xs p-3 rounded-lg border border-outline-variant/30 text-on-surface"
            />
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={savingHero}
              className="px-6 py-3.5 rounded-xl bg-primary-container text-on-primary-container font-bold text-xs shadow-lg hover:shadow-cyan-500/50 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {savingHero ? (
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

            {savedMsg && (
              <div className="px-4 py-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-2 border border-emerald-500/40">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{savedMsg}</span>
              </div>
            )}

            {heroErrMsg && (
              <div className="px-4 py-3 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-2 border border-amber-500/40">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{heroErrMsg}</span>
              </div>
            )}
          </div>
        </form>
      )}

      {/* 2. PROGRAMS CMS */}
      {activeTab === 'programs' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => { setEditType('programs'); setEditItem({ name: '', age_group: '', level: '', short_desc: '', full_desc: '', image_url: 'https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_03.jpg', schedule: '3x Weekly', duration: '3 Months', display_order: programs.length + 1 }); }}
              className="px-4 py-2.5 rounded-xl bg-primary-container text-on-primary-container text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Program</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programs.map((p) => (
              <div key={p.id} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary">{p.name}</span>
                    <span className="text-[10px] text-primary-container font-bold">{p.age_group}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant line-clamp-2">{p.short_desc}</p>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
                  <button
                    onClick={() => { setEditType('programs'); setEditItem(p); }}
                    className="p-1.5 rounded bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem('programs', p.id)}
                    className="p-1.5 rounded bg-red-500/20 text-red-300 hover:bg-red-500/40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. COACHES CMS */}
      {activeTab === 'coaches' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => { setEditType('coaches'); setEditItem({ name: '', position: '', photo_url: 'https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_05.jpg', experience: '', specialization: '', achievements: '', bio: '', display_order: coaches.length + 1 }); }}
              className="px-4 py-2.5 rounded-xl bg-primary-container text-on-primary-container text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Coach</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coaches.map((c) => (
              <div key={c.id} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <img src={c.photo_url} alt={c.name} className="w-14 h-14 rounded-full object-cover border-2 border-primary-container" onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Coach'; }} />
                    <div>
                      <div className="text-xs font-bold text-primary">{c.name}</div>
                      <div className="text-[10px] text-on-surface-variant">{c.position}</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-semibold">{c.experience} • {c.specialization}</div>
                  <p className="text-xs text-on-surface-variant line-clamp-2">{c.bio}</p>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
                  <button
                    onClick={() => { setEditType('coaches'); setEditItem(c); }}
                    className="p-1.5 rounded bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem('coaches', c.id)}
                    className="p-1.5 rounded bg-red-500/20 text-red-300 hover:bg-red-500/40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. EVENTS CMS */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => { setEditType('events'); setEditItem({ title: '', category: 'State Trials', date_str: '', time_str: '', location: '', description: '', image_url: 'https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_02.jpg', registration_status: 'Open' }); }}
              className="px-4 py-2.5 rounded-xl bg-primary-container text-on-primary-container text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Event</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((e) => (
              <div key={e.id} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary">{e.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-primary-container/20 text-primary-container font-bold">{e.registration_status}</span>
                  </div>
                  <div className="text-[11px] text-cyan-400 font-medium">{e.date_str} • {e.time_str} • {e.location}</div>
                  <p className="text-xs text-on-surface-variant line-clamp-2">{e.description}</p>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
                  <button
                    onClick={() => { setEditType('events'); setEditItem(e); }}
                    className="p-1.5 rounded bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem('events', e.id)}
                    className="p-1.5 rounded bg-red-500/20 text-red-300 hover:bg-red-500/40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. ACHIEVEMENTS CMS */}
      {activeTab === 'achievements' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => { setEditType('achievements'); setEditItem({ title: '', category: 'State / National', year: '2026', count_label: '', description: '', image_url: 'https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_01.jpg', display_order: achievements.length + 1 }); }}
              className="px-4 py-2.5 rounded-xl bg-primary-container text-on-primary-container text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Achievement</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((a) => (
              <div key={a.id} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">{a.title}</span>
                    <span className="text-[10px] text-on-surface-variant font-bold">{a.year}</span>
                  </div>
                  <div className="text-sm font-extrabold text-primary">{a.count_label}</div>
                  <p className="text-xs text-on-surface-variant line-clamp-2">{a.description}</p>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
                  <button
                    onClick={() => { setEditType('achievements'); setEditItem(a); }}
                    className="p-1.5 rounded bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem('achievements', a.id)}
                    className="p-1.5 rounded bg-red-500/20 text-red-300 hover:bg-red-500/40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. GALLERY CMS */}
      {activeTab === 'gallery' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => { setEditType('gallery'); setEditItem({ title: '', category: 'All', media_type: 'image', url: 'https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_01.jpg', caption: '', display_order: gallery.length + 1 }); }}
              className="px-4 py-2.5 rounded-xl bg-primary-container text-on-primary-container text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Gallery Media</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((g) => (
              <div key={g.id} className="bg-surface-container-low p-2 rounded-xl border border-outline-variant/30 space-y-2">
                <img src={g.url} alt={g.title} className="w-full h-28 object-cover rounded-lg" onError={(e) => { e.target.src = 'https://placehold.co/300x200?text=Gallery+Image'; }} />
                <div className="px-1">
                  <div className="text-xs font-bold text-primary truncate">{g.title || 'Gallery Media'}</div>
                  <div className="text-[10px] text-on-surface-variant">{g.category}</div>
                </div>
                <div className="flex items-center justify-end gap-1 pt-1 border-t border-outline-variant/20">
                  <button
                    onClick={() => { setEditType('gallery'); setEditItem(g); }}
                    className="p-1 rounded bg-surface-container-high text-primary"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem('gallery', g.id)}
                    className="p-1 rounded bg-red-500/20 text-red-300"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. TESTIMONIALS CMS */}
      {activeTab === 'testimonials' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => { setEditType('testimonials'); setEditItem({ name: '', role_desc: 'Parent', quote: '', rating: 5, photo_url: 'https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_07.jpg' }); }}
              className="px-4 py-2.5 rounded-xl bg-primary-container text-on-primary-container text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Testimonial</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary">{t.name}</span>
                    <span className="text-[10px] text-amber-400 font-bold">★ {t.rating}/5</span>
                  </div>
                  <div className="text-[10px] text-on-surface-variant">{t.role_desc}</div>
                  <p className="text-xs text-on-surface-variant italic line-clamp-3">"{t.quote}"</p>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
                  <button
                    onClick={() => { setEditType('testimonials'); setEditItem(t); }}
                    className="p-1.5 rounded bg-surface-container-high text-primary"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem('testimonials', t.id)}
                    className="p-1.5 rounded bg-red-500/20 text-red-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. LOCATIONS CMS */}
      {activeTab === 'locations' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => { setEditType('locations'); setEditItem({ name: '', tag_label: 'Main Track', address: '', phone: '+91 98765 43210', schedule: 'Tue-Sun 6AM-9:30AM', maps_url: '', description: '', photo_url: 'https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_10.jpg', display_order: locations.length + 1 }); }}
              className="px-4 py-2.5 rounded-xl bg-primary-container text-on-primary-container text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Location</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {locations.map((loc) => (
              <div key={loc.id} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary">{loc.name}</span>
                    <span className="text-[10px] text-cyan-400 font-bold">{loc.tag_label}</span>
                  </div>
                  <div className="text-[11px] text-on-surface-variant">{loc.address}</div>
                  <div className="text-[11px] text-emerald-400">{loc.schedule}</div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
                  <button
                    onClick={() => { setEditType('locations'); setEditItem(loc); }}
                    className="p-1.5 rounded bg-surface-container-high text-primary"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem('locations', loc.id)}
                    className="p-1.5 rounded bg-red-500/20 text-red-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. FAQS CMS */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => { setEditType('faqs'); setEditItem({ question: '', answer: '', category: 'General', display_order: faqs.length + 1 }); }}
              className="px-4 py-2.5 rounded-xl bg-primary-container text-on-primary-container text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New FAQ</span>
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-primary">Q: {faq.question}</div>
                  <div className="text-xs text-on-surface-variant">A: {faq.answer}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => { setEditType('faqs'); setEditItem(faq); }}
                    className="p-1.5 rounded bg-surface-container-high text-primary"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem('faqs', faq.id)}
                    className="p-1.5 rounded bg-red-500/20 text-red-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* UNIVERSAL EDIT MODAL POPUP FOR ALL 9 CRUD TAB TYPES */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-primary uppercase">
              {editItem.id ? `Edit ${editType === 'coaches' ? 'Coach' : editType.slice(0, -1)}` : `Add New ${editType === 'coaches' ? 'Coach' : editType.slice(0, -1)}`}
            </h3>

            {/* PROGRAMS EDIT FORM */}
            {editType === 'programs' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-on-surface-variant font-bold mb-1">PROGRAM NAME</label>
                  <input type="text" value={editItem.name || ''} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} className="w-full bg-surface-container-high p-2.5 rounded border border-outline-variant/30 text-on-surface" />
                </div>
                <div>
                  <label className="block text-on-surface-variant font-bold mb-1">AGE GROUP</label>
                  <input type="text" value={editItem.age_group || ''} onChange={(e) => setEditItem({ ...editItem, age_group: e.target.value })} className="w-full bg-surface-container-high p-2.5 rounded border border-outline-variant/30 text-on-surface" />
                </div>
                <div>
                  <label className="block text-on-surface-variant font-bold mb-1">SHORT DESCRIPTION</label>
                  <textarea rows={2} value={editItem.short_desc || ''} onChange={(e) => setEditItem({ ...editItem, short_desc: e.target.value })} className="w-full bg-surface-container-high p-2.5 rounded border border-outline-variant/30 text-on-surface" />
                </div>
                {renderImageUploaderField('PROGRAM FEATURED IMAGE', 'image_url', editItem.image_url, 16 / 9)}
              </div>
            )}

            {/* COACHES EDIT FORM */}
            {editType === 'coaches' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-on-surface-variant font-bold mb-1">COACH FULL NAME</label>
                  <input type="text" value={editItem.name || ''} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} className="w-full bg-surface-container-high p-2.5 rounded border border-outline-variant/30 text-on-surface" />
                </div>
                <div>
                  <label className="block text-on-surface-variant font-bold mb-1">POSITION / TITLE</label>
                  <input type="text" value={editItem.position || ''} onChange={(e) => setEditItem({ ...editItem, position: e.target.value })} className="w-full bg-surface-container-high p-2.5 rounded border border-outline-variant/30 text-on-surface" />
                </div>
                <div>
                  <label className="block text-on-surface-variant font-bold mb-1">EXPERIENCE & CERTIFICATIONS</label>
                  <input type="text" value={editItem.experience || ''} onChange={(e) => setEditItem({ ...editItem, experience: e.target.value })} className="w-full bg-surface-container-high p-2.5 rounded border border-outline-variant/30 text-on-surface" />
                </div>
                <div>
                  <label className="block text-on-surface-variant font-bold mb-1">SPECIALIZATION</label>
                  <input type="text" value={editItem.specialization || ''} onChange={(e) => setEditItem({ ...editItem, specialization: e.target.value })} className="w-full bg-surface-container-high p-2.5 rounded border border-outline-variant/30 text-on-surface" />
                </div>

                {/* PHOTO UPLOADER & CROPPER FOR COACHES (Default Square 1:1) */}
                {renderImageUploaderField('COACH PHOTO (1:1 SQUARE CROP)', 'photo_url', editItem.photo_url, 1)}

                <div>
                  <label className="block text-on-surface-variant font-bold mb-1">BIOGRAPHY</label>
                  <textarea rows={3} value={editItem.bio || ''} onChange={(e) => setEditItem({ ...editItem, bio: e.target.value })} className="w-full bg-surface-container-high p-2.5 rounded border border-outline-variant/30 text-on-surface" />
                </div>
              </div>
            )}

            {/* EVENTS EDIT FORM */}
            {editType === 'events' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-on-surface-variant font-bold mb-1">EVENT TITLE</label>
                  <input type="text" value={editItem.title || ''} onChange={(e) => setEditItem({ ...editItem, title: e.target.value })} className="w-full bg-surface-container-high p-2.5 rounded border border-outline-variant/30 text-on-surface" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-on-surface-variant font-bold mb-1">DATE STRING</label>
                    <input type="text" value={editItem.date_str || ''} onChange={(e) => setEditItem({ ...editItem, date_str: e.target.value })} className="w-full bg-surface-container-high p-2.5 rounded border border-outline-variant/30 text-on-surface" />
                  </div>
                  <div>
                    <label className="block text-on-surface-variant font-bold mb-1">TIME STRING</label>
                    <input type="text" value={editItem.time_str || ''} onChange={(e) => setEditItem({ ...editItem, time_str: e.target.value })} className="w-full bg-surface-container-high p-2.5 rounded border border-outline-variant/30 text-on-surface" />
                  </div>
                </div>
                <div>
                  <label className="block text-on-surface-variant font-bold mb-1">LOCATION ARENA</label>
                  <input type="text" value={editItem.location || ''} onChange={(e) => setEditItem({ ...editItem, location: e.target.value })} className="w-full bg-surface-container-high p-2.5 rounded border border-outline-variant/30 text-on-surface" />
                </div>
                <div>
                  <label className="block text-on-surface-variant font-bold mb-1">DESCRIPTION</label>
                  <textarea rows={2} value={editItem.description || ''} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} className="w-full bg-surface-container-high p-2.5 rounded border border-outline-variant/30 text-on-surface" />
                </div>
                {renderImageUploaderField('EVENT COVER IMAGE', 'image_url', editItem.image_url, 16 / 9)}
              </div>
            )}

            {/* ACHIEVEMENTS EDIT FORM */}
            {editType === 'achievements' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-on-surface-variant font-bold mb-1">TITLE</label>
                  <input type="text" value={editItem.title || ''} onChange={(e) => setEditItem({ ...editItem, title: e.target.value })} className="w-full bg-surface-container-high p-2.5 rounded border border-outline-variant/30 text-on-surface" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-on-surface-variant font-bold mb-1">COUNT / LABEL</label>
                    <input type="text" value={editItem.count_label || ''} onChange={(e) => setEditItem({ ...editItem, count_label: e.target.value })} className="w-full bg-surface-container-high p-2.5 rounded border border-outline-variant/30 text-on-surface" />
                  </div>
                  <div>
                    <label className="block text-on-surface-variant font-bold mb-1">YEAR</label>
                    <input type="text" value={editItem.year || ''} onChange={(e) => setEditItem({ ...editItem, year: e.target.value })} className="w-full bg-surface-container-high p-2.5 rounded border border-outline-variant/30 text-on-surface" />
                  </div>
                </div>
                <div>
                  <label className="block text-on-surface-variant font-bold mb-1">DESCRIPTION</label>
                  <textarea rows={2} value={editItem.description || ''} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} className="w-full bg-surface-container-high p-2.5 rounded border border-outline-variant/30 text-on-surface" />
                </div>
                {renderImageUploaderField('ACHIEVEMENT IMAGE', 'image_url', editItem.image_url, 16 / 9)}
              </div>
            )}

            {/* GALLERY EDIT FORM */}
            {editType === 'gallery' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-on-surface-variant font-bold mb-1">MEDIA TITLE</label>
                  <input type="text" value={editItem.title || ''} onChange={(e) => setEditItem({ ...editItem, title: e.target.value })} className="w-full bg-surface-container-high p-2.5 rounded border border-outline-variant/30 text-on-surface" />
                </div>
                <div>
                  <label className="block text-on-surface-variant font-bold mb-1">CATEGORY</label>
                  <input type="text" value={editItem.category || ''} onChange={(e) => setEditItem({ ...editItem, category: e.target.value })} className="w-full bg-surface-container-high p-2.5 rounded border border-outline-variant/30 text-on-surface" />
                </div>
                {renderImageUploaderField('GALLERY PHOTO / VIDEO FILE', 'url', editItem.url, 16 / 9)}
              </div>
            )}

            {/* TESTIMONIALS EDIT FORM */}
            {editType === 'testimonials' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-on-surface-variant font-bold mb-1">NAME</label>
                  <input type="text" value={editItem.name || ''} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} className="w-full bg-surface-container-high p-2.5 rounded border border-outline-variant/30 text-on-surface" />
                </div>
                <div>
                  <label className="block text-on-surface-variant font-bold mb-1">ROLE / DESIGNATION</label>
                  <input type="text" value={editItem.role_desc || ''} onChange={(e) => setEditItem({ ...editItem, role_desc: e.target.value })} className="w-full bg-surface-container-high p-2.5 rounded border border-outline-variant/30 text-on-surface" />
                </div>
                <div>
                  <label className="block text-on-surface-variant font-bold mb-1">TESTIMONIAL QUOTE</label>
                  <textarea rows={3} value={editItem.quote || ''} onChange={(e) => setEditItem({ ...editItem, quote: e.target.value })} className="w-full bg-surface-container-high p-2.5 rounded border border-outline-variant/30 text-on-surface" />
                </div>
                {renderImageUploaderField('PARENT / SKATER PHOTO (1:1 SQUARE)', 'photo_url', editItem.photo_url, 1)}
              </div>
            )}

            {/* LOCATIONS EDIT FORM */}
            {editType === 'locations' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-on-surface-variant font-bold mb-1">LOCATION NAME</label>
                  <input type="text" value={editItem.name || ''} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} className="w-full bg-surface-container-high p-2.5 rounded border border-outline-variant/30 text-on-surface" />
                </div>
                <div>
                  <label className="block text-on-surface-variant font-bold mb-1">ADDRESS</label>
                  <textarea rows={2} value={editItem.address || ''} onChange={(e) => setEditItem({ ...editItem, address: e.target.value })} className="w-full bg-surface-container-high p-2.5 rounded border border-outline-variant/30 text-on-surface" />
                </div>
                <div>
                  <label className="block text-on-surface-variant font-bold mb-1">SESSION SCHEDULE</label>
                  <input type="text" value={editItem.schedule || ''} onChange={(e) => setEditItem({ ...editItem, schedule: e.target.value })} className="w-full bg-surface-container-high p-2.5 rounded border border-outline-variant/30 text-on-surface" />
                </div>
                {renderImageUploaderField('LOCATION ARENA PHOTO', 'photo_url', editItem.photo_url, 16 / 9)}
              </div>
            )}

            {/* FAQS EDIT FORM */}
            {editType === 'faqs' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-on-surface-variant font-bold mb-1">QUESTION</label>
                  <input type="text" value={editItem.question || ''} onChange={(e) => setEditItem({ ...editItem, question: e.target.value })} className="w-full bg-surface-container-high p-2.5 rounded border border-outline-variant/30 text-on-surface" />
                </div>
                <div>
                  <label className="block text-on-surface-variant font-bold mb-1">ANSWER</label>
                  <textarea rows={3} value={editItem.answer || ''} onChange={(e) => setEditItem({ ...editItem, answer: e.target.value })} className="w-full bg-surface-container-high p-2.5 rounded border border-outline-variant/30 text-on-surface" />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/20">
              <button onClick={() => setEditItem(null)} className="px-4 py-2 rounded bg-surface-container-high text-xs font-bold text-on-surface">Cancel</button>
              <button onClick={() => handleSaveItem(editType, editItem)} className="px-6 py-2 rounded bg-primary-container text-on-primary-container text-xs font-bold">Save Item</button>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE IMAGE CROPPER MODAL POPUP */}
      {cropTarget && (
        <ImageCropperModal
          imageSrc={cropTarget.imageSrc}
          defaultAspect={cropTarget.defaultAspect}
          onCropComplete={handleCroppedImageUpload}
          onCancel={() => setCropTarget(null)}
        />
      )}
    </div>
  );
}
