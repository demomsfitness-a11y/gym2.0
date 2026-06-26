import { MembershipPlan, Trainer, GroupClass, GalleryMedia } from './types';

export const DEFAULT_PLANS: MembershipPlan[] = [
  {
    id: 'plan_basic',
    name: 'Basic Access',
    price: 1999, // in INR or general currency
    duration: '1 Month',
    features: [
      'Access to Gym Floor',
      'Free Fitness Consultation',
      'Locker & Shower Access',
      '1 Group Class / Week'
    ],
    imageURL: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400',
    isEnabled: true
  },
  {
    id: 'plan_premium',
    name: 'Premium Monthly',
    price: 3499,
    duration: '1 Month',
    features: [
      'Unlimited Gym Floor Access',
      'All Group Fitness Classes',
      'Personalized Workout Plan',
      'Locker, Steam & Sauna Access',
      '2 Personal Trainer Sessions / Month'
    ],
    imageURL: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=400',
    isPopular: true,
    isEnabled: true
  },
  {
    id: 'plan_elite_annual',
    name: 'Elite Annual',
    price: 24999,
    duration: '12 Months',
    features: [
      'Unlimited 24/7 Access',
      'All Group & Special Classes',
      'Personal Nutrition Coaching',
      'Unlimited Locker, Steam & Sauna',
      '12 Personal Trainer Sessions / Year',
      'Free MS Fitness Hoody & Shaker'
    ],
    imageURL: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=400',
    discount: 40,
    isEnabled: true
  }
];

export const DEFAULT_TRAINERS: Trainer[] = [
  {
    id: 'trainer_1',
    name: 'Marcus Steele',
    specialty: 'Strength & Conditioning',
    photoURL: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=300',
    socialInstagram: 'https://instagram.com',
    socialTwitter: 'https://twitter.com',
    bio: 'Former collegiate athlete with 10+ years coaching professional weightlifters.'
  },
  {
    id: 'trainer_2',
    name: 'Elena Rostova',
    specialty: 'High Intensity Interval Training (HIIT)',
    photoURL: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=80&w=300',
    socialInstagram: 'https://instagram.com',
    socialFacebook: 'https://facebook.com',
    bio: 'Certified physiotherapist and cardiovascular fitness specialist.'
  },
  {
    id: 'trainer_3',
    name: 'Vikram Singh',
    specialty: 'Yoga & Functional Mobility',
    photoURL: 'https://images.unsplash.com/photo-1605296867304-46d5465a25f1?auto=format&fit=crop&q=80&w=300',
    socialInstagram: 'https://instagram.com',
    socialTwitter: 'https://twitter.com',
    bio: 'Spiritual yoga master focusing on alignment, mind-muscle connection, and recovery.'
  }
];

export const DEFAULT_CLASSES: GroupClass[] = [
  { id: 'class_1', name: 'Power Weightlifting', time: '06:00 AM', day: 'Monday', capacity: 20, bookedCount: 5, trainerName: 'Marcus Steele' },
  { id: 'class_2', name: 'Spin & Cardio Burn', time: '08:00 AM', day: 'Monday', capacity: 25, bookedCount: 12, trainerName: 'Elena Rostova' },
  { id: 'class_3', name: 'Vinyasa Yoga', time: '10:00 AM', day: 'Tuesday', capacity: 15, bookedCount: 4, trainerName: 'Vikram Singh' },
  { id: 'class_4', name: 'Calisthenics Mobility', time: '05:00 PM', day: 'Wednesday', capacity: 18, bookedCount: 9, trainerName: 'Vikram Singh' },
  { id: 'class_5', name: 'HIIT Extreme', time: '06:00 PM', day: 'Thursday', capacity: 22, bookedCount: 18, trainerName: 'Elena Rostova' },
  { id: 'class_6', name: 'Strength Foundations', time: '09:00 AM', day: 'Saturday', capacity: 20, bookedCount: 7, trainerName: 'Marcus Steele' }
];

