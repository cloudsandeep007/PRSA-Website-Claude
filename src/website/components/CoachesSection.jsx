import React from 'react';
import { Award, Star, Trophy, Shield } from 'lucide-react';

const defaultCoaches = [
  {
    id: 1,
    name: "Coach Arjun Kumar",
    position: "Head Coach & Founder",
    photo_url: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_02.jpg",
    fallback_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    experience: "14+ Years Experience",
    specialization: "RSFI Certified • Inline Speed & National Squad Lead",
    achievements: "Former National Gold Medalist, Trained 45+ State Medalists",
    bio: "Chief Coach Arjun has over 14 years of professional coaching experience across Karnataka. He holds official Level 3 RSFI certification and leads PRSA's high-performance speed racing contingent."
  },
  {
    id: 2,
    name: "Coach Pooja Sharma",
    position: "Chief Tots & Quad Instructor",
    photo_url: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_05.jpg",
    fallback_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
    experience: "8+ Years Experience",
    specialization: "Child Biomechanics & Quad Foundations",
    achievements: "Certified Physical Educator, Specialist in Grassroots Confidence",
    bio: "Coach Pooja specializes in early childhood balance, fear elimination, and fun quad skate mastery. Her patient method has helped over 400 young kids fall in love with roller sports."
  },
  {
    id: 3,
    name: "Coach Rajesh Varma",
    position: "Freestyle Slalom & Technical Lead",
    photo_url: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_08.jpg",
    fallback_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    experience: "10+ Years Experience",
    specialization: "Artistic Slalom & Cone Precision",
    achievements: "National Slalom Judge, International Clinic Delegate",
    bio: "Coach Rajesh guides PRSA skaters through high-speed slalom tricks, rocker frame setup, and artistic posture for state & national competitions."
  }
];

export default function CoachesSection({ coaches = [] }) {
  const displayCoaches = coaches && coaches.length > 0 ? coaches : defaultCoaches;
  const isSingle = displayCoaches.length === 1;
  const isDouble = displayCoaches.length === 2;

  return (
    <section className="w-full py-space-2xl bg-surface relative" id="coaches">
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-space-2xl space-y-space-xs">
          <span className="font-label-uppercase text-label-uppercase tracking-widest text-primary-container font-bold text-[11px]">
            RSFI ACCREDITED INSTRUCTORS
          </span>
          <h2 className="font-headline-xl text-2xl sm:text-3xl md:text-4xl text-primary font-bold">
            MEET OUR CHIEF COACHES
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant text-xs sm:text-sm">
            Learn from decorated national champions and RSFI certified instructors committed to safety, technique, and podium success.
          </p>
        </div>

        {/* Coaches Centered Flex Container */}
        <div className="flex flex-wrap justify-center gap-space-lg max-w-6xl mx-auto">
          {displayCoaches.map((coach, idx) => {
            const fallbackImg = defaultCoaches[idx % defaultCoaches.length]?.fallback_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop";
            const imgSrc = coach.photo_url || fallbackImg;

            return (
              <div
                key={coach.id || idx}
                className={`bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/30 shadow-lg hover:border-primary-container/50 transition-all group flex flex-col justify-between ${
                  isSingle
                    ? 'w-full max-w-md'
                    : isDouble
                    ? 'w-full md:w-[calc(50%-1rem)] max-w-md'
                    : 'w-full md:w-[calc(33.333%-1.5rem)] max-w-md'
                }`}
              >
                <div>
                  {/* Photo & Telemetry Overlay */}
                  <div className="relative h-72 sm:h-80 overflow-hidden bg-surface-container-high">
                    <img
                      src={imgSrc}
                      alt={coach.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = fallbackImg;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent"></div>

                    <div className="absolute top-3 right-3 bg-surface-container-lowest/85 backdrop-blur px-2.5 py-1 rounded-full text-[10px] text-primary-container font-bold border border-primary-container/30">
                      {coach.experience || "RSFI Certified"}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-space-md sm:p-space-lg space-y-3">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-primary group-hover:text-primary-container transition-colors">
                        {coach.name}
                      </h3>
                      <span className="text-xs font-semibold text-secondary block mt-0.5">
                        {coach.position}
                      </span>
                    </div>

                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {coach.bio}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-outline-variant/20 text-xs">
                      <div className="flex items-center gap-2 text-on-surface">
                        <Shield className="w-4 h-4 text-primary-container shrink-0" />
                        <span className="truncate">{coach.specialization}</span>
                      </div>
                      {coach.achievements && (
                        <div className="flex items-center gap-2 text-secondary">
                          <Trophy className="w-4 h-4 text-secondary shrink-0" />
                          <span className="truncate font-medium">{coach.achievements}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-space-md sm:px-space-lg pb-space-md sm:pb-space-lg pt-2">
                  <a
                    href="#trial"
                    className="w-full py-3 rounded-full bg-surface-container-high hover:bg-primary hover:text-on-primary text-primary font-bold text-xs flex items-center justify-center transition-all shadow-sm"
                  >
                    Book Session with Coach
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
