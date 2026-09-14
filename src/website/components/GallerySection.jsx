import React, { useState } from 'react';
import { Camera, X, Play, ZoomIn } from 'lucide-react';

const defaultGallery = [
  { id: 1, title: "Speed Squad Night Practice", category: "Inline Speed", url: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_10.jpg", fallback_url: "https://images.unsplash.com/photo-1547447134-cd3f5c716030?q=80&w=800&auto=format&fit=crop", caption: "3000W Floodlit Arena • Banked Synthetic Track" },
  { id: 2, title: "Tots Quad Balance Session", category: "Quad Skates", url: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_03.jpg", fallback_url: "https://images.unsplash.com/photo-1517649763962-0c623266010b?q=80&w=800&auto=format&fit=crop", caption: "Grassroots Foundation • Ages 4-7" },
  { id: 3, title: "RSFI State Medal Ceremony", category: "Events", url: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_01.jpg", fallback_url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop", caption: "State Championship Podium Winners" },
  { id: 4, title: "110mm Inline Sprint Drills", category: "Inline Speed", url: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_02.jpg", fallback_url: "https://images.unsplash.com/photo-1565992441121-4367c2967103?q=80&w=800&auto=format&fit=crop", caption: "High-Velocity Corner Crossovers" },
  { id: 5, title: "Artistic Slalom Cone Maneuver", category: "Events", url: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_05.jpg", fallback_url: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=800&auto=format&fit=crop", caption: "Freestyle Slalom & Rocker Frames" },
  { id: 6, title: "Inter-School Trophy Presentation", category: "Events", url: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_11.jpg", fallback_url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop", caption: "Overall Team Trophy Champions" },
  { id: 7, title: "Quad Track Sprints", category: "Quad Skates", url: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_06.jpg", fallback_url: "https://images.unsplash.com/photo-1517649763962-0c623266010b?q=80&w=800&auto=format&fit=crop", caption: "Safety Guard Rail Perimeter" },
  { id: 8, title: "Digital Lap Timing Telemetry", category: "Inline Speed", url: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_13.jpg", fallback_url: "https://images.unsplash.com/photo-1547447134-cd3f5c716030?q=80&w=800&auto=format&fit=crop", caption: "RSFI Transponder Lap Tracking" }
];

export default function GallerySection({ gallery = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeLightbox, setActiveLightbox] = useState(null);

  const displayGallery = gallery && gallery.length > 0 ? gallery : defaultGallery;
  const categories = ['All', 'Quad Skates', 'Inline Speed', 'Events'];

  const filteredGallery = displayGallery.filter(g => {
    if (selectedCategory === 'All') return true;
    return g.category === selectedCategory || (g.title && g.title.includes(selectedCategory));
  });

  return (
    <section className="w-full py-space-2xl bg-surface relative" id="gallery">
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-md">
          <div>
            <span className="font-label-uppercase text-label-uppercase tracking-widest text-primary-container font-bold text-[11px]">
              REAL RINK ACTION
            </span>
            <h2 className="font-headline-xl text-2xl sm:text-3xl md:text-4xl text-primary font-bold mt-1">
              PRSA MEDIA GALLERY
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-xl text-xs sm:text-sm">
              High-resolution action photography and video clips captured at our dedicated floodlit speed rink and championship meets.
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full font-label-uppercase text-[11px] font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary-container text-on-primary-container shadow-md'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-space-md">
          {filteredGallery.map((item, idx) => {
            const fallbackImg = defaultGallery[idx % defaultGallery.length]?.fallback_url || "https://images.unsplash.com/photo-1547447134-cd3f5c716030?q=80&w=800&auto=format&fit=crop";
            const mediaUrl = item.url || fallbackImg;

            return (
              <div
                key={item.id || idx}
                onClick={() => setActiveLightbox({ ...item, url: mediaUrl })}
                className="relative aspect-[4/3] rounded-xl overflow-hidden bg-surface-container-high border border-outline-variant/30 group cursor-pointer shadow-md hover:border-primary-container transition-all"
              >
                <img
                  src={mediaUrl}
                  alt={item.title || "PRSA Gallery Photo"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackImg;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity p-2.5 sm:p-3 flex flex-col justify-end">
                  <span className="text-[11px] sm:text-xs text-primary font-bold truncate">{item.title}</span>
                  {item.caption && (
                    <span className="text-[9px] sm:text-[10px] text-on-surface-variant line-clamp-1">{item.caption}</span>
                  )}
                </div>
                <div className="absolute top-2 right-2 p-1.5 rounded-full bg-surface-container-lowest/80 text-primary-container opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeLightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="relative max-w-4xl w-full p-2 space-y-2">
            <button
              onClick={() => setActiveLightbox(null)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-surface-container-high text-white hover:text-primary"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={activeLightbox.url}
              alt={activeLightbox.title}
              className="max-h-[80vh] w-auto mx-auto object-contain rounded-xl border border-outline-variant/30 shadow-2xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1547447134-cd3f5c716030?q=80&w=800&auto=format&fit=crop";
              }}
            />

            <div className="text-center space-y-1 pt-2">
              <h4 className="text-base sm:text-lg font-bold text-primary">{activeLightbox.title}</h4>
              <p className="text-xs text-on-surface-variant">{activeLightbox.caption}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
