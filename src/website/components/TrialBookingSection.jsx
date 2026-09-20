import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { media } from '../lib/media';

const DISCIPLINES = [
  'Beginner Assessment (Tots & Kids 4–7)',
  'Quad Skates (Basic & Recreational)',
  'Inline Speed Skates (Competitive Track)',
  'Artistic & Freestyle Slalom',
  'Adult Fitness & Open Rink',
];
const EXPERIENCE = ['First timer', 'Can glide and turn', 'Has competed before'];

const INCLUDED = [
  'Skates, helmet, knee and elbow guards — fitted at the rink',
  'A 45-minute session led by an RSFI-certified coach',
  'The coach\'s batch recommendation before you leave',
  'Parents stay trackside for the whole session',
];

function emptyForm(locations) {
  return {
    athlete_name: '',
    age: '',
    parent_phone: '',
    email: '',
    discipline: DISCIPLINES[0],
    location: locations.length ? locations[0].name : 'PRSA Floodlit Skating Arena',
    experience: EXPERIENCE[0],
    message: '',
  };
}

export default function TrialBookingSection({ locations = [], settings = {} }) {
  const [form, setForm] = useState(() => emptyForm(locations));
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const set = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  // Fallback when the booking API cannot be reached: the same details, sent
  // to the academy's WhatsApp number as a pre-written message.
  const whatsappNum = (settings.whatsapp || '919876543210').replace(/[^0-9]/g, '');
  const whatsappFallback = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(
    `Hi PRSA, I'd like to book a free trial.
Skater: ${form.athlete_name} (age ${form.age})
Phone: ${form.parent_phone}
Email: ${form.email}
Program: ${form.discipline}
Venue: ${form.location}
Experience: ${form.experience}${form.message ? `
Notes: ${form.message}` : ''}`
  )}`;

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/trial-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setDone(true);
        setForm(emptyForm(locations));
      } else {
        setError(data.error || 'We could not save your booking right now. Send the same details on WhatsApp instead.');
      }
    } catch (err) {
      setError('We could not reach the booking service. Send the same details on WhatsApp instead.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="trial" className="relative bg-night text-white py-20 sm:py-28 lg:py-36 overflow-hidden on-dark">
      <div className="absolute inset-0 floodlight pointer-events-none" aria-hidden="true" />
      <div className="container-site relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Pitch */}
          <div className="lg:col-span-5">
            <span className="t-eyebrow text-race inline-flex items-center gap-2" data-reveal>
              <span className="w-5 h-[2px] bg-race" /> Free trial class
            </span>
            <h2 className="t-h2 mt-5 text-white" data-reveal style={{ '--reveal-delay': '80ms' }}>
              Try a class.<br />No skates needed.
            </h2>
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-white/70 max-w-lg" data-reveal style={{ '--reveal-delay': '160ms' }}>
              Fill in the form and the academy will call you within two working hours to fix a slot. The trial is free
              and there is no obligation to enrol.
            </p>

            <ul className="mt-8 space-y-3" data-reveal style={{ '--reveal-delay': '240ms' }}>
              {INCLUDED.map(t => (
                <li key={t} className="flex gap-3 items-start text-sm sm:text-[15px] text-white/80">
                  <CheckCircle2 className="w-5 h-5 text-race shrink-0 mt-0.5" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>

            <figure className="mt-10 hidden lg:flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4" data-reveal style={{ '--reveal-delay': '320ms' }}>
              <img src={media.coachSquare} alt="Head coach fitting a skate for a young student" className="w-20 h-20 rounded-xl object-cover" loading="lazy" />
              <figcaption className="text-sm text-white/70 leading-relaxed">
                Every trial is taken by a lead coach — the same coach who will run your child's batch.
              </figcaption>
            </figure>
          </div>

          {/* Form */}
          <div className="lg:col-span-7" data-reveal style={{ '--reveal-delay': '120ms' }}>
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6 sm:p-8 lg:p-10">
              {done ? (
                <div className="py-10 text-center animate-rise-in">
                  <span className="w-16 h-16 rounded-full bg-race text-ink flex items-center justify-center mx-auto"><CheckCircle2 className="w-8 h-8" /></span>
                  <h3 className="t-display text-5xl mt-6">Booked.</h3>
                  <p className="mt-4 text-white/70 max-w-md mx-auto leading-relaxed">
                    Thanks — the academy will call you within two working hours to confirm a slot and skate size.
                  </p>
                  <button onClick={() => setDone(false)} className="btn-ghost-light mt-8">Book another trial</button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-5" noValidate={false}>
                  {error && (
                    <div role="alert" className="rounded-xl border border-race/40 bg-race/10 text-race text-sm p-3.5 flex flex-col sm:flex-row gap-3 sm:items-center">
                      <span className="flex gap-2.5 items-start flex-1"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> <span>{error}</span></span>
                      <a href={whatsappFallback} target="_blank" rel="noopener noreferrer" className="btn-race !py-2 !px-4 text-[13px] shrink-0">Send on WhatsApp</a>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="athlete_name" className="field-label">Skater's name</label>
                      <input id="athlete_name" name="athlete_name" value={form.athlete_name} onChange={set} required placeholder="e.g. Aarav Sharma" className="field" autoComplete="name" />
                    </div>
                    <div>
                      <label htmlFor="age" className="field-label">Skater's age</label>
                      <input id="age" name="age" type="number" min="4" max="75" value={form.age} onChange={set} required placeholder="e.g. 7" className="field" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="parent_phone" className="field-label">Parent's phone</label>
                      <input id="parent_phone" name="parent_phone" type="tel" value={form.parent_phone} onChange={set} required placeholder="+91 98765 43210" className="field" autoComplete="tel" />
                    </div>
                    <div>
                      <label htmlFor="email" className="field-label">Email</label>
                      <input id="email" name="email" type="email" value={form.email} onChange={set} required placeholder="you@example.com" className="field" autoComplete="email" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="discipline" className="field-label">Program</label>
                      <select id="discipline" name="discipline" value={form.discipline} onChange={set} className="field appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22white%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-no-repeat bg-[right_1rem_center] pr-10">
                        {DISCIPLINES.map(d => <option key={d} className="text-ink">{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="location" className="field-label">Venue</label>
                      <select id="location" name="location" value={form.location} onChange={set} className="field appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22white%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-no-repeat bg-[right_1rem_center] pr-10">
                        {(locations.length ? locations : [{ id: 0, name: form.location }]).map(l => <option key={l.id} value={l.name} className="text-ink">{l.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <fieldset>
                    <legend className="field-label">Skating experience</legend>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {EXPERIENCE.map(x => (
                        <label key={x} className={`rounded-xl border px-4 py-3 text-sm cursor-pointer transition-colors flex items-center gap-2.5 ${form.experience === x ? 'bg-race text-ink border-race font-semibold' : 'border-white/15 text-white/75 hover:border-white/40'}`}>
                          <input type="radio" name="experience" value={x} checked={form.experience === x} onChange={set} className="sr-only" />
                          <span className={`w-2 h-2 rounded-full ${form.experience === x ? 'bg-ink' : 'bg-white/30'}`} aria-hidden="true" />
                          {x}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div>
                    <label htmlFor="message" className="field-label">Anything the coach should know <span className="normal-case tracking-normal text-white/35">(optional)</span></label>
                    <textarea id="message" name="message" value={form.message} onChange={set} rows={3} placeholder="Preferred days, past injuries, a sibling who also wants to try…" className="field resize-none" />
                  </div>

                  <button type="submit" disabled={loading} className="btn-race w-full !py-4 text-[15px] disabled:opacity-60 disabled:hover:translate-y-0">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : <>Book my free trial <ArrowRight className="w-4 h-4" /></>}
                  </button>
                  <p className="font-mono text-[11px] text-white/40 text-center tracking-wider">No payment. No obligation. We'll call to confirm.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
