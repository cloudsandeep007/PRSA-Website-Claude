import 'dotenv/config';
import { fileURLToPath } from 'url';
import { query, initDb } from './db.js';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  await initDb();

  await seedUsers();
  await seedKeyValueDefaults('settings', defaultSettings);
  await seedKeyValueDefaults('content', defaultContent);
  await seedIfEmpty('programs', programs, (p) => [p.name, p.age_group, p.level, p.short_desc, p.full_desc, p.image_url, p.schedule, p.duration, p.display_order],
    'INSERT INTO programs (name, age_group, level, short_desc, full_desc, image_url, schedule, duration, display_order) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)');
  await seedIfEmpty('coaches', coaches, (c) => [c.name, c.position, c.photo_url, c.experience, c.specialization, c.achievements, c.bio, c.display_order],
    'INSERT INTO coaches (name, position, photo_url, experience, specialization, achievements, bio, display_order) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)');
  await seedIfEmpty('events', events, (e) => [e.title, e.category, e.date_str, e.time_str, e.location, e.description, e.image_url, e.registration_status],
    'INSERT INTO events (title, category, date_str, time_str, location, description, image_url, registration_status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)');
  await seedIfEmpty('achievements', achievements, (a) => [a.title, a.category, a.year, a.count_label, a.description, a.image_url, a.display_order],
    'INSERT INTO achievements (title, category, year, count_label, description, image_url, display_order) VALUES ($1,$2,$3,$4,$5,$6,$7)');
  await seedIfEmpty('gallery', galleryItems, (g) => [g.title, g.category, g.media_type, g.url, g.caption, g.display_order],
    'INSERT INTO gallery (title, category, media_type, url, caption, display_order) VALUES ($1,$2,$3,$4,$5,$6)');
  await seedIfEmpty('testimonials', testimonials, (t) => [t.name, t.role_desc, t.quote, t.rating, t.photo_url],
    'INSERT INTO testimonials (name, role_desc, quote, rating, photo_url) VALUES ($1,$2,$3,$4,$5)');
  await seedIfEmpty('locations', locations, (l) => [l.name, l.tag_label, l.address, l.phone, l.schedule, l.maps_url, l.description, l.photo_url, l.display_order],
    'INSERT INTO locations (name, tag_label, address, phone, schedule, maps_url, description, photo_url, display_order) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)');
  await seedIfEmpty('faqs', faqs, (f) => [f.question, f.answer, f.category, f.display_order],
    'INSERT INTO faqs (question, answer, category, display_order) VALUES ($1,$2,$3,$4)');
}

async function seedUsers() {
  const accounts = [
    { username: 'superadmin', email: 'superadmin@prsaroller.com', envVar: 'SEED_SUPER_ADMIN_PASSWORD', role: 'Super Admin' },
    { username: 'clientadmin', email: 'client@prsaroller.com', envVar: 'SEED_CLIENT_ADMIN_PASSWORD', role: 'Client Admin' }
  ];

  for (const acct of accounts) {
    const { rows } = await query('SELECT id FROM users WHERE email = $1', [acct.email]);
    if (rows.length > 0) continue;

    const password = process.env[acct.envVar];
    if (!password) {
      console.warn(`Skipping seed for ${acct.email}: set ${acct.envVar} in your environment to create this account.`);
      continue;
    }
    const hash = bcrypt.hashSync(password, 10);
    await query('INSERT INTO users (username, email, password_hash, role) VALUES ($1,$2,$3,$4)', [acct.username, acct.email, hash, acct.role]);
    console.log(`Seeded ${acct.role} account: ${acct.email}`);
  }
}

async function seedKeyValueDefaults(table, defaults) {
  for (const { key, value } of defaults) {
    await query(`INSERT INTO ${table} (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING`, [key, value]);
  }
}

async function seedIfEmpty(table, rowsToSeed, toParams, insertSql) {
  const { rows } = await query(`SELECT COUNT(*) as count FROM ${table}`);
  if (Number(rows[0].count) > 0) return;
  for (const row of rowsToSeed) {
    await query(insertSql, toParams(row));
  }
}

