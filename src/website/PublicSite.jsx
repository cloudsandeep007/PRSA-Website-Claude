import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Metrics from './components/Metrics';
import Ticker from './components/Ticker';
import AboutSection from './components/AboutSection';
import ProgramsSection from './components/ProgramsSection';
import CoachesSection from './components/CoachesSection';
import AchievementsSection from './components/AchievementsSection';
import GallerySection from './components/GallerySection';
import EventsSection from './components/EventsSection';
import TestimonialsSection from './components/TestimonialsSection';
import TrialBookingSection from './components/TrialBookingSection';
import LocationsSection from './components/LocationsSection';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import useReveal from './hooks/useReveal';
import {
  defaultContent, defaultSettings, defaultPrograms, defaultCoaches, defaultEvents,
  defaultAchievements, defaultGallery, defaultTestimonials, defaultLocations, defaultFaqs,
} from './lib/defaults';

// Loads one endpoint. Only when the request itself fails (network error,
// 5xx, malformed body) does the built-in default take over — a deployment
// whose API is down still shows a complete site. When the API answers, its
// data is used as-is, including a deliberately empty list.
async function fetchJson(url, fallback) {
  try {
    const res = await fetch(url);
    if (!res.ok) return fallback;
    const data = await res.json();
    if (Array.isArray(fallback) && !Array.isArray(data)) return fallback;
    if (!Array.isArray(fallback) && (typeof data !== 'object' || data === null)) return fallback;
    return data;
  } catch (err) {
    return fallback;
  }
}

export default function PublicSite() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    content: {}, settings: {}, programs: [], coaches: [], events: [],
    achievements: [], gallery: [], testimonials: [], locations: [], faqs: [],
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [content, settings, programs, coaches, events, achievements, gallery, testimonials, locations, faqs] = await Promise.all([
        fetchJson('/api/content', defaultContent),
        fetchJson('/api/settings', defaultSettings),
        fetchJson('/api/programs', defaultPrograms),
        fetchJson('/api/coaches', defaultCoaches),
        fetchJson('/api/events', defaultEvents),
        fetchJson('/api/achievements', defaultAchievements),
        fetchJson('/api/gallery', defaultGallery),
        fetchJson('/api/testimonials', defaultTestimonials),
        fetchJson('/api/locations', defaultLocations),
        fetchJson('/api/faqs', defaultFaqs),
      ]);
      if (cancelled) return;
      // Key/value endpoints: fill any key the CMS has not set from the defaults
      setData({
        content: { ...defaultContent, ...content },
        settings: { ...defaultSettings, ...settings },
        programs, coaches, events, achievements, gallery, testimonials, locations, faqs,
      });
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  // Wire up scroll reveals once content has rendered
  useReveal([loading]);

  useEffect(() => {
    if (data.settings.meta_title) document.title = data.settings.meta_title;
  }, [data.settings.meta_title]);

  if (loading) {
    return (
      <div className="site min-h-screen bg-ink text-white flex flex-col items-center justify-center gap-5">
        <img src="/logo/prsa_logo.png" alt="" className="h-14 w-14 object-contain animate-pulse" />
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">Loading the academy</span>
      </div>
    );
  }

  const { content, settings, programs, coaches, events, achievements, gallery, testimonials, locations, faqs } = data;

  return (
    <div className="site min-h-screen">
      <Header settings={settings} />
      <main>
        <Hero content={content} settings={settings} />
        <Metrics content={content} />
        <Ticker content={content} />
        <AboutSection settings={settings} />
        <ProgramsSection programs={programs} />
        <CoachesSection coaches={coaches} />
        <AchievementsSection achievements={achievements} />
        <GallerySection gallery={gallery} />
        <EventsSection events={events} />
        <TestimonialsSection testimonials={testimonials} />
        <TrialBookingSection locations={locations} settings={settings} />
        <LocationsSection locations={locations} />
        <FAQSection faqs={faqs} settings={settings} />
      </main>
      <Footer settings={settings} />
      <FloatingWhatsApp whatsappNumber={settings.whatsapp} />
    </div>
  );
}
