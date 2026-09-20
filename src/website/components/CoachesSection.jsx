import React from 'react';
import { Award, Trophy, ShieldCheck } from 'lucide-react';
import { media } from '../lib/media';

// Used only if the CMS returns no coaches (mirrors the founder record in the database).
const DEFAULT_COACHES = [{
  id: 'founder',
  name: 'Imran Khan',
  position: 'Head Coach & Founder',
  photo_url: media.coachFounder,
  experience: '14+ years coaching',
  specialization: 'RSFI certified · Inline speed & national squad lead',
  achievements: 'Former national gold medallist · Trained 45+ state medallists',
  bio: 'Coach Imran has coached roller skating across Karnataka for over fourteen years. He holds RSFI Level 3 certification and leads the academy\'s high-performance speed squad.',
}];

function Credentials({ coach, light }) {
  const rows = [
    { icon: ShieldCheck, text: coach.specialization },
    { icon: Trophy, text: coach.achievements },
    { icon: Award, text: coach.experience },
  ].filter(r => r.text);
  return (
    <ul className={`space-y-3 ${light ? 'text-white/80' : 'text-ink/75'}`}>
      {rows.map(({ icon: Icon, text }, i) => (
        <li key={i} className="flex gap-3 items-start text-sm leading-relaxed">
          <Icon className="w-4 h-4 mt-1 text-race shrink-0" />
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}

export default function CoachesSection({ coaches = [] }) {
  const list = coaches.length ? coaches : DEFAULT_COACHES;
  const single = list.length === 1;

  return (
    <section id="coaches" className="relative bg-night text-white py-20 sm:py-28 lg:py-36 overflow-hidden on-dark">
      <div className="absolute inset-0 floodlight pointer-events-none" aria-hidden="true" />

      <div className="container-site relative">
        {single ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <figure className="lg:col-span-5 relative" data-reveal>
              <div className="aspect-[4/3] sm:aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden bg-night-2 group">
                <img
                  src={list[0].photo_url || media.coachFounder}
                  alt={list[0].name}
                  className="img-zoom object-top"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = media.coachFounder; }}
                />
              </div>
              <figcaption className="absolute -bottom-4 -right-2 sm:right-6 bg-race text-ink rounded-2xl px-5 py-3.5 shadow-lift">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em]">Experience</span>
                <p className="font-display font-extrabold uppercase text-3xl leading-none mt-0.5">{list[0].experience || 'RSFI certified'}</p>
              </figcaption>
            </figure>

            <div className="lg:col-span-7">
              <span className="t-eyebrow text-race inline-flex items-center gap-2" data-reveal>
                <span className="w-5 h-[2px] bg-race" /> Head coach
              </span>
              <h2 className="t-h2 mt-5 text-white" data-reveal style={{ '--reveal-delay': '80ms' }}>{list[0].name}</h2>
              <p className="font-mono text-sm uppercase tracking-[0.14em] text-white/55 mt-3" data-reveal style={{ '--reveal-delay': '140ms' }}>{list[0].position}</p>
              <p className="mt-7 text-base sm:text-lg leading-relaxed text-white/75 max-w-2xl" data-reveal style={{ '--reveal-delay': '200ms' }}>{list[0].bio}</p>
              <div className="mt-8 max-w-xl" data-reveal style={{ '--reveal-delay': '260ms' }}>
                <Credentials coach={list[0]} light />
              </div>
              <div className="mt-10" data-reveal style={{ '--reveal-delay': '320ms' }}>
                <a href="#trial" className="btn-race">Book an assessment with the coach</a>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div data-reveal>
                <span className="t-eyebrow text-race inline-flex items-center gap-2"><span className="w-5 h-[2px] bg-race" /> Coaches</span>
                <h2 className="t-h2 mt-5 text-white">The coaching team</h2>
                <p className="mt-5 text-base sm:text-lg leading-relaxed text-white/65 max-w-2xl">RSFI-certified coaches, most of them former competitive skaters. Every batch has one lead coach and a fixed group of skaters.</p>
              </div>
            </div>
            <div className="mt-14 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {list.map((c, i) => (
                <article key={c.id || i} className="rounded-3xl overflow-hidden bg-night-2 border border-white/10 group flex flex-col" data-reveal style={{ '--reveal-delay': `${(i % 3) * 90}ms` }}>
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={c.photo_url || media.coachFounder}
                      alt={c.name}
                      className="img-zoom"
                      loading="lazy"
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = media.coachFounder; }}
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-display font-bold uppercase text-3xl leading-none">{c.name}</h3>
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-race mt-2">{c.position}</p>
                    <p className="mt-4 text-sm leading-relaxed text-white/70">{c.bio}</p>
                    <div className="mt-5 pt-5 border-t border-white/10">
                      <Credentials coach={c} light />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