const defaultSettings = [
  { key: "academy_name", value: "Professional Roller Skating Academy (PRSA)" },
  { key: "tagline", value: "Unleash Speed. Master The Rink." },
  { key: "phone", value: "+91 98765 43210" },
  { key: "whatsapp", value: "919876543210" },
  { key: "email", value: "admissions@prsaroller.com" },
  { key: "admin_notify_email", value: "headcoach@prsaroller.com" },
  { key: "address", value: "PRSA Banked Speed Track Arena, Electronic City / Neo Town Corridor, Bengaluru, Karnataka 560100" },
  { key: "business_hours", value: "Morning: 6:00 AM – 9:30 AM | Evening: 5:00 PM – 8:30 PM (Tue - Sun)" },
  { key: "meta_title", value: "PRSA — Official RSFI Roller Skating Academy Bengaluru" },
  { key: "meta_description", value: "Official RSFI affiliated roller skating training in Bangalore. Quad, inline speed & slalom coaching for toddlers to championship athletes." }
];

const defaultContent = [
  { key: "hero_type", value: "video" },
  { key: "hero_video_url", value: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/create_a_video_for_my_sketing.mp4" },
  { key: "hero_badge", value: "⚡ OFFICIAL RSFI AFFILIATED ACADEMY • BENGALURU, KARNATAKA" },
  { key: "hero_sub_badge", value: "ELECTRONIC CITY • NEO TOWN • HSR • FLOODLIT ARENA" },
  { key: "hero_title_1", value: "UNLEASH SPEED." },
  { key: "hero_title_2", value: "MASTER THE RINK." },
  { key: "hero_description", value: "Official RSFI roller skating training in Bangalore. From beginner balance & falling safety to podium medals at Ryan International, Viva Vibgyor, and State/National Championships." },
  { key: "hero_bg_image", value: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_10.jpg" },
  { key: "hero_cta_primary_text", value: "BOOK A FREE TRIAL CLASS" },
  { key: "hero_cta_primary_link", value: "#trial" },
  { key: "hero_cta_secondary_text", value: "VIEW REAL ACTION GALLERY" },
  { key: "hero_cta_secondary_link", value: "#gallery" },
  { key: "stat_1_val", value: "850+" },
  { key: "stat_1_lbl", value: "ACTIVE SKATERS TRAINED" },
  { key: "stat_2_val", value: "12+" },
  { key: "stat_2_lbl", value: "NATIONAL CHAMPIONSHIP MEDALS" },
  { key: "stat_3_val", value: "8 RSFI" },
  { key: "stat_3_lbl", value: "CERTIFIED CHIEF COACHES" },
  { key: "stat_4_val", value: "100%" },
  { key: "stat_4_lbl", value: "SAFETY & HELMET COMPLIANCE" }
];

const programs = [
  {
    name: "Beginner Tots & Kids", age_group: "AGES 4 – 7", level: "Grassroots Foundation",
    short_desc: "Fun balance, safe falling reflexes, motor coordination, and introductory quad skates. Designed to eliminate fear and build cheerful athletic confidence.",
    full_desc: "Our Tots program focuses on safety-first kinetic movement, gentle balance drills on 4-wheel quad skates, and gamified slalom obstacles. Protective gear and helmets are strictly required and provided for trial sessions.",
    image_url: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_03.jpg", schedule: "3x Weekly • 45 Min", duration: "3 Months Level 1", display_order: 1
  },
  {
    name: "Basic & Recreational Quad Skating", age_group: "AGES 6+ & YOUTH", level: "Foundational Track",
    short_desc: "The core foundational curriculum. Master stride pushing, heel and toe stops, inside/outside edge control, and track awareness on quad and inline skates.",
    full_desc: "Students learn proper biomechanical posture, parallel stride returns, T-braking, and spin stops. Prepares skaters for both recreation and competitive squad tryouts.",
    image_url: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_05.jpg", schedule: "3x Weekly • 60 Min", duration: "4 Months Module", display_order: 2
  },
  {
    name: "Intermediate Quad & Inline Velocity", age_group: "VELOCITY TIER", level: "Intermediate Speed",
    short_desc: "Translating baseline control into high-velocity track performance. Introduces banked corner crossovers, slipstream drafting, and interval endurance.",
    full_desc: "Focuses on high-speed corner crossovers, aerodynamic tuck positions, cadence modulation, and endurance building on banked synthetic track surfaces.",
    image_url: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_11.jpg", schedule: "4x Weekly • 75 Min", duration: "6 Months Squad", display_order: 3
  },
  {
    name: "RSFI Speed Roller Racing (Elite Squad)", age_group: "COMPETITIVE PODIUM", level: "National Level",
    short_desc: "Exclusive RSFI sanctioned speed track & road squad. Transponder timing, 110mm inline speed boots, tactical race simulation, and state/national prep.",
    full_desc: "Designed for elite speed racers preparing for district, state, and RSFI National Championships. Features electronic transponder lap telemetry, sprint interval training, and customized athlete nutrition plans.",
    image_url: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_13.jpg", schedule: "5x Weekly • 90 Min", duration: "Annual High-Performance", display_order: 4
  },
  {
    name: "Artistic & Freestyle Slalom", age_group: "ALL AGES", level: "Specialized Technique",
    short_desc: "Precision cone slalom maneuvers, toe-wheel balance, spin turns, and choreographic expression on specialized rocker-frame skates.",
    full_desc: "Teaches speed slalom, crazy legs, wheelies, and artistic expression around precision cone tracks under certified slalom instructors.",
    image_url: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_15.jpg", schedule: "3x Weekly • 60 Min", duration: "Ongoing", display_order: 5
  },
  {
    name: "Adult Fitness & Open Rink", age_group: "ADULTS & MASTERS", level: "Fitness & Conditioning",
    short_desc: "Low-impact cardiovascular conditioning, core stability, and weekend open rink sessions for working professionals and adult skating enthusiasts.",
    full_desc: "Enjoy the joint-friendly cardio benefits of roller skating in a supportive, adult-only evening batch with equipment assistance.",
    image_url: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_06.jpg", schedule: "Weekend & Night Batches", duration: "Flexible Pass", display_order: 6
  }
];

const coaches = [
  {
    name: "Coach Arjun Kumar", position: "Head Coach & Founder", photo_url: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_02.jpg", experience: "14+ Years Experience",
    specialization: "RSFI Certified • Inline Speed & National Squad Lead", achievements: "Former National Gold Medalist, Trained 45+ State Medalists",
    bio: "Chief Coach Arjun has over 14 years of professional coaching experience across Karnataka. He holds official Level 3 RSFI certification and leads PRSA's high-performance speed racing contingent.",
    display_order: 1
  },
  {
    name: "Coach Pooja Sharma", position: "Chief Tots & Quad Instructor", photo_url: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_05.jpg", experience: "8+ Years Experience",
    specialization: "Child Biomechanics & Quad Foundations", achievements: "Certified Physical Educator, Specialist in Grassroots Confidence",
    bio: "Coach Pooja specializes in early childhood balance, fear elimination, and fun quad skate mastery. Her patient method has helped over 400 young kids fall in love with roller sports.",
    display_order: 2
  },
  {
    name: "Coach Rajesh Varma", position: "Freestyle Slalom & Technical Lead", photo_url: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_08.jpg", experience: "10+ Years Experience",
    specialization: "Artistic Slalom & Cone Precision", achievements: "National Slalom Judge, International Clinic Delegate",
    bio: "Coach Rajesh guides PRSA skaters through high-speed slalom tricks, rocker frame setup, and artistic posture for state & national competitions.",
    display_order: 3
  }
];

const events = [
  {
    title: "Karnataka State Roller Skating Championship & Trials", category: "RSFI STATE CHAMPIONSHIP", date_str: "OCT 24 - 28", time_str: "6:00 AM onwards",
    location: "PRSA Banked Speed Track Arena, Electronic City",
    description: "Cadet, Sub-Junior & Junior Quad/Inline divisions. 300m Time Trial, 500m Sprint, and 1000m Rink Race selection trials.",
    image_url: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_10.jpg", registration_status: "Open"
  },
  {
    title: "RSFI 62nd National Roller Skating Championship", category: "NATIONAL CHAMPIONSHIP", date_str: "NOV 10 - 14", time_str: "Full Day Fixtures",
    location: "National Velodrome Sports Complex",
    description: "Track & Road Speed, Inline Freestyle Slalom, and Roller Hockey showcase representing Team Karnataka.",
    image_url: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_11.jpg", registration_status: "Confirmed"
  }
];

const achievements = [
  {
    title: "Gold Medals — RSFI State Championship", category: "State Championship", year: "2024", count_label: "14 Gold",
    description: "PRSA speed team dominated the 500m sprint and 1000m rink race events.", image_url: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_03.jpg", display_order: 1
  },
  {
    title: "National Championship Podium Winners", category: "National Podium", year: "2023", count_label: "12 Medals",
    description: "Represented Karnataka state at 61st RSFI National Championships.", image_url: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_13.jpg", display_order: 2
  },
  {
    title: "Ryan International & Vibgyor Inter-School Champions", category: "Inter-School Trophy", year: "2024", count_label: "Overall Trophy",
    description: "Secured overall team championship trophy 3 years consecutively.", image_url: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_15.jpg", display_order: 3
  }
];

const galleryItems = Array.from({ length: 15 }, (_, i) => {
  const n = i + 1;
  const num = n < 10 ? `0${n}` : `${n}`;
  const category = n % 2 === 0 ? "Inline Speed" : "Quad Skates";
  return {
    title: `PRSA Action Shot ${n}`,
    category,
    media_type: "image",
    url: `https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_${num}.jpg`,
    caption: `High-speed training session at PRSA floodlit arena (${category})`,
    display_order: n
  };
});

const testimonials = [
  {
    name: "Meera Kulkarni", role_desc: "Parent of Cadet Skater (Verified Google Review)",
    quote: "Best skating academy in the region! My 5-year-old son started on quads with zero confidence. Coach Arjun and Pooja's patience transformed him in weeks. The track safety barriers gave us complete peace of mind.",
    rating: 5, photo_url: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_07.jpg"
  },
  {
    name: "Sunil Ramaswamy", role_desc: "Parent of State Gold Medalist (Verified Google Review)",
    quote: "PRSA's speed training is unmatched. The transponder timing gates and corner crossover drills helped my daughter shave 1.2 seconds in the 500m sprint, winning gold at the RSFI State Championship.",
    rating: 5, photo_url: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_09.jpg"
  },
  {
    name: "Rahul Bhasin", role_desc: "Adult Fitness & Speed Batch (Verified Google Review)",
    quote: "Joined the Adult Masters session after work. The synthetic banked rink is wonderful on the knees, equipment is top quality, and the coaching staff is thoroughly professional and encouraging.",
    rating: 5, photo_url: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_12.jpg"
  }
];

const locations = [
  {
    name: "PRSA Floodlit Skating Arena", tag_label: "MAIN HEADQUARTERS", address: "Electronic City / Neo Town Corridor, Bengaluru, Karnataka 560100",
    phone: "+91 98765 43210", schedule: "Morning: 6:00 AM – 9:30 AM • Evening: 5:00 PM – 8:30 PM",
    maps_url: "https://maps.google.com/?q=Professional+Roller+Skating+Academy+Electronic+City",
    description: "Banked synthetic track with floodlight illumination, practice safety rails & spectator stands.",
    photo_url: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_10.jpg", display_order: 1
  },
  {
    name: "PRSA West Compound (HSR Layout)", tag_label: "QUAD & SLALOM", address: "HSR Layout Sector 2, near Agara Lake Sports Complex, Bengaluru",
    phone: "+91 98765 43211", schedule: "Tue - Sun • 6:00 AM – 8:30 PM",
    maps_url: "https://maps.google.com/?q=PRSA+Skating+HSR+Layout",
    description: "Flat & Banked Track Combination + Cones Agility Zone for slalom and toddlers.",
    photo_url: "https://obzdkejxulvlpxiihvzj.supabase.co/storage/v1/object/public/media/prsa_media_04.jpg", display_order: 2
  }
];

const faqs = [
  {
    question: "Do we need our own roller skates for the free trial session?",
    answer: "No! For your free trial class, PRSA provides certified quad or inline skates, certified helmets, knee pads, and elbow guards completely free. If you choose to enroll, our coaches perform a foot shape audit to advise on the right wheels and boot specifications.",
    category: "Trial & Gear", display_order: 1
  },
  {
    question: "Should my child start on Quad Skates or Inline Speed Skates?",
    answer: "For young kids (ages 4 to 6), quad skates provide broader lateral balance and help overcome fear of falling. Skaters age 7 and up or those with prior balance experience can choose either Quads or Inlines based on their competition interest. Our coaches assess this on Day 1.",
    category: "Programs", display_order: 2
  },
  {
    question: "Is PRSA officially affiliated with RSFI?",
    answer: "Yes, PRSA is fully aligned with Roller Skating Federation of India (RSFI) racing guidelines. Our competitive skaters receive official RSFI athlete registration cards and represent the academy at district, state, and national championship fixtures.",
    category: "Affiliation", display_order: 3
  },
  {
    question: "Can adults join without any previous roller skating experience?",
    answer: "Absolutely. Our Adult Fitness & Open Rink program is tailored for working adults seeking low-impact cardiovascular conditioning. We begin with basic rink glides, core posture, and stopping techniques in a welcoming environment.",
    category: "Adults", display_order: 4
  }
];

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  seedDatabase()
    .then(() => {
      console.log('Database seed complete.');
      process.exit(0);
    })
    .catch(err => {
      console.error('Seed failed:', err);
      process.exit(1);
    });
}
