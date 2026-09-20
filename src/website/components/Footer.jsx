import React, { useState } from 'react';
import { MapPin, Mail, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';

const NAV = [
  ['About', '#about'], ['Programs', '#programs'], ['Coaches', '#coaches'], ['Podium', '#achievements'],
  ['Gallery', '#gallery'], ['Events', '#events'], ['Venues', '#locations'], ['FAQ', '#faq'],
];
const PROGRAMS = [
  'Beginner Tots & Kids (4–7)', 'Basic & Recreational Quad', 'Intermediate Inline Velocity',
  'RSFI Speed Racing Squad', 'Artistic & Freestyle Slalom', 'Adult Fitness & Open Rink',
];

export default function Footer({ settings = {} }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const phone = settings.phone || '+91 98765 43210';

  return (
    <footer className="bg-ink text-white on-dark">
      {/* Big wordmark */}
      <div className="container-site pt-16 sm:pt-20 border-b border-white/10 overflow-hidden">
        <p className="t-display text-[26vw] sm:text-[22vw] lg:text-[18rem] xl:text-[21rem] leading-[0.78] text-white/[0.07] select-none whitespace-nowrap -mb-3 sm:-mb-5" aria-hidden="true">PRSA</p>
      </div>

      <div className="container-site py-14 sm:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="flex items-center gap-3">
            <img src="/logo/prsa_logo.png" alt="" className="h-11 w-11 object-contain" />
            <div className="leading-none">
              <p className="font-display font-extrabold uppercase text-2xl">PRSA</p>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 mt-1">Roller Skating Academy</p>
            </div>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-white/60 max-w-sm">
            {settings.academy_name || 'Professional Roller Skating Academy'} — RSFI-affiliated quad, inline speed and slalom
            coaching in South Bengaluru, for skaters from age 4 to national level.
          </p>
          <ul className="mt-6 space-y-2.5 text-sm text-white/70">
            <li className="flex gap-2.5 items-start"><MapPin className="w-4 h-4 text-race shrink-0 mt-0.5" />{settings.address || 'Electronic City / Neo Town, Bengaluru'}</li>
            <li className="flex gap-2.5 items-center"><Phone className="w-4 h-4 text-race shrink-0" /><a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-white">{phone}</a></li>
            <li className="flex gap-2.5 items-center"><Mail className="w-4 h-4 text-race shrink-0" /><a href={`mailto:${settings.email || 'admissions@prsaroller.com'}`} className="hover:text-white">{settings.email || 'admissions@prsaroller.com'}</a></li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">Academy</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV.map(([label, href]) => <li key={href}><a href={href} className="text-white/75 hover:text-white transition-colors">{label}</a></li>)}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">Programs</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {PROGRAMS.map(p => <li key={p}><a href="#programs" className="text-white/75 hover:text-white transition-colors">{p}</a></li>)}
            <li><a href="#trial" className="text-race font-semibold hover:underline">Book a free trial →</a></li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">Season bulletin</h3>
          <p className="mt-4 text-sm text-white/60 leading-relaxed">Championship dates, summer camps and squad trials — one email a month, nothing else.</p>
          {subscribed ? (
            <p className="mt-4 flex items-center gap-2 text-sm text-race"><CheckCircle2 className="w-4 h-4" /> You're on the list.</p>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); if (email) { setSubscribed(true); setEmail(''); } }} className="mt-4 flex gap-2">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" aria-label="Email address" className="field !py-3" />
              <button type="submit" className="btn-race !px-4 shrink-0" aria-label="Subscribe"><ArrowRight className="w-4 h-4" /></button>
            </form>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site py-6 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">
          <span>© {new Date().getFullYear()} PRSA · Professional Roller Skating Academy</span>
          <span className="flex items-center gap-5">
            <a href="#faq" className="hover:text-white">Safety</a>
            <a href="#trial" className="hover:text-white">Privacy</a>
            <a href="/admin/login" className="hover:text-white">Admin</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
