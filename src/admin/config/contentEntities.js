import { mediaUrl } from '../../lib/media';

// One entry per content type managed in the CMS. `fields` drives the generic
// edit form (EntityEditModal); each entity's list-view card is still its own
// small component in ContentManager since the visual layouts genuinely differ.
export const CONTENT_ENTITIES = {
  programs: {
    label: 'Program',
    newItem: () => ({
      name: '', age_group: '', level: '', short_desc: '', full_desc: '',
      image_url: mediaUrl('prsa_media_03.jpg'), schedule: '3x Weekly', duration: '3 Months', display_order: 0
    }),
    fields: [
      { key: 'name', label: 'PROGRAM NAME', type: 'text' },
      { key: 'age_group', label: 'AGE GROUP', type: 'text' },
      { key: 'short_desc', label: 'SHORT DESCRIPTION', type: 'textarea' },
      { key: 'image_url', label: 'PROGRAM FEATURED IMAGE', type: 'image', aspect: 16 / 9 }
    ]
  },
  coaches: {
    label: 'Coach',
    newItem: () => ({
      name: '', position: '', photo_url: mediaUrl('prsa_media_05.jpg'),
      experience: '', specialization: '', achievements: '', bio: '', display_order: 0
    }),
    fields: [
      { key: 'name', label: 'COACH FULL NAME', type: 'text' },
      { key: 'position', label: 'POSITION / TITLE', type: 'text' },
      { key: 'experience', label: 'EXPERIENCE & CERTIFICATIONS', type: 'text' },
      { key: 'specialization', label: 'SPECIALIZATION', type: 'text' },
      { key: 'photo_url', label: 'COACH PHOTO (1:1 SQUARE CROP)', type: 'image', aspect: 1 },
      { key: 'bio', label: 'BIOGRAPHY', type: 'textarea' }
    ]
  },
  events: {
    label: 'Event',
    newItem: () => ({
      title: '', category: 'State Trials', date_str: '', time_str: '', location: '',
      description: '', image_url: mediaUrl('prsa_media_02.jpg'), registration_status: 'Open'
    }),
    fields: [
      { key: 'title', label: 'EVENT TITLE', type: 'text' },
      { key: 'date_str', label: 'DATE STRING', type: 'text' },
      { key: 'time_str', label: 'TIME STRING', type: 'text' },
      { key: 'location', label: 'LOCATION ARENA', type: 'text' },
      { key: 'description', label: 'DESCRIPTION', type: 'textarea' },
      { key: 'image_url', label: 'EVENT COVER IMAGE', type: 'image', aspect: 16 / 9 }
    ]
  },
  achievements: {
    label: 'Achievement',
    newItem: () => ({
      title: '', category: 'State / National', year: new Date().getFullYear().toString(),
      count_label: '', description: '', image_url: mediaUrl('prsa_media_01.jpg'), display_order: 0
    }),
    fields: [
      { key: 'title', label: 'TITLE', type: 'text' },
      { key: 'count_label', label: 'COUNT / LABEL', type: 'text' },
      { key: 'year', label: 'YEAR', type: 'text' },
      { key: 'description', label: 'DESCRIPTION', type: 'textarea' },
      { key: 'image_url', label: 'ACHIEVEMENT IMAGE', type: 'image', aspect: 16 / 9 }
    ]
  },
  gallery: {
    label: 'Gallery Media',
    newItem: () => ({
      title: '', category: 'All', media_type: 'image', url: mediaUrl('prsa_media_01.jpg'), caption: '', display_order: 0
    }),
    fields: [
      { key: 'title', label: 'MEDIA TITLE', type: 'text' },
      { key: 'category', label: 'CATEGORY', type: 'text' },
      { key: 'url', label: 'GALLERY PHOTO / VIDEO FILE', type: 'image', aspect: 16 / 9 }
    ]
  },
  testimonials: {
    label: 'Testimonial',
    newItem: () => ({ name: '', role_desc: 'Parent', quote: '', rating: 5, photo_url: mediaUrl('prsa_media_07.jpg') }),
    fields: [
      { key: 'name', label: 'NAME', type: 'text' },
      { key: 'role_desc', label: 'ROLE / DESIGNATION', type: 'text' },
      { key: 'quote', label: 'TESTIMONIAL QUOTE', type: 'textarea' },
      { key: 'photo_url', label: 'PARENT / SKATER PHOTO (1:1 SQUARE)', type: 'image', aspect: 1 }
    ]
  },
  locations: {
    label: 'Location',
    newItem: () => ({
      name: '', tag_label: 'Main Track', address: '', phone: '+91 98765 43210',
      schedule: 'Tue-Sun 6AM-9:30AM', maps_url: '', description: '', photo_url: mediaUrl('prsa_media_10.jpg'), display_order: 0
    }),
    fields: [
      { key: 'name', label: 'LOCATION NAME', type: 'text' },
      { key: 'address', label: 'ADDRESS', type: 'textarea' },
      { key: 'schedule', label: 'SESSION SCHEDULE', type: 'text' },
      { key: 'photo_url', label: 'LOCATION ARENA PHOTO', type: 'image', aspect: 16 / 9 }
    ]
  },
  faqs: {
    label: 'FAQ',
    newItem: () => ({ question: '', answer: '', category: 'General', display_order: 0 }),
    fields: [
      { key: 'question', label: 'QUESTION', type: 'text' },
      { key: 'answer', label: 'ANSWER', type: 'textarea' }
    ]
  }
};
