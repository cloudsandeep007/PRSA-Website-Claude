// Built-in content used only when an API endpoint cannot be reached (for
// example a deployment whose database environment variables are not set).
// It mirrors the database seed (server/seed.js) but points at the photos
// bundled with the site, so the page is never blank. When the API answers —
// even with an empty list — the CMS content always wins.
import { media, defaultGallery } from './media';

export const defaultSettings = {
  academy_name: 'Professional Roller Skating Academy (PRSA)',
  tagline: 'Unleash Speed. Master The Rink.',
  phone: '+91 98765 43210',
  whatsapp: '919876543210',
  email: 'admissions@prsaroller.com',
  address: 'PRSA Banked Speed Track Arena, Electronic City / Neo Town Corridor, Bengaluru, Karnataka 560100',
  business_hours: 'Morning: 6:00 AM – 9:30 AM | Evening: 5:00 PM – 8:30 PM (Tue - Sun)',
  meta_title: 'PRSA — Official RSFI Roller Skating Academy Bengaluru',
};

export const defaultContent = {
  hero_type: 'video',
  hero_badge: 'Official RSFI affiliated academy • Bengaluru, Karnataka',
  hero_sub_badge: 'Electronic City • Neo Town • HSR Layout • Floodlit arena',
  hero_title_1: 'Unleash speed.',
  hero_title_2: 'Master the rink.',
  hero_description: 'Official RSFI roller skating training in Bangalore. From beginner balance and falling safety to podium medals at Ryan International, Viva Vibgyor, and State/National Championships.',
  hero_cta_primary_text: 'Book a free trial class',
  hero_cta_primary_link: '#trial',
  hero_cta_secondary_text: 'See the academy',
  hero_cta_secondary_link: '#gallery',
  stat_1_val: '850+', stat_1_lbl: 'Active skaters trained',
  stat_2_val: '12+', stat_2_lbl: 'National championship medals',
  stat_3_val: '8 RSFI', stat_3_lbl: 'Certified chief coaches',
  stat_4_val: '100%', stat_4_lbl: 'Safety & helmet compliance',
};

export const defaultPrograms = [
  { id: 'p1', name: 'Beginner Tots & Kids', age_group: 'Ages 4 – 7', level: 'Grassroots Foundation', image_url: media.warmupPark, schedule: '3x Weekly • 45 Min', duration: '3 Months Level 1',
    short_desc: 'Fun balance, safe falling reflexes, motor coordination and introductory quad skates. Designed to remove fear and build cheerful athletic confidence.',
    full_desc: 'Our Tots program focuses on safety-first movement, gentle balance drills on 4-wheel quad skates and gamified slalom obstacles. Protective gear and helmets are required and provided for trial sessions.' },
  { id: 'p2', name: 'Basic & Recreational Quad Skating', age_group: 'Ages 6+ & Youth', level: 'Foundational Track', image_url: media.rinkSession, schedule: '3x Weekly • 60 Min', duration: '4 Months Module',
    short_desc: 'The core foundational curriculum. Master stride pushing, heel and toe stops, inside/outside edge control and track awareness on quad and inline skates.',
    full_desc: 'Students learn proper posture, parallel stride returns, T-braking and spin stops. Prepares skaters for both recreation and competitive squad tryouts.' },
  { id: 'p3', name: 'Intermediate Quad & Inline Velocity', age_group: 'Velocity Tier', level: 'Intermediate Speed', image_url: media.coachDrill, schedule: '4x Weekly • 75 Min', duration: '6 Months Squad',
    short_desc: 'Translating baseline control into high-velocity track performance. Introduces banked corner crossovers, slipstream drafting and interval endurance.',
    full_desc: 'Focuses on high-speed corner crossovers, aerodynamic tuck positions, cadence and endurance building on banked synthetic track surfaces.' },
  { id: 'p4', name: 'RSFI Speed Roller Racing (Elite Squad)', age_group: 'Competitive Podium', level: 'National Level', image_url: media.sprintRoad, schedule: '5x Weekly • 90 Min', duration: 'Annual High-Performance',
    short_desc: 'RSFI sanctioned speed track and road squad. Transponder timing, 110mm inline speed boots, tactical race simulation and state/national preparation.',
    full_desc: 'Designed for elite speed racers preparing for district, state and RSFI National Championships. Features electronic lap timing, sprint interval training and customised athlete nutrition plans.' },
  { id: 'p5', name: 'Artistic & Freestyle Slalom', age_group: 'All Ages', level: 'Specialised Technique', image_url: media.squadRoad, schedule: '3x Weekly • 60 Min', duration: 'Ongoing',
    short_desc: 'Precision cone slalom manoeuvres, toe-wheel balance, spin turns and choreographic expression on specialised rocker-frame skates.',
    full_desc: 'Teaches speed slalom, crazy legs, wheelies and artistic expression around precision cone tracks under certified slalom instructors.' },
  { id: 'p6', name: 'Adult Fitness & Open Rink', age_group: 'Adults & Masters', level: 'Fitness & Conditioning', image_url: media.rinkNight2, schedule: 'Weekend & Night Batches', duration: 'Flexible Pass',
    short_desc: 'Low-impact cardiovascular conditioning, core stability and weekend open rink sessions for working professionals and adult skating enthusiasts.',
    full_desc: 'Enjoy the joint-friendly cardio benefits of roller skating in a supportive, adult-only evening batch with equipment assistance.' },
];

