import React, { useEffect, useMemo, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';
import { defaultGallery, media } from '../lib/media';

export default function GallerySection({ gallery = [] }) {
  const items = gallery.length ? gallery : defaultGallery;
  const categories = useMemo(() => ['All', ...Array.from(new Set(items.map(g => g.category).filter(Boolean)))], [items]);
  const [category, setCategory] = useState('All');
  const [index, setIndex] = useState(null); // index into `shown`

  const shown = items.filter(g => category === 'All' || g.category === category);

  const close = () => setIndex(null);
  const step = (d) => setIndex(i => (i + d + shown.length) % shown.length);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, shown.length]);

  const current = index !== null ? shown[index] : null;
  const isVideo = (g) => g?.media_type === 'video' || /\.(mp4|webm|mov)(\?|$)/i.test(g?.url || '');

  return (
    <section id="gallery" className="bg-white py-20 sm:py-28 lg:py-36 border-t border-concrete">
      <div className="container-site">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <SectionHeader
            eyebrow="Gallery"
            title={<>From the track<br />and the road</>}
            lead="Sessions, sprints and podiums, photographed at our own venues and at the championships PRSA skaters attend."
          />
          <div className="flex flex-wrap gap-2" data-reveal role="tablist" aria-label="Filter gallery">
            {categories.map(c => (
              <button key={c} role="tab" aria-selected={category === c} onClick={() => { setCategory(c); setIndex(null); }} className={`chip-filter ${category === c ? 'is-active' : ''}`}>{c}</button>
            ))}
          </div>
        </div>

        {/* Bento grid: every fifth tile is a 2×2 feature, so the wall keeps a
            rhythm no matter how many photos the CMS holds. */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 [grid-auto-flow:dense]">
          {shown.map((g, i) => {
            const featured = i % 5 === 0;
            return (
              <button
                key={g.id || i}
                onClick={() => setIndex(i)}
                className={`group relative rounded-2xl overflow-hidden bg-chalk-2 text-left focus-visible:outline-cobalt aspect-[4/3] ${featured ? 'col-span-2 row-span-2' : ''}`}
                data-reveal
                style={{ '--reveal-delay': `${(i % 4) * 70}ms` }}
                aria-label={`Open ${g.title || 'photo'}`}
              >
                {isVideo(g) ? (
                  <video src={g.url} muted playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <img
                    src={g.url}
                    alt={g.title || 'PRSA gallery photo'}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = media.rinkSession; }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-4 flex flex-col justify-end text-white">
                  <span className="font-display font-bold uppercase text-xl leading-none">{g.title}</span>
                  {g.caption && <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/70 mt-1.5 line-clamp-1">{g.caption}</span>}
                </div>
                {isVideo(g) && (
                  <span className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 text-ink flex items-center justify-center"><Play className="w-4 h-4 ml-0.5" /></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      {current && (
        <div className="fixed inset-0 z-[60] bg-ink/95 backdrop-blur-sm flex flex-col animate-fade-in" role="dialog" aria-modal="true" aria-label={current.title} onClick={close}>
          <div className="flex items-center justify-between px-5 sm:px-8 h-16 text-white shrink-0">
            <span className="font-mono text-xs tracking-[0.16em] uppercase text-white/60">{index + 1} / {shown.length}</span>
            <button onClick={close} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white hover:text-ink flex items-center justify-center transition-colors" aria-label="Close"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex-1 min-h-0 flex items-center justify-center px-4 sm:px-20 relative" onClick={(e) => e.stopPropagation()}>
            {shown.length > 1 && (
              <>
                <button onClick={() => step(-1)} className="absolute left-3 sm:left-6 w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white hover:text-ink flex items-center justify-center transition-colors" aria-label="Previous"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={() => step(1)} className="absolute right-3 sm:right-6 w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white hover:text-ink flex items-center justify-center transition-colors" aria-label="Next"><ChevronRight className="w-5 h-5" /></button>
              </>
            )}
            {isVideo(current) ? (
              <video src={current.url} controls autoPlay playsInline className="max-h-full max-w-full rounded-xl" />
            ) : (
              <img src={current.url} alt={current.title} className="max-h-full max-w-full object-contain rounded-xl" />
            )}
          </div>
          <div className="px-5 sm:px-8 py-5 text-white shrink-0" onClick={(e) => e.stopPropagation()}>
            <p className="font-display font-bold uppercase text-2xl leading-none">{current.title}</p>
            {current.caption && <p className="text-sm text-white/60 mt-1.5">{current.caption}</p>}
          </div>
        </div>
      )}
    </section>
  );
}
