export interface ProgramItem {
  id: string;
  time: string;
  title: string;
  host?: string;
  note?: string;
  subItems?: { label: string; host?: string }[];
  featured?: boolean;
  sticker: string;
  stickerAlt: string;
}

export interface LookbookSlide {
  id: string;
  src: string;
  title: string;
  subtitle: string;
  tag: string;
}

export interface DressSwatch {
  id: string;
  name: string;
  hex: string;
  ring: string;
  tip: string;
}

export const EVENT_INFO = {
  title: 'The Last Diamond: 12 Years Later',
  subtitle: '4th Year High School Reunion, Section Diamond',
  schoolFull: 'Plaridel Integrated National High School (PINHS)',
  schoolShort: 'PINHS',
  adviser: "Ma'am Teresa Suazo",
  venueName: 'Tropical Bali',
  venueLandmark: '249 Nagcarlan–Rizal Rd, Brgy. West, Rizal, Laguna 4003 (In front of Rizal Elementary School)',
  venueCoords: {
    lat: 14.11092,
    lng: 121.39128,
  },
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=249+Nagcarlan-Rizal+Rd,+Brgy.+West,+Rizal,+Laguna+4003',
  dateDisplay: 'January 23–24, 2027',
  dayTimeDisplay: 'Saturday, 5:00 PM Onwards',
  overnightNote: 'Overnight Celebration',
  startIso: '2027-01-23T17:00:00+08:00',
  endIso: '2027-01-24T05:30:00+08:00',
  theme: 'Sparkling Denim',
  rsvpUrl: 'https://forms.gle/g4D93rUmNHKeQKLg8',
  rsvpDeadlineDisplay: 'December 04, 2026 (11:59 PM)',
  rsvpDeadlineShort: 'Dec. 04, 2026 • 11:59 PM',
  rsvpDeadlineIso: '2026-12-04T23:59:59+08:00',
  programFootnote: '*Adjustment on the time due to venue activity',
} as const;

export const DRESS_SWATCHES: DressSwatch[] = [
  {
    id: 'raw-indigo',
    name: 'Raw Indigo',
    hex: '#162b4f',
    ring: '#4a72b0',
    tip: 'Deep indigo denim jackets, structured vests, or flared jeans anchored with bold silver accessories.',
  },
  {
    id: 'washed-chambray',
    name: 'Washed Chambray',
    hex: '#5c82b6',
    ring: '#9ec5ff',
    tip: 'Light-wash denim sets dressed up with pearls, rhinestone trim, or crisp white layering.',
  },
  {
    id: 'liquid-chrome',
    name: 'Liquid Chrome',
    hex: '#cfd8e6',
    ring: '#ffffff',
    tip: 'Metallic silver tops, mirror-ball boots, sequined bags, or chrome statement belts.',
  },
  {
    id: 'diamond-sparkle',
    name: 'Diamond Sparkle',
    hex: '#eef4ff',
    ring: '#d4b483',
    tip: 'Crystal fringe, glitter eye makeup, studded denim, or anything that catches the midnight lights.',
  },
];

export const LOOKBOOK_SLIDES: LookbookSlide[] = [
  {
    id: 'woman-1',
    src: '/assets/lookbook/lookbook-woman-1.webp',
    title: 'Tailored Vest & Sequin Denim',
    subtitle: 'Crisp ivory halter vest paired with silver-frosted wide-leg jeans.',
    tag: 'Sparkle Jeans',
  },
  {
    id: 'men-trio',
    src: '/assets/lookbook/lookbook-men-trio.webp',
    title: 'Rhinestone & Studded Street Denim',
    subtitle: 'Crystal-scattered trucker jackets, floral shimmer overshirts, and metallic shades.',
    tag: 'Gents Edit',
  },
  {
    id: 'woman-2',
    src: '/assets/lookbook/lookbook-woman-2.webp',
    title: 'Oversized Jacket & Disco Boots',
    subtitle: 'Relaxed zip-up blue denim topped off with crystal choker & knee-high glitter boots.',
    tag: 'Disco Glam',
  },
  {
    id: 'women-trio',
    src: '/assets/lookbook/lookbook-women-trio.webp',
    title: 'Chainmail & Rhinestone Sets',
    subtitle: 'Diamond halter tops, matching crystal denim caps, and frost-washed co-ords.',
    tag: 'Squad Inspo',
  },
  {
    id: 'woman-3',
    src: '/assets/lookbook/lookbook-woman-3.webp',
    title: 'Pearl-Studded Double Denim',
    subtitle: 'All-over pearl & crystal accents on classic mid-wash jacket and straight-cut jeans.',
    tag: 'Pearl Denim',
  },
  {
    id: 'woman-4',
    src: '/assets/lookbook/lookbook-woman-4.webp',
    title: 'Crystal Flared Jumpsuit',
    subtitle: 'Fitted rhinestone-sprinkled denim jumpsuit cinched with a statement buckle.',
    tag: 'Retro Flare',
  },
  {
    id: 'woman-5',
    src: '/assets/lookbook/lookbook-woman-5.webp',
    title: 'Distressed Crystal Co-Ord',
    subtitle: 'Oversized frayed denim layered over a sheer mesh rhinestone top.',
    tag: 'Y2K Grunge Glam',
  },
  {
    id: 'woman-6',
    src: '/assets/lookbook/lookbook-woman-6.webp',
    title: 'Metallic Fringe & Laced Jeans',
    subtitle: 'Dazzling silver fringe tank paired with laced-cutout light denim.',
    tag: 'Showstopper',
  },
];

