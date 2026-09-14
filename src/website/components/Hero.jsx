import React, { useState, useEffect } from 'react';
import { ArrowRight, Camera, Star, ShieldCheck, Zap, ChevronLeft, ChevronRight, Play, Image as ImageIcon, Film } from 'lucide-react';
import { mediaUrl } from '../../lib/media';

export default function Hero({ content, settings }) {
  const badge = content.hero_badge || "⚡ OFFICIAL RSFI AFFILIATED ACADEMY • BENGALURU, KARNATAKA";
  const subBadge = content.hero_sub_badge || "ELECTRONIC CITY • NEO TOWN • HSR • FLOODLIT ARENA";
  const title1 = content.hero_title_1 || "UNLEASH SPEED.";
  const title2 = content.hero_title_2 || "MASTER THE RINK.";
  const description = content.hero_description || "Official RSFI roller skating training in Bangalore. From beginner balance & falling safety to podium medals at Ryan International, Viva Vibgyor, and State/National Championships.";

  // Media Type Configuration
  const heroType = content.hero_type || 'video'; // Default to 'video' for dynamic hero background
  const bgImage = content.hero_bg_image || mediaUrl('prsa_media_10.jpg');

  let videoUrl = content.hero_video_url;
  if (!videoUrl || videoUrl === 'SESSION_VIDEO') {
    try {
      const sessionVid = sessionStorage.getItem('prsa_huge_hero_video');
      if (sessionVid) videoUrl = sessionVid;
    } catch (e) {}
  }
  if (!videoUrl) {
    videoUrl = mediaUrl('create_a_video_for_my_sketing.mp4');
  }

  // Slideshow URLs parsing
  let slideshowUrls = [mediaUrl('prsa_media_10.jpg'), mediaUrl('prsa_media_02.jpg'), mediaUrl('prsa_media_01.jpg')];
  if (content.hero_slideshow_urls) {
    try {
      const parsed = JSON.parse(content.hero_slideshow_urls);
      if (Array.isArray(parsed) && parsed.length > 0) {
        slideshowUrls = parsed;
      }
    } catch (e) {
      if (typeof content.hero_slideshow_urls === 'string' && content.hero_slideshow_urls.includes(',')) {
        slideshowUrls = content.hero_slideshow_urls.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
  }

  // Slideshow active index state
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (heroType !== 'slideshow' || slideshowUrls.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slideshowUrls.length);
    }, 5000); // 5s transition
    return () => clearInterval(interval);
  }, [heroType, slideshowUrls.length]);

  // Helper to extract YouTube embed URL if YouTube link is provided
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    let videoId = null;
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0];
    }
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&autohide=1&modestbranding=1`;
    }
    return null;
  };

  const ytEmbedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <section className="relative w-full -mt-20 overflow-hidden bg-surface-container-lowest min-h-[92vh] flex flex-col justify-end">
      
      {/* 1. SINGLE PHOTO BACKGROUND MODE */}
      {heroType === 'photo' && (
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center filter contrast-115 brightness-90 scale-105 transition-transform duration-1000 ease-out"
            style={{ backgroundImage: `url('${bgImage}')` }}
          />
        </div>
      )}

      {/* 2. BACKGROUND VIDEO MODE */}
      {heroType === 'video' && (
        <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
          {/* Always render background fallback photo layer behind video so screen is NEVER blank/black */}
          <div 
            className="w-full h-full bg-cover bg-center filter brightness-90 contrast-115 absolute inset-0 z-0"
            style={{ backgroundImage: `url('${bgImage}'), url('https://images.unsplash.com/photo-1547447134-cd3f5c716030?q=80&w=1920&auto=format&fit=crop')` }}
          />

          {ytEmbedUrl ? (
            <iframe
              src={ytEmbedUrl}
              title="Hero Background Video"
              className="w-full h-[140%] -mt-[10%] object-cover filter brightness-80 contrast-110 scale-125 pointer-events-none relative z-10"
              allow="autoplay; encrypted-media"
            />
          ) : (videoUrl && videoUrl !== 'SESSION_VIDEO') ? (
            <video
              src={videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover filter brightness-80 contrast-110 scale-105 relative z-10"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : null}
        </div>
      )}

      {/* 3. MULTI-PHOTO SLIDESHOW CAROUSEL MODE */}
      {heroType === 'slideshow' && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          {slideshowUrls.map((url, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out filter contrast-115 brightness-90 scale-105 ${
                idx === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
              style={{ backgroundImage: `url('${url}')` }}
            />
          ))}

          {/* Slideshow Controls & Dot Indicators */}
          {slideshowUrls.length > 1 && (
            <div className="absolute bottom-6 right-8 z-20 flex items-center gap-3 bg-surface-container-lowest/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-outline-variant/30">
              <button
                onClick={() => setActiveSlide((prev) => (prev - 1 + slideshowUrls.length) % slideshowUrls.length)}
                className="p-1 rounded-full text-on-surface hover:text-primary hover:bg-surface-container-high transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1.5">
                {slideshowUrls.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setActiveSlide(dotIdx)}
                    className={`h-2 rounded-full transition-all ${
                      dotIdx === activeSlide ? 'w-6 bg-primary-container' : 'w-2 bg-outline-variant/50'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setActiveSlide((prev) => (prev + 1) % slideshowUrls.length)}
                className="p-1 rounded-full text-on-surface hover:text-primary hover:bg-surface-container-high transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Scrim Overlays for readability across all media modes */}
      <div className="absolute inset-0 z-1 pointer-events-none bg-gradient-to-t from-surface via-surface/85 to-surface/40"></div>
      <div className="absolute inset-0 z-1 pointer-events-none bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest/90 to-transparent"></div>
      <div className="absolute top-0 inset-x-0 h-40 z-1 pointer-events-none bg-gradient-to-b from-surface-container-lowest to-transparent"></div>

      {/* Hero Content Stage */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-margin-mobile md:px-margin pt-28 pb-12 md:pt-36 md:pb-space-2xl lg:min-h-[92vh] flex flex-col justify-end">
        {/* Telemetry Status Pill */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-space-sm mb-space-md">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full bg-surface-container-low/95 backdrop-blur-md shadow-sm border border-primary-container/40">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse shadow-[0_0_10px_#00f0ff]"></span>
            <span className="font-label-uppercase text-label-uppercase tracking-widest text-primary font-bold text-[10px] sm:text-[11px]">
              {badge}
            </span>
          </div>
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high/70 backdrop-blur-md border border-outline-variant/30">
            <span className="font-label-uppercase text-label-uppercase tracking-wider text-secondary font-semibold text-[10px]">
              {subBadge}
            </span>
          </div>
        </div>

        {/* Hero Headline & Insignia */}
        <div className="max-w-4xl space-y-space-md">
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-surface-container-lowest/80 backdrop-blur px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-outline-variant/30 mb-1">
            <img src="/logo/prsa_logo.png" alt="PRSA Logo" className="h-6 sm:h-7 w-auto object-contain" />

            <div className="h-4 w-[1px] bg-outline-variant/40"></div>
            <span className="font-label-uppercase text-[10px] sm:text-[11px] text-primary-container font-bold tracking-widest">
              {settings.academy_name || "PROFESSIONAL ROLLER SKATING ACADEMY"}
            </span>
          </div>

          <h1 className="font-display-hero text-3xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight text-primary font-bold drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] leading-[1.1]">
            {title1} <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container via-primary to-inverse-surface drop-shadow-[0_0_35px_rgba(0,240,255,0.4)]">
              {title2}
            </span>
          </h1>

          <p className="font-body-xl text-sm sm:text-base md:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            {description}
          </p>

          {/* Action CTAs */}
          <div className="pt-space-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-space-md">
            <a
              href="#trial"
              className="bg-primary-container text-on-primary-container font-label-uppercase text-xs sm:text-sm tracking-widest px-6 py-3.5 sm:px-8 sm:py-4 rounded-full font-bold shadow-[0_0_30px_rgba(0,240,255,0.45)] hover:shadow-[0_0_45px_rgba(0,240,255,0.7)] transition-all transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
            >
              <span>{content.hero_cta_primary_text || "BOOK A FREE TRIAL CLASS"}</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>

            <a
              href="#gallery"
              className="bg-surface-container/85 text-on-surface hover:text-primary font-label-uppercase text-xs sm:text-sm tracking-widest px-6 py-3.5 sm:px-8 sm:py-4 rounded-full font-bold backdrop-blur-md border border-outline-variant/30 transition-all hover:bg-surface-container-high inline-flex items-center justify-center gap-2"
            >
              <span>{content.hero_cta_secondary_text || "VIEW REAL ACTION GALLERY"}</span>
              <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          </div>

          {/* Social Proof Badges */}
          <div className="pt-space-md flex flex-wrap items-center gap-y-2 gap-x-space-lg text-on-surface-variant font-body-sm text-body-sm">
            <div className="flex items-center gap-2 bg-surface-container-lowest/80 px-3 py-1.5 rounded-full border border-outline-variant/30">
              <span className="font-bold text-on-surface">Google</span>
              <div className="flex text-[#FFB800]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-on-surface font-semibold">★ 4.9</span>
              <span className="text-outline text-xs">(240+ Verified Reviews)</span>
            </div>
            <div className="h-4 w-[1px] bg-outline-variant/60 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary-container" />
              <span className="text-on-surface font-semibold">Dedicated Floodlit Arena • Electronic City & HSR</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
