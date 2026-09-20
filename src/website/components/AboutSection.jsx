import React from 'react';
import { ShieldCheck, Footprints, Medal } from 'lucide-react';
import { media } from '../lib/media';

const PILLARS = [
  {
    icon: ShieldCheck,
    title: 'Safety before anything',
    text: 'Helmets and guards on every skater, every session. The first thing we teach is how to fall and get up without fear.',
  },
  {
    icon: Footprints,
    title: 'Technique before speed',
    text: 'Balance, stance, edges and stops on quads first. Speed comes naturally once the stride is right — not the other way round.',
  },
  {
    icon: Medal,
    title: 'A real path to the podium',
    text: 'Skaters who want to compete move into RSFI-registered squads with timed laps, race tactics and state and national fixtures.',
  },
];

export default function AboutSection({ settings = {} }) {
  return (
    <section id="about" className="relative bg-chalk py-20 sm:py-28 lg:py-36 overflow-hidden">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Statement */}
          <div className="lg:col-span-6 lg:pr-6">
            <span className="t-eyebrow text-cobalt inline-flex items-center gap-2" data-reveal>
              <span className="w-5 h-[2px] bg-cobalt" /> About the academy
            </span>
            <h2 className="t-h2 mt-5" data-reveal style={{ '--reveal-delay': '80ms' }}>
              Balance first.<br />
              Then speed.<br />
              <span className="text-cobalt">Then medals.</span>
            </h2>
            <div className="mt-8 space-y-5 t-lead max-w-xl" data-reveal style={{ '--reveal-delay': '160ms' }}>
              <p>
                Professional Roller Skating Academy trains skaters at its floodlit banked track in Neo Town, Electronic City,
                South Bengaluru, and in weekend road sessions nearby. We are affiliated with the Roller
                Skating Federation of India, so a child who starts here on quad skates has a clear route to state and
                national competition if they want it.
              </p>
              <p>
                Most of our skaters are between 4 and 14. Some come for confidence and fitness; some come to race.
                Every batch is small enough for the coach to know each child's stride by name.
              </p>
            </div>

            <ul className="mt-10 grid gap-3" data-reveal style={{ '--reveal-delay': '240ms' }}>
              {PILLARS.map(({ icon: Icon, title, text }) => (
                <li key={title} className="card p-5 sm:p-6 flex gap-4 items-start">
                  <span className="w-11 h-11 rounded-xl bg-cobalt/10 text-cobalt flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-display font-bold uppercase text-2xl leading-none text-ink">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/65">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Collage */}
          <div className="lg:col-span-6 relative lg:pl-4">
            <div className="grid grid-cols-12 grid-rows-6 gap-3 sm:gap-4 aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5]">
              <figure className="col-span-7 row-span-6 rounded-2xl overflow-hidden group relative" data-reveal>
                <img src={media.squadRoad} alt="A pace line of young PRSA skaters in helmets and speed suits on a Bengaluru road" className="img-zoom" loading="lazy" />
                <figcaption className="absolute bottom-3 left-3 chip bg-ink/70 text-white backdrop-blur">Sunday road session</figcaption>
              </figure>
              <figure className="col-span-5 row-span-3 rounded-2xl overflow-hidden group relative" data-reveal style={{ '--reveal-delay': '120ms' }}>
                <img src={media.rinkNight1} alt="PRSA's floodlit banked skating rink at night" className="img-zoom" loading="lazy" />
                <figcaption className="absolute bottom-3 left-3 chip bg-ink/70 text-white backdrop-blur">Floodlit track</figcaption>
              </figure>
              <figure className="col-span-5 row-span-3 rounded-2xl overflow-hidden group relative" data-reveal style={{ '--reveal-delay': '200ms' }}>
                <img src={media.coachDrill} alt="A coach leading a technique drill with young skaters" className="img-zoom" loading="lazy" />
                <figcaption className="absolute bottom-3 left-3 chip bg-ink/70 text-white backdrop-blur">Coach-led drills</figcaption>
              </figure>
            </div>

            {/* Affiliation tag */}
            <div className="absolute -bottom-5 left-4 sm:left-8 bg-race text-ink rounded-2xl px-5 py-4 shadow-lift rotate-[-2deg]" data-reveal style={{ '--reveal-delay': '300ms' }}>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em]">Affiliated with</span>
              <p className="font-display font-extrabold uppercase text-2xl leading-none mt-1">Roller Skating Federation of India</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