export const PROGRAM_FLOW: ProgramItem[] = [
  {
    id: 'slot-1',
    time: '5:00 PM – 5:30 PM',
    title: 'Attendance and Preparation',
    note: 'Arrival at Tropical Bali, check-in, and settling in before sunset.',
    sticker: '/assets/stickers/star-denim-frayed.webp',
    stickerAlt: 'Frayed denim star patch',
  },
  {
    id: 'slot-2',
    time: '5:30 PM – 6:00 PM',
    title: 'Opening Program',
    featured: true,
    subItems: [
      { label: 'Opening Prayer', host: 'Wiljohn' },
      { label: 'Welcoming Message', host: 'John Lloyd' },
      { label: 'Photo Opportunity' },
    ],
    sticker: '/assets/stickers/bow-chrome.webp',
    stickerAlt: 'Silver chrome bow',
  },
  {
    id: 'slot-3',
    time: '6:00 PM – 6:30 PM',
    title: 'Game 1 (Team)',
    host: 'Russel',
    note: '5 winners take home prizes!',
    sticker: '/assets/stickers/pool-ball-2.webp',
    stickerAlt: 'Navy 2 pool ball',
  },
  {
    id: 'slot-4',
    time: '6:30 PM – 7:00 PM',
    title: 'Game 2 (Team) / Raffle 1',
    host: 'Cath',
    note: 'Bato-Bato Picks with ₱50',
    sticker: '/assets/stickers/star-chrome-1.webp',
    stickerAlt: 'Chrome puffy star',
  },
  {
    id: 'slot-5',
    time: '7:00 PM – 7:30 PM',
    title: 'Game 3 (Team)',
    host: 'Wiljohn',
    note: 'To follow. Get your team ready!',
    sticker: '/assets/stickers/denim-smiley-patch.webp',
    stickerAlt: 'Denim smiley patch',
  },
  {
    id: 'slot-6',
    time: '7:30 PM – 9:00 PM',
    title: 'Dinner Proper / Raffle',
    note: 'Shared feast, catch-up stories, and mid-evening raffle draws.',
    sticker: '/assets/stickers/martini-glass.webp',
    stickerAlt: 'Cocktail glass',
  },
  {
    id: 'slot-7',
    time: '9:00 PM – 10:00 PM',
    title: 'Recognition / Video Presentation / Message from Adviser / Closing Message',
    featured: true,
    note: "Honoring our 12-year journey and Ma'am Teresa Suazo's Last Diamond section.",
    sticker: '/assets/stickers/flower-blue.webp',
    stickerAlt: 'Blue denim flower',
  },
  {
    id: 'slot-8',
    time: '10:00 PM – 5:00 AM',
    title: 'Entertainment / Party / Ice Breaker / Raffle 2',
    featured: true,
    note: 'Overnight dance floor, music, late-night games, and second raffle round!',
    sticker: '/assets/stickers/disco-ball-checkered.webp',
    stickerAlt: 'Checkered disco ball',
  },
  {
    id: 'slot-9',
    time: '5:00 AM – 5:30 AM',
    title: 'General Cleaning',
    note: 'Wrapping up together before sunrise departure.',
    sticker: '/assets/stickers/balloon-dog-chrome.webp',
    stickerAlt: 'Chrome balloon dog',
  },
];
