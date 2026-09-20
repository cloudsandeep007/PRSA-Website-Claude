import React from 'react';
import { MapPin, Clock, ArrowUpRight } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';

const STATUS_STYLE = {
  open: 'bg-race text-ink',
  confirmed: 'bg-cobalt text-white',
  closed: 'bg-ink/10 text-ink/60',
};

export default function EventsSection({ events = [] }) {
  return (
    <section id="events" className="bg-chalk py-20 sm:py-28 lg:py-36 border-t border-concrete">
      <div className="container-site">
        <SectionHeader
          eyebrow="Calendar"
          title={<>Upcoming<br />championships &amp; trials</>}
          lead="Fixtures PRSA squads are entering this season. Registration for skaters in the competitive batches goes through the academy."
        />

        {events.length === 0 ? (
          <p className="mt-14 text-ink/60">No fixtures announced yet. Follow the academy on WhatsApp for the season calendar.</p>
        ) : (
          <ol className="mt-14 border-t border-ink/15">
            {events.map((e, i) => {
              const [month, ...rest] = (e.date_str || 'TBA').split(' ');
              const day = rest.join(' ');
              const status = (e.registration_status || 'open').toLowerCase();
              return (
                <li key={e.id || i} className="border-b border-ink/15 py-7 sm:py-8 grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-start group" data-reveal style={{ '--reveal-delay': `${i * 80}ms` }}>
                  <div className="md:col-span-3 flex md:block items-baseline gap-3">
                    <span className="font-mono text-xs uppercase tracking-[0.18em] text-cobalt">{month}</span>
                    <span className="block font-display font-extrabold uppercase text-5xl lg:text-6xl leading-none text-ink whitespace-nowrap">{day}</span>
                  </div>

                  <div className="md:col-span-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="chip bg-ink text-white">{e.category || 'Championship'}</span>
                      <span className={`chip ${STATUS_STYLE[status] || STATUS_STYLE.open}`}>{e.registration_status || 'Open'}</span>
                    </div>
                    <h3 className="font-display font-bold uppercase text-3xl sm:text-4xl leading-[0.95] mt-3 text-ink">{e.title}</h3>
                    {e.description && <p className="mt-3 text-sm sm:text-base leading-relaxed text-ink/65 max-w-2xl">{e.description}</p>}
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-ink/60">
                      {e.location && <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-cobalt" />{e.location}</span>}
                      {e.time_str && <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-cobalt" />{e.time_str}</span>}
                    </div>
                  </div>

                  <div className="md:col-span-3 md:justify-self-end md:self-center">
                    <a href="#trial" className="btn-ghost group-hover:bg-ink group-hover:text-white group-hover:border-ink">
                      Register a skater <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}
