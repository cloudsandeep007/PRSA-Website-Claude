import React from 'react';

// Eyebrow + display headline + optional lead, shared by every section so the
// rhythm of the page stays consistent.
export default function SectionHeader({ eyebrow, title, lead, align = 'left', dark = false, children, className = '' }) {
  const isCenter = align === 'center';
  return (
    <div className={`${isCenter ? 'text-center mx-auto max-w-3xl' : 'max-w-3xl'} ${className}`} data-reveal>
      {eyebrow && (
        <span className={`t-eyebrow inline-flex items-center gap-2 ${dark ? 'text-race' : 'text-cobalt'}`}>
          <span className={`inline-block w-5 h-[2px] ${dark ? 'bg-race' : 'bg-cobalt'}`} />
          {eyebrow}
        </span>
      )}
      <h2 className={`t-h2 mt-4 ${dark ? 'text-white' : 'text-ink'}`}>{title}</h2>
      {lead && <p className={`mt-5 text-base sm:text-lg leading-relaxed ${dark ? 'text-white/65' : 'text-ink/65'}`}>{lead}</p>}
      {children}
    </div>
  );
}
