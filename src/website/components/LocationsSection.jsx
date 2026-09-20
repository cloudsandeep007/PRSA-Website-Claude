import React, { useState } from 'react';
import { MapPin, Clock, Navigation, MessageCircle, Phone } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';
import { media } from '../lib/media';

const FALLBACK_LOCATION = {
  id: 'hq',
  name: 'PRSA Floodlit Skating Arena',
  tag_label: 'Main venue',
  address: 'Neo Town, Electronic City, Bengaluru, Karnataka 560100',
  phone: '+91 98765 43210',
  schedule: 'Morning 6:00 – 9:30 AM · Evening 5:00 – 8:30 PM',
  maps_url: 'https://maps.google.com/?q=Professional+Roller+Skating+Academy+Electronic+City+Bengaluru',
  description: 'Banked synthetic track under floodlights, with safety rails and spectator seating.',
  photo_url: media.rinkNight1,
};

export default function LocationsSection({ locations = [] }) {
  const list = locations.length ? locations : [FALLBACK_LOCATION];
  const [selected, setSelected] = useState(list[0]);

  const phone = (selected.phone || FALLBACK_LOCATION.phone);
  const waUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi PRSA! I'd like to visit ${selected.name}.`)}`;
  const mapQuery = encodeURIComponent(selected.address || `${selected.name} Bengaluru`);
  const mapSrc = `https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <section id="locations" className="bg-chalk py-20 sm:py-28 lg:py-36 border-t border-concrete">
      <div className="container-site">
        <SectionHeader
          eyebrow="Venues"
          title={<>Where we<br />train</>}
          lead="Morning and evening batches run at the academy's own floodlit track in Neo Town, Electronic City. Skates and protective gear are available on site for trial sessions."
        />

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Venue list */}
          <div className="lg:col-span-5 space-y-3">
            {list.map((loc, i) => {
              const isOn = selected.id === loc.id;
              return (
                <button
                  key={loc.id || i}
                  onClick={() => setSelected(loc)}
                  className={`w-full text-left rounded-2xl border p-5 sm:p-6 transition-all duration-300 ${isOn ? 'bg-ink text-white border-ink shadow-lift' : 'card hover:border-ink/40'}`}
                  aria-pressed={isOn}
                  data-reveal
                  style={{ '--reveal-delay': `${i * 80}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <span className={`chip ${isOn ? 'bg-race text-ink' : 'bg-cobalt/10 text-cobalt'}`}>{loc.tag_label || 'Venue'}</span>
                      <h3 className="font-display font-bold uppercase text-3xl leading-none mt-3">{loc.name}</h3>
                    </div>
                    {loc.photo_url && <img src={loc.photo_url} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
                  </div>
                  <p className={`mt-4 text-sm flex gap-2 items-start ${isOn ? 'text-white/75' : 'text-ink/65'}`}><MapPin className="w-4 h-4 shrink-0 mt-0.5 text-cobalt" />{loc.address}</p>
                  <p className={`mt-2 font-mono text-xs flex gap-2 items-start ${isOn ? 'text-white/60' : 'text-ink/55'}`}><Clock className="w-4 h-4 shrink-0 text-cobalt" />{loc.schedule}</p>
                  {loc.description && <p className={`mt-3 text-sm leading-relaxed ${isOn ? 'text-white/60' : 'text-ink/55'}`}>{loc.description}</p>}
                </button>
              );
            })}
          </div>

          {/* Map */}
          <div className="lg:col-span-7 card overflow-hidden flex flex-col min-h-[440px]" data-reveal style={{ '--reveal-delay': '160ms' }}>
            <iframe
              title={`Map of ${selected.name}`}
              src={mapSrc}
              className="w-full flex-1 min-h-[360px] grayscale-[35%] contrast-[1.05]"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen=""
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="p-5 sm:p-6 border-t border-concrete flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-semibold text-ink">{selected.name}</p>
                <p className="text-sm text-ink/55 line-clamp-1">{selected.address}</p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="btn-ghost !px-4 !py-2.5 text-[13px]"><Phone className="w-4 h-4" /> Call</a>
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost !px-4 !py-2.5 text-[13px]"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
                <a href={selected.maps_url || `https://maps.google.com/?q=${mapQuery}`} target="_blank" rel="noopener noreferrer" className="btn-cobalt !px-4 !py-2.5 text-[13px]"><Navigation className="w-4 h-4" /> Directions</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