export const defaultCoaches = [
  { id: 'c1', name: 'Imran Khan', position: 'Head Coach & Founder', photo_url: media.coachFounder, experience: '14+ years experience',
    specialization: 'Gold medallist · RSFI certified · Inline speed & national squad lead',
    achievements: 'Former national gold medallist · Trained 45+ state medallists',
    bio: 'Chief Coach Imran has over 14 years of professional coaching experience across Karnataka. He holds official Level 3 RSFI certification and leads PRSA\'s high-performance speed racing contingent.' },
];

export const defaultEvents = [
  { id: 'e1', title: 'Karnataka State Roller Skating Championship & Trials', category: 'RSFI State Championship', date_str: 'OCT 24 - 28', time_str: '6:00 AM onwards',
    location: 'PRSA Banked Speed Track Arena, Electronic City', registration_status: 'Open',
    description: 'Cadet, Sub-Junior and Junior quad/inline divisions. 300m time trial, 500m sprint and 1000m rink race selection trials.' },
  { id: 'e2', title: 'RSFI 62nd National Roller Skating Championship', category: 'National Championship', date_str: 'NOV 10 - 14', time_str: 'Full day fixtures',
    location: 'National Velodrome Sports Complex', registration_status: 'Confirmed',
    description: 'Track and road speed, inline freestyle slalom and roller hockey showcase representing Team Karnataka.' },
];

export const defaultAchievements = [
  { id: 'a1', title: 'Gold Medals — RSFI State Championship', category: 'State Championship', year: '2024', count_label: '14 Gold', image_url: media.podiumGlide,
    description: 'PRSA speed team dominated the 500m sprint and 1000m rink race events.' },
  { id: 'a2', title: 'National Championship Podium Winners', category: 'National Podium', year: '2023', count_label: '12 Medals', image_url: media.podiumGirls,
    description: 'Represented Karnataka state at the 61st RSFI National Championships.' },
  { id: 'a3', title: 'Ryan International & Vibgyor Inter-School Champions', category: 'Inter-School Trophy', year: '2024', count_label: 'Overall Trophy', image_url: media.podiumRyan,
    description: 'Secured the overall team championship trophy three years running.' },
];

export const defaultTestimonials = [
  { id: 't1', name: 'Meera Kulkarni', role_desc: 'Parent of cadet skater (verified Google review)', rating: 5,
    quote: 'Best skating academy in the region! My 5-year-old started on quads with zero confidence. The coaches\' patience transformed him in weeks, and the track safety barriers gave us complete peace of mind.' },
  { id: 't2', name: 'Sunil Ramaswamy', role_desc: 'Parent of state gold medallist (verified Google review)', rating: 5,
    quote: 'PRSA\'s speed training is unmatched. The timing gates and corner crossover drills helped my daughter shave 1.2 seconds off her 500m sprint, winning gold at the RSFI State Championship.' },
  { id: 't3', name: 'Rahul Bhasin', role_desc: 'Adult fitness & speed batch (verified Google review)', rating: 5,
    quote: 'Joined the adult masters session after work. The synthetic banked rink is wonderful on the knees, the equipment is top quality, and the coaching staff is thoroughly professional and encouraging.' },
];

export const defaultLocations = [
  { id: 'l1', name: 'PRSA Floodlit Skating Arena', tag_label: 'Main headquarters', address: 'Electronic City / Neo Town Corridor, Bengaluru, Karnataka 560100',
    phone: '+91 98765 43210', schedule: 'Morning 6:00 – 9:30 AM • Evening 5:00 – 8:30 PM',
    maps_url: 'https://maps.google.com/?q=Professional+Roller+Skating+Academy+Electronic+City',
    description: 'Banked synthetic track with floodlight illumination, practice safety rails and spectator stands.', photo_url: media.rinkNight1 },
  { id: 'l2', name: 'PRSA West Compound (HSR Layout)', tag_label: 'Quad & slalom', address: 'HSR Layout Sector 2, near Agara Lake Sports Complex, Bengaluru',
    phone: '+91 98765 43211', schedule: 'Tue – Sun • 6:00 AM – 8:30 PM',
    maps_url: 'https://maps.google.com/?q=PRSA+Skating+HSR+Layout',
    description: 'Flat and banked track combination plus a cones agility zone for slalom and toddlers.', photo_url: media.sprintRoad },
];

export const defaultFaqs = [
  { id: 'f1', question: 'Do we need our own roller skates for the free trial session?',
    answer: 'No. For the free trial class PRSA provides certified quad or inline skates, helmets, knee pads and elbow guards at no cost. If you enrol, the coaches assess foot shape to advise on the right wheels and boot.' },
  { id: 'f2', question: 'Should my child start on quad skates or inline speed skates?',
    answer: 'For young kids (ages 4 to 6) quad skates give broader balance and help overcome the fear of falling. Skaters aged 7 and up, or with prior balance experience, can choose quads or inlines based on their competition interest. The coach assesses this on day one.' },
  { id: 'f3', question: 'Is PRSA officially affiliated with RSFI?',
    answer: 'Yes. PRSA follows Roller Skating Federation of India (RSFI) racing guidelines. Competitive skaters receive official RSFI athlete registration and represent the academy at district, state and national championships.' },
  { id: 'f4', question: 'Can adults join without any previous skating experience?',
    answer: 'Absolutely. The Adult Fitness & Open Rink program is built for working adults wanting low-impact cardio. We start with basic rink glides, posture and stopping technique in a welcoming batch.' },
];

export { defaultGallery };
