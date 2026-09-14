import React from 'react';
import { Shield, Zap, Award, CheckCircle } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="w-full py-space-2xl bg-surface relative" id="about-philosophy">
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
          {/* Left Side: Real PRSA Night-Lit Arena & Daytime Coaching Visuals */}
          <div className="lg:col-span-6 relative group">
            <div className="relative overflow-hidden rounded-xl bg-surface-container-high aspect-[4/3] shadow-2xl border border-outline-variant/30">
              <img
                src="https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_10.jpg"
                alt="PRSA Floodlit Synthetic Skating Arena at Night"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/90 via-transparent to-transparent"></div>

              {/* Live Biomechanics Floating Widget */}
              <div className="absolute bottom-4 left-4 right-4 bg-surface-container-lowest/90 backdrop-blur-xl p-space-md rounded-lg shadow-lg border border-outline-variant/30">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary-container animate-ping"></span>
                    <span className="font-label-uppercase text-label-uppercase tracking-widest text-primary font-bold text-[11px]">
                      PRSA FLOODLIT ARENA • BANGALORE
                    </span>
                  </div>
                  <span className="font-label-uppercase text-label-uppercase text-secondary font-bold text-[11px]">
                    NIGHT BATCHES ACTIVE
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center">
                  <div className="bg-surface-container-high/60 p-1.5 sm:p-2 rounded">
                    <span className="text-on-surface-variant font-label-uppercase text-[9px] sm:text-[10px] block">SURFACE</span>
                    <span className="text-primary font-headline-sm font-bold text-xs sm:text-sm">Banked Synthetic</span>
                  </div>
                  <div className="bg-surface-container-high/60 p-1.5 sm:p-2 rounded">
                    <span className="text-on-surface-variant font-label-uppercase text-[9px] sm:text-[10px] block">SAFETY RAILS</span>
                    <span className="text-secondary font-headline-sm font-bold text-xs sm:text-sm">Shock Guard</span>
                  </div>
                  <div className="bg-surface-container-high/60 p-1.5 sm:p-2 rounded">
                    <span className="text-on-surface-variant font-label-uppercase text-[9px] sm:text-[10px] block">LIGHTING</span>
                    <span className="text-primary-container font-headline-sm font-bold text-xs sm:text-sm">3000W Floodlit</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Inset Thumbnail */}
            <div className="hidden sm:block absolute -top-6 -right-6 w-48 h-36 rounded-lg overflow-hidden border-2 border-primary-container/40 shadow-2xl z-20">
              <img
                src="https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_03.jpg"
                alt="PRSA On-Rink Batch Coaching Session"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Side: Philosophy & Features */}
          <div className="lg:col-span-6 space-y-space-md">
            <div className="space-y-space-xs">
              <span className="font-label-uppercase text-label-uppercase tracking-widest text-primary-container font-bold text-[11px]">
                ABOUT PRSA BANGALORE
              </span>
              <h2 className="font-headline-xl text-2xl sm:text-3xl md:text-4xl text-primary font-bold leading-tight">
                BUILDING ATHLETES. <br />
                <span className="text-on-surface">SHAPING PODIUM CHAMPIONS.</span>
              </h2>
            </div>

            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Professional Roller Skating Academy (PRSA) operates specialized training facilities across South Bengaluru, including Electronic City, Neo Town, and HSR Layout corridors. Officially affiliated with the Roller Skating Federation of India (RSFI), we merge safety-first grassroots foundation with elite state & national speed racing.
            </p>

            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              From toddlers mastering balance on 4-wheel quad skates to championship racers tucking into high-velocity 110mm inline aerodynamic road sprints, our dedicated floodlit skating track provides the safest, most supportive arena in Karnataka.
            </p>

            {/* Feature Checklist Matrix */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low border border-outline-variant/20">
                <CheckCircle className="w-5 h-5 text-primary-container shrink-0" />
                <span className="font-body-sm text-on-surface">Certified Level 3 RSFI Coaches with 10+ years competitive track experience</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low border border-outline-variant/20">
                <CheckCircle className="w-5 h-5 text-primary-container shrink-0" />
                <span className="font-body-sm text-on-surface">Banked synthetic track with rubberized perimeter safety rails to prevent injury</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low border border-outline-variant/20">
                <CheckCircle className="w-5 h-5 text-primary-container shrink-0" />
                <span className="font-body-sm text-on-surface">Digital lap timing transponders & video analysis for speed squad athletes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
