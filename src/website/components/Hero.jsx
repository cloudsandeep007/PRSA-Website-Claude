import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { media } from '../lib/media';

// Turns any YouTube link into a muted, looping, chrome-less embed URL.
function toYouTubeEmbed(url) {
  if (!url) return null;
  let id = null;
  if (url.includes('youtube.com/watch?v=')) id = url.split('v=')[1]?.split('&')[0];
  else if (url.includes('youtu.be/')) id = url.split('youtu.be/')[1]?.split('?')[0];
  else if (url.includes('youtube.com/embed/')) id = url.split('embed/')[1]?.split('?')[0];
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&showinfo=0&modestbranding=1&playsinline=1` : null;
}

function parseSlides(raw) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch (e) {
    if (typeof raw === 'string' && raw.includes(',')) return raw.split(',').map(s => s.trim()).filter(Boolean);
  }
  return null;
}

export default function Hero({ content = {}, settings = {} }) {
  const badge = (content.hero_badge || 'RSFI affiliated academy · Bengaluru').replace(/^[^\p{L}\p{N}]+/u, '');
  const title1 = content.hero_title_1 || 'Unleash speed.';
  const title2 = content.hero_title_2 || 'Master the rink.';
  const description = content.hero_description ||
    'Roller skating coaching in Bengaluru for ages 4 and up — from first balance on quads to state and national podiums on inline speed skates.';
  const ctaPrimary = content.hero_cta_primary_text || 'Book a free trial class';
  const ctaPrimaryLink = content.hero_cta_primary_link || '#trial';
  const ctaSecondary = content.hero_cta_secondary_text || 'See the academy';
  const ctaSecondaryLink = content.hero_cta_secondary_link || '#gallery';

  const heroType = content.hero_type || 'video';

  let videoUrl = content.hero_video_url;
  if (!videoUrl || videoUrl === 'SESSION_VIDEO') {
    try { videoUrl = sessionStorage.getItem('prsa_huge_hero_video') || ''; } catch (e) { videoUrl = ''; }
  }
  if (!videoUrl) videoUrl = media.heroVideo;
  const ytEmbed = toYouTubeEmbed(videoUrl);

  // In video mode the still behind the video must be the video's own first
  // frame, otherwise an unrelated photo flashes for a moment and then vanishes
  // when playback starts. We only have that frame for the academy's own clip,
  // so any other video starts from the plain dark background instead.
  const isAcademyClip = /(hero|prsa_hero_video|create_a_video_for_my_sketing)\.mp4(\?|$)/i.test(videoUrl);
  // The academy clip is bundled with the site, so serve the local copy rather
  // than re-downloading the same file from remote storage on every visit.
  if (isAcademyClip) videoUrl = media.heroVideo;
  const poster = heroType === 'video'
    ? (isAcademyClip && !ytEmbed ? media.heroPoster : null)
    : (content.hero_bg_image || media.heroPoster);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);

  // Autoplay is not guaranteed even for muted video: React sets `muted` as a
  // property (not an attribute), some browsers evaluate autoplay before it
  // applies, low-power / data-saver modes refuse it, and a background tab
  // pauses it. So we drive playback ourselves: force muted, call play(),
  // and retry on the first interaction, when data arrives, and when the tab
  // becomes visible again. If the file fails to load, reload it once.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || heroType !== 'video' || ytEmbed) return;

    v.muted = true;
    v.defaultMuted = true;
    let retries = 0;

    const tryPlay = () => {
      if (!v.paused) return;
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    };
    const onVisible = () => { if (document.visibilityState === 'visible') tryPlay(); };
    const onError = () => {
      if (retries++ < 2) setTimeout(() => { v.load(); tryPlay(); }, 1500 * retries);
    };
    const interactionEvents = ['pointerdown', 'touchstart', 'keydown', 'scroll'];
    const onInteract = () => tryPlay();

    tryPlay();
    v.addEventListener('loadeddata', tryPlay);
    v.addEventListener('canplay', tryPlay);
    v.addEventListener('error', onError);
    document.addEventListener('visibilitychange', onVisible);
    interactionEvents.forEach(e => window.addEventListener(e, onInteract, { passive: true }));

    return () => {
      v.removeEventListener('loadeddata', tryPlay);
      v.removeEventListener('canplay', tryPlay);
      v.removeEventListener('error', onError);
      document.removeEventListener('visibilitychange', onVisible);
      interactionEvents.forEach(e => window.removeEventListener(e, onInteract));
    };
  }, [heroType, ytEmbed, videoUrl]);

  const slides = parseSlides(content.hero_slideshow_urls) || [media.rinkNight1, media.squadRoad, media.podiumGlide];
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    if (heroType !== 'slideshow' || slides.length < 2) return;
    const t = setInterval(() => setSlide(s => (s + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [heroType, slides.length]);

  return (
    <section id="top" className="relative w-full min-h-[100svh] bg-ink overflow-hidden flex flex-col justify-end text-white on-dark">
      {/* ── Background media ─────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        {poster && <img src={poster} alt="" className="absolute inset-0 w-full h-full object-cover" aria-hidden="true" />}

        {heroType === 'video' && (
          ytEmbed ? (
            <iframe
              src={ytEmbed}
              title="PRSA academy video"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] min-w-full h-[56.25vw] min-h-full pointer-events-none"
              allow="autoplay; encrypted-media"
            />
          ) : (
            <video
              ref={videoRef}
              src={videoUrl}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              onPlaying={() => setPlaying(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${playing ? 'opacity-100' : 'opacity-0'}`}
            />
          )
        )}

        {heroType === 'slideshow' && slides.map((url, i) => (
          <img
            key={url + i}
            src={url}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === slide ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}

        {/* Scrims: bottom-heavy so the type sits on near-black, top light so the header reads */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />
      </div>

      {/* ── Slideshow controls ───────────────────────────────────────── */}
      {heroType === 'slideshow' && slides.length > 1 && (
        <div className="absolute top-28 right-5 sm:right-8 z-20 flex items-center gap-2 bg-ink/60 backdrop-blur px-2 py-1.5 rounded-full border border-white/15">
          <button onClick={() => setSlide(s => (s - 1 + slides.length) % slides.length)} className="p-1 rounded-full hover:bg-white/10" aria-label="Previous slide"><ChevronLeft className="w-4 h-4" /></button>
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`} className={`h-1.5 rounded-full transition-all ${i === slide ? 'w-6 bg-race' : 'w-1.5 bg-white/40'}`} />
            ))}
          </div>
          <button onClick={() => setSlide(s => (s + 1) % slides.length)} className="p-1 rounded-full hover:bg-white/10" aria-label="Next slide"><ChevronRight className="w-4 h-4" /></button>
        </div>
      )}

      {/* ── Copy ─────────────────────────────────────────────────────── */}
      <div className="container-site relative z-10 pt-40 pb-14 sm:pb-20 lg:pb-24">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
          <div className="max-w-4xl">
            <div className="animate-rise-in" style={{ animationDelay: '80ms' }}>
              <span className="t-eyebrow inline-flex items-center gap-2.5 text-race">
                <span className="w-2 h-2 rounded-full bg-race shadow-[0_0_12px_#FFD60A]" />
                {badge}
              </span>
            </div>

            <h1 className="t-display mt-6 text-[19vw] leading-[0.86] sm:text-[13vw] lg:text-[8.6rem] xl:text-[9.5rem]">
              <span className="block text-white animate-rise-in" style={{ animationDelay: '180ms' }}>{title1}</span>
              <span className="block text-race animate-rise-in" style={{ animationDelay: '300ms' }}>{title2}</span>
            </h1>

            <p className="mt-7 max-w-xl text-base sm:text-lg leading-relaxed text-white/75 animate-rise-in" style={{ animationDelay: '420ms' }}>
              {description}
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3 animate-rise-in" style={{ animationDelay: '520ms' }}>
              <a href={ctaPrimaryLink} className="btn-race !px-7 !py-4 text-[15px]">
                {ctaPrimary} <ArrowRight className="w-4 h-4" />
              </a>
              <a href={ctaSecondaryLink} className="btn-ghost-light !px-7 !py-4 text-[15px]">
                {ctaSecondary}
              </a>
            </div>
          </div>

          {/* Trial promise card */}
          <aside
            className="hidden lg:block w-[300px] shrink-0 rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-xl p-6 animate-rise-in"
            style={{ animationDelay: '640ms' }}
          >
            <span className="t-eyebrow text-white/55">The free trial</span>
            <p className="font-display font-bold uppercase text-3xl leading-none mt-3 text-white">45 minutes on wheels, on us.</p>
            <ul className="mt-5 space-y-2.5 text-sm text-white/75">
              <li className="flex gap-2.5"><span className="text-race">—</span>Skates, helmet and guards provided</li>
              <li className="flex gap-2.5"><span className="text-race">—</span>Coach places your child in the right batch</li>
              <li className="flex gap-2.5"><span className="text-race">—</span>Parents welcome trackside</li>
            </ul>
            <p className="font-mono text-[11px] text-white/45 mt-5 tracking-wider uppercase">{settings.business_hours || 'Tue – Sun · Morning & evening batches'}</p>
          </aside>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2 text-white/40" aria-hidden="true">
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase">Scroll</span>
        <span className="w-px h-8 bg-white/25 overflow-hidden relative">
          <span className="absolute inset-x-0 top-0 h-3 bg-race animate-scroll-cue" />
        </span>
      </div>
    </section>
  );
}
