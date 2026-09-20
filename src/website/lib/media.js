// Local, optimised copies of the academy's own photos (public/media/*.webp,
// generated from public/uploads). Used for the parts of the page the CMS does
// not control (About collage, podium wall backgrounds, fallbacks when a CMS
// row has no image). CMS rows keep their own image URLs.
export const media = {
  heroVideo: '/media/hero.mp4',
  heroPoster: '/media/hero-poster.webp',
  squadRoad: '/media/squad-road.webp',            // kids in a pace line on the road (portrait)
  rinkNight1: '/media/rink-night-1.webp',         // floodlit rink at night
  rinkNight2: '/media/rink-night-2.webp',
  sprintRoad: '/media/sprint-road.webp',          // single skater, yellow suit (portrait)
  podiumGlide: '/media/podium-glide-to-glory.webp',
  podiumRyan: '/media/podium-ryan.webp',
  podiumGirls: '/media/podium-girls.webp',
  podiumOutdoor: '/media/podium-outdoor.webp',
  coachDrill: '/media/coach-drill.webp',          // coach leading a drill with kids
  warmupPark: '/media/warmup-park.webp',          // warm-up in the park
  rinkSession: '/media/rink-session.webp',        // busy rink session
  roadPair: '/media/road-pair.webp',
  awardStage: '/media/award-stage.webp',
  stageAwards1: '/media/stage-awards-1.webp',
  stageAwards2: '/media/stage-awards-2.webp',
  coachFounder: '/media/coach-founder.webp',      // founder with a skater and lit wheels (portrait)
  coachSquare: '/media/coach-square.webp',
};

// Default gallery used only when the CMS gallery is empty.
export const defaultGallery = [
  { id: 'g1', title: 'Pace line on the road', category: 'Inline Speed', url: media.squadRoad, caption: 'Sunday road session, Electronic City' },
  { id: 'g2', title: 'Floodlit rink, evening batch', category: 'Rink', url: media.rinkNight1, caption: 'Banked synthetic track under lights' },
  { id: 'g3', title: 'Glide to Glory 2025', category: 'Podium', url: media.podiumGlide, caption: 'Inter-school championship podium' },
  { id: 'g4', title: 'Warm-up drills', category: 'Training', url: media.warmupPark, caption: 'Mobility before skates go on' },
  { id: 'g5', title: 'Sprint form', category: 'Inline Speed', url: media.sprintRoad, caption: 'Low tuck, long push' },
  { id: 'g6', title: 'Ryan International podium', category: 'Podium', url: media.podiumRyan, caption: 'Cadet division medallists' },
  { id: 'g7', title: 'Coach-led technique drill', category: 'Training', url: media.coachDrill, caption: 'Edge control and crossovers' },
  { id: 'g8', title: 'State podium', category: 'Podium', url: media.podiumGirls, caption: 'Gold and silver, girls sub-junior' },
  { id: 'g9', title: 'Full rink session', category: 'Rink', url: media.rinkSession, caption: 'Weekend open batch' },
  { id: 'g10', title: 'Rink at night', category: 'Rink', url: media.rinkNight2, caption: 'Empty track before the 6 pm batch' },
  { id: 'g11', title: 'Outdoor podium', category: 'Podium', url: media.podiumOutdoor, caption: 'District meet' },
  { id: 'g12', title: 'Two-up on the road', category: 'Inline Speed', url: media.roadPair, caption: 'Drafting practice' },
];
