import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Metrics from './components/Metrics';
import AboutSection from './components/AboutSection';
import ProgramsSection from './components/ProgramsSection';
import CoachesSection from './components/CoachesSection';
import AchievementsSection from './components/AchievementsSection';
import GallerySection from './components/GallerySection';
import EventsSection from './components/EventsSection';
import TestimonialsSection from './components/TestimonialsSection';
import TrialBookingSection from './components/TrialBookingSection';
import LocationsSection from './components/LocationsSection';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';
import { Loader2 } from 'lucide-react';

export default function PublicSite() {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({});
  const [settings, setSettings] = useState({});
  const [programs, setPrograms] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [events, setEvents] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [locations, setLocations] = useState([]);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    // fetch() only rejects on a network failure, not on a 4xx/5xx response —
    // an API error still resolves with a parseable (non-array/object-shaped)
    // JSON body, which would otherwise slip past .catch() and crash the page
    // the first time any single endpoint has a transient failure.
    async function fetchJson(url, fallback) {
      try {
        const res = await fetch(url);
        if (!res.ok) return fallback;
        const data = await res.json();
        if (Array.isArray(fallback) && !Array.isArray(data)) return fallback;
        return data;
      } catch (err) {
        return fallback;
      }
    }

    async function fetchAllData() {
      try {
        const [
          resContent, resSettings, resPrograms, resCoaches, resEvents,
          resAch, resGallery, resTest, resLoc, resFaqs
        ] = await Promise.all([
          fetchJson('/api/content', {}),
          fetchJson('/api/settings', {}),
          fetchJson('/api/programs', []),
          fetchJson('/api/coaches', []),
          fetchJson('/api/events', []),
          fetchJson('/api/achievements', []),
          fetchJson('/api/gallery', []),
          fetchJson('/api/testimonials', []),
          fetchJson('/api/locations', []),
          fetchJson('/api/faqs', [])
        ]);

        setContent(resContent || {});
        setSettings(resSettings || {});
        setPrograms(resPrograms || []);
        setCoaches(resCoaches || []);
        setEvents(resEvents || []);
        setAchievements(resAch || []);
        setGallery(resGallery || []);
        setTestimonials(resTest || []);
        setLocations(resLoc || []);
        setFaqs(resFaqs || []);
      } catch (err) {
        console.error('Failed to load website data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center space-y-4 text-primary">
        <Loader2 className="w-10 h-10 animate-spin text-primary-container" />
        <div className="font-headline-sm text-sm tracking-widest uppercase">Loading PRSA Academy Arena...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
      <Header settings={settings} />
      <main className="w-full pt-20 bg-surface">
        <Hero content={content} settings={settings} />
        <Metrics content={content} />
        <AboutSection />
        <ProgramsSection programs={programs} />
        <CoachesSection coaches={coaches} />
        <AchievementsSection achievements={achievements} />
        <GallerySection gallery={gallery} />
        <EventsSection events={events} />
        <TestimonialsSection testimonials={testimonials} />
        <TrialBookingSection locations={locations} />
        <LocationsSection locations={locations} />
        <FAQSection faqs={faqs} />
      </main>
      <Footer settings={settings} />
      <FloatingWhatsApp whatsappNumber={settings.whatsapp} />
    </div>
  );
}
