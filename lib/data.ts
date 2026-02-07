import type { Service, Booking, User, Asset, ProcessStep, ContactInfo } from './types';

// Services offered by Vetri Events
export const services: Service[] = [
  {
    id: 'svc-001',
    name: 'Professional DJ Setup',
    description: 'Premier audio and lighting setup for weddings, parties, and local celebrations. Includes professional DJ Adhi performance.',
    category: 'dj',
    basePrice: 25000,
    features: [
      'Professional DJ Service (DJ Adhi)',
      'High-quality Audio System',
      'Dynamic Lighting Setup',
      'Custom Playlist',
      '4-6 Hours Performance',
    ],
    image: '/images/dj-setup-front.png',
    popular: true,
  },
  {
    id: 'svc-002',
    name: 'Music Fusion (Chenda Melam)',
    description: 'A unique blend of traditional Chenda Melam percussion with modern DJ performances.',
    category: 'fusion',
    basePrice: 35000,
    features: [
      'Traditional Chenda Melam Team',
      'Live DJ Fusion',
      'Traditional & Modern Mix',
      'Grand Entry Experience',
      'Cultural Performance',
    ],
    image: '/images/gold.jpeg',
    popular: true,
  },
  {
    id: 'svc-003',
    name: 'Full Event Management',
    description: 'Complete event coordination services for Chengam and Thiruvannamalai regions.',
    category: 'full-package',
    basePrice: 50000,
    features: [
      'Venue Coordination',
      'Decor & Production',
      'Sound & Light Management',
      'Vendor Management',
      'On-site Coordination',
    ],
    image: '/images/studio-session-wide.jpeg',
  },
  {
    id: 'svc-004',
    name: 'Wedding Production',
    description: 'Comprehensive wedding entertainment package with sound, lights, and special effects.',
    category: 'full-package',
    basePrice: 45000,
    features: [
      'Premium Sound System',
      'Stage Lighting',
      'Fog & Sparkular Effects',
      'DJ & MC Services',
      'Reception Entertainment',
    ],
    image: '/images/dj-setup-lights.png',
  }
];

// Process steps shown on the website
export const processSteps: ProcessStep[] = [
  {
    id: 'step-1',
    step: 1,
    title: 'Inquiry',
    description: 'Contact us via phone (6369929261) or Instagram (@_djadhi_01) to check availability.',
    icon: 'MessageSquare',
  },
  {
    id: 'step-2',
    step: 2,
    title: 'Consultation',
    description: 'We discuss your event needs, venue details, and musical preferences.',
    icon: 'Phone',
  },
  {
    id: 'step-3',
    step: 3,
    title: 'Booking',
    description: 'Confirm your date with an advance payment. We are busiest on Sundays and Thursdays!',
    icon: 'CheckCircle',
  },
  {
    id: 'step-4',
    step: 4,
    title: 'Execution',
    description: 'Our team arrives early for setup. Professional execution by DJ Adhi and crew.',
    icon: 'Music',
  },
];

// Contact information
export const contactInfo: ContactInfo = {
  phone: '+91 63699 29261', // DJ Adhi
  secondaryPhone: '+91 63815 44170', // Vetri Events
  email: 'bookings@vetridj.com',
  address: '973, Mani Road, Muraiyar Village, Chengam, Tamil Nadu 606709',
  socialLinks: {
    instagram: 'https://instagram.com/_djadhi_01',
    instagramSecond: 'https://instagram.com/vetri_events_cgm',
    youtube: 'https://youtube.com/@vetridjofficial',
  },
  businessHours: {
    mon: '7:00 AM – 11:00 PM',
    tue: '7:00 AM – 11:00 PM',
    wed: '7:00 AM – 11:00 PM',
    thu: '7:00 AM – 11:00 PM',
    fri: '7:00 AM – 11:00 PM',
    sat: '7:00 AM – 11:00 AM',
    sun: '7:00 AM – 11:00 PM',
  }
};

// Sample bookings for demo
export const sampleBookings: Booking[] = [
  {
    id: 'BK-2026-001',
    clientName: 'Priya & Rahul Sharma',
    clientEmail: 'priya.sharma@email.com',
    clientPhone: '+91 98765 12345',
    eventType: 'wedding',
    eventDate: '2026-02-15',
    eventTime: '18:00',
    eventEndTime: '23:00',
    venue: 'Grand Ballroom',
    venueAddress: 'Chengam',
    guestCount: 500,
    services: ['svc-001'],
    status: 'CONFIRMED',
    notes: 'Fusion request',
    specialRequests: 'Chenda Melam integration',
    baseAmount: 25000,
    extras: 10000,
    discount: 0,
    tax: 0,
    totalAmount: 35000,
    advancePaid: 10000,
    balanceDue: 25000,
    expenses: [],
    crewPayouts: [],
    assignedCrew: ['crew-001'],
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-01-25T14:30:00Z',
  },
];

// Sample crew members
export const sampleCrew: User[] = [
  {
    id: 'crew-001',
    name: 'DJ Adhi',
    email: 'adhi@vetridj.com',
    phone: '+91 63699 29261',
    role: 'ADMIN',
    specializations: ['DJ', 'Mixer', 'Admin'],
    hourlyRate: 0,
    status: 'active',
    joinedAt: '2020-01-01',
  },
  {
    id: 'crew-002',
    name: 'Vetri Crew 1',
    email: 'crew1@vetridj.com',
    phone: '+91 63815 44170',
    role: 'CREW',
    specializations: ['Setup', 'Lighting'],
    hourlyRate: 500,
    status: 'active',
    joinedAt: '2022-01-10',
  }
];

// Sample inventory/assets
export const sampleAssets: Asset[] = [
  {
    id: 'asset-001',
    name: 'JBL Sound System',
    category: 'speakers',
    brand: 'JBL',
    model: 'Pro Series',
    quantity: 4,
    available: 4,
    status: 'available',
    purchaseDate: '2024-01-15',
    purchasePrice: 200000,
  },
];

// Admin user
export const adminUser: User = {
  id: 'admin-001',
  name: 'DJ Adhi',
  email: 'admin@vetridj.com',
  phone: '+91 63699 29261',
  role: 'ADMIN',
  status: 'active',
  joinedAt: '2020-01-01',
};
