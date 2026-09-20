import React, { useEffect, useState } from 'react';
import { ArrowUpRight, X, Clock, CalendarRange } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';
import { media } from '../lib/media';

const FILTERS = ['All', 'Quad Skates', 'Inline Speed'];
const FALLBACK_IMAGES = [media.warmupPark, media.rinkSession, media.sprintRoad, media.squadRoad, media.coachDrill, media.rinkNight2];

function matchesFilter(p, filter) {
  if (filter === 'All') return true;
  const hay = `${p.name || ''} ${p.level || ''}`;
  if (filter === 'Quad Skates') return /quad|tots|foundation/i.test(hay);
  if (filter === 'Inline Speed') return /inline|speed|rsfi|velocity/i.test(hay);
  return true;
}

export default function ProgramsSection({ programs = [] }) {
  const [filter, setFilter] = useState('All');
  const [active, setActive] = useState(null);

  const shown = programs.filter(p => matchesFilter(p, filter));

  // Close the modal with Escape and lock scroll while it is open
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => e.key === 'Escape' && setActive(null);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [active]);

  return (
    <section id="programs" className="bg-white py-20 sm:py-28 lg:py-36 border-t border-concrete">
      <div className="container-site">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <SectionHeader
            eyebrow="Programs"
            title={<>Find the right<br />batch for your skater</>}
            lead="Six programs from age 4 to adult. Every skater starts with a free assessment so the coach can place them where they will progress fastest."
          />
          <div className="flex flex-wrap gap-2" data-reveal role="tablist" aria-label="Filter programs">
            {FILTERS.map(f => (
              <button key={f} role="tab" aria-selected={filter === f} onClick={() => setFilter(f)} className={`chip-filter ${filter === f ? 'is-active' : ''}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {shown.length === 0 ? (
          <p className="mt-14 text-ink/60">No programs in this category yet — try another filter, or book a trial and we'll recommend one.</p>
        ) : (
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
            {shown.map((p, i) => (
              <article
                key={p.id || i}
                className="card overflow-hidden group flex flex-col cursor-pointer hover:shadow-lift hover:-translate-y-1 transition-all duration-500"
                onClick={() => setActive(p)}
                data-reveal
                style={{ '--reveal-delay': `${(i % 3) * 90}ms` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-chalk-2">
                  <img
                    src={p.image_url || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]}
                    alt={p.name}
                    className="img-zoom"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]; }}
                  />
                  <span className="absolute top-3 left-3 chip bg-white/90 text-ink backdrop-blur">{p.age_group || 'All ages'}</span>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-cobalt">{p.level}</span>
                  <h3 className="font-display font-bold uppercase text-3xl leading-[0.95] mt-2 text-ink">{p.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65 line-clamp-3">{p.short_desc}</p>

                  <div className="mt-auto pt-6 flex items-center justify-between gap-4">
                    <span className="font-mono text-xs text-ink/60 inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {p.schedule}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-ink group-hover:text-cobalt transition-colors">
                      Details <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {active && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-ink/70 backdrop-blur-sm animate-fade-in" onClick={() => setActive(null)} role="dialog" aria-modal="true" aria-label={active.name}>
          <div className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[92vh] overflow-y-auto animate-rise-in" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-[16/9] bg-chalk-2">
              <img src={active.image_url || media.warmupPark} alt={active.name} className="w-full h-full object-cover" />
              <button onClick={() => setActive(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white text-ink flex items-center justify-center hover:bg-ink hover:text-white transition-colors" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
              <span className="absolute bottom-4 left-4 chip bg-race text-ink">{active.age_group}</span>
            </div>
            <div className="p-6 sm:p-8">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-cobalt">{active.level}</span>
              <h3 className="t-display text-4xl sm:text-5xl mt-2 text-ink">{active.name}</h3>
              <p className="mt-5 text-base leading-relaxed text-ink/70">{active.full_desc || active.short_desc}</p>

              <dl className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-chalk p-4">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/50 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Sessions</dt>
                  <dd className="mt-1.5 font-semibold text-ink">{active.schedule || '—'}</dd>
                </div>
                <div className="rounded-xl bg-chalk p-4">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/50 flex items-center gap-1.5"><CalendarRange className="w-3.5 h-3.5" /> Duration</dt>
                  <dd className="mt-1.5 font-semibold text-ink">{active.duration || '—'}</dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a href="#trial" onClick={() => setActive(null)} className="btn-cobalt flex-1">Book a free trial for this program</a>
                <button onClick={() => setActive(null)} className="btn-ghost">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
