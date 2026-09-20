import React from 'react';
import SectionHeader from './ui/SectionHeader';
import { media } from '../lib/media';

// The three headline achievements stand on a literal podium: the first record
// takes the centre (1st) block, the second the left (2nd), the third the right
// (3rd). Any further records are listed underneath.
const PODIUM_PHOTOS = [media.podiumGlide, media.podiumGirls, media.podiumRyan];

// Podium step: index in the CMS list → { slot order on desktop, base height, rank }
const STEPS = [
  { order: 'lg:order-2', base: 'lg:min-h-[11rem]', rank: 1 },
  { order: 'lg:order-1', base: 'lg:min-h-[8rem]', rank: 2 },
  { order: 'lg:order-3', base: 'lg:min-h-[5.5rem]', rank: 3 },
];

export default function AchievementsSection({ achievements = [] }) {
  const podium = achievements.slice(0, 3);
  const rest = achievements.slice(3);

  return (
    <section id="achievements" className="relative bg-chalk py-20 sm:py-28 lg:py-36 lanes overflow-hidden">
      <div className="container-site">
        <SectionHeader
          eyebrow="Results"
          title={<>The podium<br />wall</>}
          lead="Medals PRSA skaters have brought home from district, RSFI state, national and inter-school championships."
        />

        {podium.length === 0 ? (
          <p className="mt-14 text-ink/60">Results will appear here after the next championship.</p>
        ) : (
          <div className="mt-16 lg:mt-24 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-4 items-end">
            {podium.map((a, i) => {
              const step = STEPS[i];
              return (
                <article key={a.id || i} className={`flex flex-col ${step.order}`} data-reveal style={{ '--reveal-delay': `${i * 120}ms` }}>
                  {/* Photo */}
                  <div className="relative rounded-2xl overflow-hidden bg-chalk-2 shadow-card group aspect-[4/3] lg:aspect-[4/5]">
                    <img
                      src={a.image_url || PODIUM_PHOTOS[i]}
                      alt={a.title}
                      className="img-zoom"
                      loading="lazy"
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PODIUM_PHOTOS[i]; }}
                    />
                    <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent text-white">
                      <span className="chip bg-race text-ink">{a.year} · {a.category}</span>
                      <p className="font-display font-extrabold uppercase text-5xl sm:text-6xl leading-none mt-3">{a.count_label}</p>
                    </div>
                  </div>

                  {/* Podium base */}
                  <div className={`mt-4 rounded-2xl bg-ink text-white p-5 sm:p-6 flex gap-5 items-start ${step.base} ${i === 0 ? 'lg:bg-cobalt' : ''}`}>
                    <span className="font-display font-extrabold text-6xl leading-none text-race shrink-0" aria-label={`Position ${step.rank}`}>{step.rank}</span>
                    <div className="min-w-0">
                      <h3 className="font-display font-bold uppercase text-2xl leading-none">{a.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/70 line-clamp-3">{a.description}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {rest.length > 0 && (
          <ul className="mt-10 grid sm:grid-cols-2 gap-3" data-reveal>
            {rest.map((a, i) => (
              <li key={a.id || i} className="card p-5 flex gap-4 items-start">
                <span className="font-display font-extrabold uppercase text-3xl leading-none text-cobalt shrink-0">{a.count_label}</span>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/50">{a.year} · {a.category}</p>
                  <h3 className="font-semibold mt-1 text-ink">{a.title}</h3>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
