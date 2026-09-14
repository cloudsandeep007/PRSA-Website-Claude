import React from 'react';
import { Calendar, MapPin, Ticket, Shield } from 'lucide-react';

const defaultEvents = [
  {
    id: 1,
    title: "Karnataka State Roller Skating Championship & Trials",
    category: "RSFI STATE CHAMPIONSHIP",
    date_str: "OCT 24 - 28",
    time_str: "6:00 AM onwards",
    location: "PRSA Banked Speed Track Arena, Electronic City",
    description: "Cadet, Sub-Junior & Junior Quad/Inline divisions. 300m Time Trial, 500m Sprint, and 1000m Rink Race selection trials.",
    image_url: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_10.jpg",
    registration_status: "Open"
  },
  {
    id: 2,
    title: "RSFI 62nd National Roller Skating Championship",
    category: "NATIONAL CHAMPIONSHIP",
    date_str: "NOV 10 - 14",
    time_str: "Full Day Fixtures",
    location: "National Velodrome Sports Complex",
    description: "Track & Road Speed, Inline Freestyle Slalom, and Roller Hockey showcase representing Team Karnataka.",
    image_url: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_11.jpg",
    registration_status: "Confirmed"
  },
  {
    id: 3,
    title: "Bengaluru Inter-School Speed Skating Cup",
    category: "INTER-SCHOOL TROPHY",
    date_str: "DEC 05 - 07",
    time_str: "7:00 AM – 5:00 PM",
    location: "PRSA Arena & HSR Campus Track",
    description: "Featuring 45+ participating schools across Bangalore. Medals awarded for Quad & Inline speed categories.",
    image_url: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_03.jpg",
    registration_status: "Open"
  }
];

export default function EventsSection({ events = [] }) {
  const displayEvents = events && events.length > 0 ? events : defaultEvents;

  return (
    <section className="w-full py-space-2xl bg-surface-container-lowest relative border-y border-outline-variant/20" id="events">
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-md">
          <div>
            <span className="font-label-uppercase text-label-uppercase tracking-widest text-secondary font-bold text-[11px]">
              COMPETITION CALENDAR
            </span>
            <h2 className="font-headline-xl text-2xl sm:text-3xl md:text-4xl text-primary font-bold mt-1">
              UPCOMING TOURNAMENTS & TRIALS
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-xl text-xs sm:text-sm">
              Official RSFI state trials, inter-school championships, and summer speed clinics.
            </p>
          </div>
        </div>

        <div className="space-y-space-md">
          {displayEvents.map((evt, idx) => {
            const dateParts = (evt.date_str || "TBA").split(' ');
            const monthPart = dateParts[0] || "EVENTS";
            const dayPart = dateParts.slice(1).join(' ') || "";

            return (
              <div
                key={evt.id || idx}
                className="bg-surface-container-low p-4 sm:p-space-md rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-space-md hover:bg-surface-container transition-colors border border-outline-variant/30 shadow-md"
              >
                {/* Left Block: Date + Event Details */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-space-md w-full">
                  {/* Date Badge + Category Pill (Row on Mobile) */}
                  <div className="flex items-center justify-between w-full sm:w-auto shrink-0 border-b sm:border-b-0 border-outline-variant/15 pb-2 sm:pb-0">
                    <div className="bg-surface-container-high px-3.5 py-2 rounded-xl text-center min-w-[90px] border border-outline-variant/30 shadow-inner">
                      <span className="font-label-uppercase text-[10px] text-secondary font-bold block tracking-wider">{monthPart}</span>
                      <span className="font-headline-md text-base sm:text-lg text-primary font-bold">{dayPart}</span>
                    </div>

                    <div className="sm:hidden flex flex-col items-end gap-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-secondary-container/40 text-secondary font-label-uppercase text-[9px] font-bold">
                        {evt.category || "TOURNAMENT"}
                      </span>
                      <span className="font-label-uppercase text-[9px] text-primary-container font-bold">
                        STATUS: {evt.registration_status || "OPEN"}
                      </span>
                    </div>
                  </div>

                  {/* Main Event Info */}
                  <div className="space-y-1.5 w-full min-w-0">
                    <div className="hidden sm:flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-secondary-container/40 text-secondary font-label-uppercase text-[10px] font-bold">
                        {evt.category || "TOURNAMENT"}
                      </span>
                      {evt.time_str && (
                        <span className="text-on-surface-variant text-xs">• {evt.time_str}</span>
                      )}
                    </div>

                    <h4 className="font-headline-sm text-base sm:text-lg text-primary font-bold leading-snug">
                      {evt.title}
                    </h4>

                    {evt.location && (
                      <div className="text-on-surface-variant text-xs flex items-start gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-primary-container shrink-0 mt-0.5" />
                        <span className="break-words">{evt.location}</span>
                      </div>
                    )}

                    {evt.description && (
                      <p className="font-body-sm text-xs text-on-surface-variant/90 leading-relaxed pt-0.5">
                        {evt.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Block: Status & Action Button */}
                <div className="flex items-center justify-between md:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-outline-variant/15 shrink-0 w-full md:w-auto">
                  <div className="hidden md:block text-right">
                    <span className="font-label-uppercase text-[10px] text-primary-container font-bold block uppercase tracking-wider">
                      STATUS: {evt.registration_status || "OPEN"}
                    </span>
                    <span className="font-body-sm text-[11px] text-on-surface-variant">PRSA Squad Delegation</span>
                  </div>

                  <a
                    href="#trial"
                    className="w-full md:w-auto text-center px-6 py-2.5 rounded-full bg-primary text-on-primary font-label-uppercase text-xs font-bold hover:bg-primary-container transition-colors shadow-md shrink-0"
                  >
                    Register Skater
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
