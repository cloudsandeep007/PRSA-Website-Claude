import React from 'react';
import { Star } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';

function Stars({ n = 5 }) {
  return (
    <span className="inline-flex gap-0.5 text-race" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: n }).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
    </span>
  );
}

export default function TestimonialsSection({ testimonials = [] }) {
  return (
    <section className="bg-white py-20 sm:py-28 lg:py-36 border-t border-concrete">
      <div className="container-site">
        <SectionHeader
          eyebrow="Parents & skaters"
          title={<>What families<br />say about PRSA</>}
          align="center"
        >
          <p className="mt-5 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-ink/60">
            <Stars /> 4.9 on Google · 240+ reviews
          </p>
        </SectionHeader>

        {testimonials.length === 0 ? (
          <p className="mt-14 text-center text-ink/60">Reviews from PRSA families will appear here.</p>
        ) : (
          <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
            {testimonials.map((t, i) => (
              <figure key={t.id || i} className="card p-7 sm:p-8 flex flex-col" data-reveal style={{ '--reveal-delay': `${i * 100}ms` }}>
                <div className="flex items-start justify-between">
                  <span className="font-display font-extrabold text-7xl leading-[0.6] text-cobalt select-none" aria-hidden="true">“</span>
                  <Stars n={t.rating || 5} />
                </div>
                <blockquote className="mt-4 text-base sm:text-[17px] leading-relaxed text-ink/85 flex-1">{t.quote}</blockquote>
                <figcaption className="mt-7 pt-6 border-t border-concrete flex items-center gap-3">
                  {t.photo_url ? (
                    <img src={t.photo_url} alt="" className="w-11 h-11 rounded-full object-cover" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  ) : (
                    <span className="w-11 h-11 rounded-full bg-cobalt/10 text-cobalt flex items-center justify-center font-display font-bold text-lg">{(t.name || '?').slice(0, 2).toUpperCase()}</span>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-ink leading-tight">{t.name}</p>
                    <p className="text-xs text-ink/55 mt-0.5">{t.role_desc}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
