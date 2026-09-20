import React from 'react';

// Continuous cobalt band of the things a parent scans for first: where, who,
// which disciplines. Duplicated once so the marquee loops seamlessly.
export default function Ticker({ content = {} }) {
  const raw = content.hero_sub_badge || 'Electronic City • Neo Town • Floodlit arena';
  const items = raw.split(/[•·|]/).map(s => s.trim()).filter(Boolean);
  const fixed = ['RSFI affiliated', 'Quad skates', 'Inline speed', 'Freestyle slalom', 'Ages 4 to adult', 'Free trial class'];
  const line = [...items, ...fixed];

  const Row = () => (
    <div className="flex items-center shrink-0">
      {line.map((t, i) => (
        <span key={i} className="flex items-center font-display font-bold uppercase text-xl sm:text-2xl tracking-wide whitespace-nowrap">
          <span className="px-6 sm:px-8">{t}</span>
          <span className="w-2 h-2 rounded-full bg-race" aria-hidden="true" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="bg-cobalt text-white overflow-hidden py-3.5 select-none on-dark" aria-hidden="true">
      <div className="flex w-max animate-marquee">
        <Row /><Row />
      </div>
    </div>
  );
}
