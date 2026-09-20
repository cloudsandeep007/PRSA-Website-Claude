import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';

export default function FAQSection({ faqs = [], settings = {} }) {
  const [open, setOpen] = useState(0);
  const whatsapp = (settings.whatsapp || '919876543210').replace(/[^0-9]/g, '');

  return (
    <section id="faq" className="bg-white py-20 sm:py-28 lg:py-36 border-t border-concrete">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeader eyebrow="Questions" title={<>Before you<br />book</>} />
            <p className="mt-6 text-ink/65 leading-relaxed" data-reveal>
              Anything else? Message the academy on WhatsApp — a coach usually replies within the hour during batch times.
            </p>
            <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('Hi PRSA, I have a question about classes.')}`} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-6" data-reveal>
              Ask on WhatsApp
            </a>
          </div>

          <div className="lg:col-span-8 border-t border-ink/15" data-reveal>
            {faqs.length === 0 && <p className="py-8 text-ink/60">Questions and answers will appear here.</p>}
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.id || i} className="border-b border-ink/15">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full py-6 flex items-start justify-between gap-6 text-left group"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                  >
                    <span className="font-display font-bold uppercase text-2xl sm:text-3xl leading-none text-ink group-hover:text-cobalt transition-colors">{f.question}</span>
                    <span className={`w-9 h-9 rounded-full border border-ink/20 flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? 'bg-ink text-white rotate-45 border-ink' : 'text-ink group-hover:border-ink'}`}>
                      <Plus className="w-4 h-4" />
                    </span>
                  </button>
                  <div
                    id={`faq-${i}`}
                    className={`grid transition-[grid-template-rows] duration-400 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-7 pr-12 text-base leading-relaxed text-ink/70 max-w-2xl">{f.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
