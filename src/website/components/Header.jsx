import React, { useEffect, useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const NAV = [
  { href: '#about', label: 'About' },
  { href: '#programs', label: 'Programs' },
  { href: '#coaches', label: 'Coaches' },
  { href: '#achievements', label: 'Podium' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#events', label: 'Events' },
  { href: '#locations', label: 'Venues' },
  { href: '#faq', label: 'FAQ' },
];

export default function Header({ settings = {} }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const whatsappNum = (settings.whatsapp || '919876543210').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent('Hello PRSA! I want to enquire about skating classes.')}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock page scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const solid = scrolled || open;

  return (
    <>
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        solid ? 'bg-chalk/90 backdrop-blur-xl border-b border-ink/10' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="container-site h-[72px] lg:h-20 flex items-center justify-between gap-6">
        {/* Brand */}
        <a href="#top" className="flex items-center gap-3 shrink-0" aria-label="PRSA home">
          <img src="/logo/prsa_logo.png" alt="" className="h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 object-contain" />
          <span className="flex flex-col leading-none">
            <span className={`font-display font-extrabold text-[22px] tracking-wide uppercase ${solid ? 'text-ink' : 'text-white'}`}>PRSA</span>
            <span className={`hidden sm:block font-mono text-[9px] tracking-[0.2em] uppercase mt-1 ${solid ? 'text-ink/55' : 'text-white/65'}`}>Roller Skating Academy</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
          {NAV.map(item => (
            <a
              key={item.href}
              href={item.href}
              className={`px-3.5 py-2 rounded-full text-[13px] font-semibold tracking-tight transition-colors ${
                solid ? 'text-ink/70 hover:text-ink hover:bg-ink/5' : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-semibold transition-colors ${
              solid ? 'text-ink/70 hover:text-ink hover:bg-ink/5' : 'text-white/85 hover:text-white hover:bg-white/10'
            }`}
          >
            WhatsApp <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <a href="#trial" className={`${solid ? 'btn-cobalt' : 'btn-race'} !py-2 !px-3.5 sm:!py-2.5 sm:!px-5 text-[12px] sm:text-[13px]`}>
            <span className="sm:hidden">Free trial</span><span className="hidden sm:inline">Book a free trial</span>
          </a>
          <button
            onClick={() => setOpen(v => !v)}
            className={`lg:hidden p-2 sm:p-2.5 -mr-1 rounded-full transition-colors ${solid ? 'text-ink hover:bg-ink/5' : 'text-white hover:bg-white/10'}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </header>

      {/* Mobile drawer — a sibling of <header>, not a child: the header's
          backdrop-blur would otherwise become this fixed element's containing block. */}
      <div
        className={`lg:hidden fixed inset-x-0 top-[72px] bottom-0 z-[45] bg-chalk overflow-y-auto transition-all duration-300 ${
          open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-3 pointer-events-none'
        }`}
      >
        <nav className="container-site pt-6 pb-10 flex flex-col h-full" aria-label="Mobile">
          {NAV.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="t-display text-5xl text-ink py-3 border-b border-ink/10 flex items-center justify-between group"
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              {item.label}
              <ArrowUpRight className="w-6 h-6 text-ink/30 group-hover:text-cobalt transition-colors" />
            </a>
          ))}
          <div className="mt-auto pt-8 flex flex-col gap-3">
            <a href="#trial" onClick={() => setOpen(false)} className="btn-cobalt w-full">Book a free trial</a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost w-full">Chat on WhatsApp</a>
          </div>
        </nav>
      </div>
    </>
  );
}
