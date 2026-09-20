import React from 'react';

// Four academy numbers from the CMS, set like a results board: big condensed
// figures, mono labels, hairline dividers.
export default function Metrics({ content = {} }) {
  const stats = [
    { val: content.stat_1_val || '850+', lbl: content.stat_1_lbl || 'Skaters trained' },
    { val: content.stat_2_val || '12+', lbl: content.stat_2_lbl || 'National medals' },
    { val: content.stat_3_val || '8', lbl: content.stat_3_lbl || 'RSFI certified coaches' },
    { val: content.stat_4_val || '100%', lbl: content.stat_4_lbl || 'Helmet & guard compliance' },
  ];

  return (
    <section className="bg-ink text-white border-t border-white/10 on-dark" aria-label="Academy numbers">
      <div className="container-site">
        <dl className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10 border-x border-white/10">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`px-5 sm:px-8 py-7 lg:py-9 ${i >= 2 ? 'border-t border-white/10 lg:border-t-0' : ''}`}
              data-reveal
              style={{ '--reveal-delay': `${i * 80}ms` }}
            >
              <dd className="font-display font-extrabold uppercase text-5xl sm:text-6xl lg:text-7xl leading-none tracking-tight">
                {s.val}
              </dd>
              <dt className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.16em] text-white/55 mt-3">
                {s.lbl}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
