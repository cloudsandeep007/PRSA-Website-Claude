import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import HeroEditor from './content/HeroEditor';
import CrudSection from '../components/CrudSection';
import { apiRequest } from '../lib/apiClient';
import {
  ProgramCard, CoachCard, EventCard, AchievementCard,
  GalleryCard, TestimonialCard, LocationCard, FaqCard
} from '../components/contentCards';

const CRUD_TABS = [
  { id: 'programs', name: 'Programs', renderCard: ProgramCard, gridClassName: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
  { id: 'coaches', name: 'Coaches', renderCard: CoachCard, gridClassName: 'grid grid-cols-1 md:grid-cols-3 gap-4' },
  { id: 'events', name: 'Events', renderCard: EventCard, gridClassName: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
  { id: 'achievements', name: 'Achievements', renderCard: AchievementCard, gridClassName: 'grid grid-cols-1 md:grid-cols-3 gap-4' },
  { id: 'gallery', name: 'Gallery', renderCard: GalleryCard, gridClassName: 'grid grid-cols-2 md:grid-cols-4 gap-4' },
  { id: 'testimonials', name: 'Testimonials', renderCard: TestimonialCard, gridClassName: 'grid grid-cols-1 md:grid-cols-3 gap-4' },
  { id: 'locations', name: 'Locations', renderCard: LocationCard, gridClassName: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
  { id: 'faqs', name: 'FAQs', renderCard: FaqCard, gridClassName: 'space-y-3', addLabel: 'Add New FAQ' }
];

export default function ContentManager({ authToken }) {
  const [activeTab, setActiveTab] = useState('hero');
  const [content, setContent] = useState(null);
  const [contentError, setContentError] = useState('');

  useEffect(() => {
    apiRequest('/api/content')
      .then(setContent)
      .catch((err) => setContentError(err.message));
  }, []);

  const tabs = [{ id: 'hero', name: 'Homepage & Hero' }, ...CRUD_TABS.map(t => ({ id: t.id, name: t.name }))];

  return (
    <div className="space-y-6">
      <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-primary">Website Content Management System</h2>
          <p className="text-xs text-on-surface-variant">Visual non-coder CMS for updating headlines, programs, coaches, events, gallery, and text</p>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-surface-container-high text-xs text-primary font-bold hover:bg-primary hover:text-on-primary transition-all flex items-center gap-1.5 shrink-0"
        >
          <Eye className="w-4 h-4" />
          <span>Preview Live Website</span>
        </a>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-outline-variant/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl font-label-uppercase text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-primary-container text-on-primary-container shadow-md'
                : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {activeTab === 'hero' && (
        contentError ? (
          <div className="text-xs text-red-300 p-4">Failed to load hero content: {contentError}</div>
        ) : !content ? (
          <div className="text-xs text-primary p-4">Loading hero content...</div>
        ) : (
          <HeroEditor content={content} onContentChange={setContent} authToken={authToken} />
        )
      )}

      {CRUD_TABS.filter(t => t.id === activeTab).map(t => (
        <CrudSection
          key={t.id}
          entityKey={t.id}
          authToken={authToken}
          gridClassName={t.gridClassName}
          renderCard={t.renderCard}
          addLabel={t.addLabel}
        />
      ))}
    </div>
  );
}