export const DEFAULT_GALLERY: GalleryMedia[] = [
  { id: 'gal_1', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600', type: 'image', album: 'Gym Floor', title: 'State of the art cardio floor' },
  { id: 'gal_2', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600', type: 'image', album: 'Classes', title: 'Group cycling studio' },
  { id: 'gal_3', url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=600', type: 'image', album: 'Gym Floor', title: 'Premium selectorized machine zone' },
  { id: 'gal_4', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600', type: 'image', album: 'Classes', title: 'Crossfit group class action' },
  { id: 'gal_5', url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=600', type: 'image', album: 'Events', title: 'Annual Bench Press Challenge' }
];

export const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    name: 'Siddharth Sharma',
    role: 'Member for 2 Years',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    quote: 'MS Fitness has completely changed my life. The trainers are top notch and the overall vibe is incredibly motivating. Highly recommend!',
    rating: 5
  },
  {
    id: 2,
    name: 'Priya Patel',
    role: 'Member for 8 Months',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    quote: 'I love Elena\'s HIIT classes. They are super challenging but incredibly rewarding. The facility is always exceptionally clean.',
    rating: 5
  },
  {
    id: 3,
    name: 'Aditya Roy',
    role: 'Member for 1 Year',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    quote: 'The BMI tools and customized tracking logs in the user panel make it so easy to monitor my strength gains. Best gym in town.',
    rating: 5
  }
];

export const DEFAULT_FAQS = [
  { q: 'What are the operating hours for MS Fitness?', a: 'We are open from 05:00 AM to 11:00 PM on weekdays, and 06:00 AM to 09:00 PM on weekends.' },
  { q: 'Is there a free trial before joining?', a: 'Yes! We offer a free 1-day guest pass for all first-time local visitors. Simply stop by or contact us to set it up.' },
  { q: 'Can I freeze or pause my membership?', a: 'Yes, Elite and Premium memberships can be paused for up to 30 days per calendar year. Basic memberships do not allow freezes.' },
  { q: 'Are personal training sessions included in the membership?', a: 'Elite and Premium memberships include a fixed number of PT sessions. Additional 1-on-1 personal training packages can be purchased in the user panel.' },
  { q: 'What is your refund policy?', a: 'We offer a 3-day money-back guarantee for all new memberships if you are not fully satisfied with our facilities.' }
];

export const DEFAULT_BLOGS = [
  {
    id: 'blog_1',
    title: 'Top 5 Strength Training Inventions of 2026',
    excerpt: 'How modern biometrics and kinetic resistance machines are taking workouts to the next level.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400',
    date: 'June 18, 2026',
    author: 'Marcus Steele'
  },
  {
    id: 'blog_2',
    title: 'The Ultimate Guide to Muscle Recovery & Deep Sleep',
    excerpt: 'Why sleep is the most anabolic tool in your cabinet and how yoga alignment stimulates regeneration.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400',
    date: 'June 10, 2026',
    author: 'Vikram Singh'
  },
  {
    id: 'blog_3',
    title: 'Functional Nutrition: Fueling for HIIT Sessions',
    excerpt: 'Simple high-octane snacks and timing strategies to maximize cardiovascular endurance and fat oxidation.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=400',
    date: 'May 28, 2026',
    author: 'Elena Rostova'
  }
];

export const DEFAULT_WEBSITE_TEXTS = {
  heroTitle: 'FORGE YOUR FINEST SELF',
  heroSubtitle: 'MS FITNESS IS A ELITE ATHLETIC FACILITY BUILT FOR EXCELLENCE. TRAIN WITH THE ABSOLUTE BEST PROS, TRACK YOUR POWER GAINS, AND TRANSFORM.',
  aboutTitle: 'WE DEFINE MODERN ELITE TRAINING',
  aboutSubtitle: 'Since our establishment, MS Fitness has served as the premier training destination for athletes, fitness competitors, and everyday heroes.',
  aboutDescription: 'Our 12,000 square foot facility contains cutting-edge selectorized and plate-loaded machines, Olympic platforms, dedicated functional fitness turf, and dynamic group fitness studios. We believe in high-contrast execution, professional coaching, and measurable results.',
  address: '102, Fitness Circle, Sector-4, Near Power Hub, New Delhi, India',
  phone: '+91 98765 43210',
  email: 'support@msfitness.com',
  socialInstagram: 'https://instagram.com/msfitness',
  socialFacebook: 'https://facebook.com/msfitness',
  socialTwitter: 'https://twitter.com/msfitness'
};
