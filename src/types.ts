export interface UserProfile {
  uid: string;
  name?: string;
  email: string;
  phone?: string;
  photoURL?: string;
  membershipStatus?: 'none' | 'pending' | 'approved' | 'active' | 'expired';
  activePlanId?: string;
  activePlanName?: string;
  membershipExpiryDate?: string;
  joinedAt?: string;
  updatedAt?: string;
  gender?: string;
  age?: string;
  emergencyContact?: string;
  fitnessGoals?: string;
  medicalConditions?: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  duration: string; // e.g. "1 Month", "12 Months"
  features: string[];
  imageURL?: string;
  discount?: number; // percent e.g. 15 for 15%
  isPopular?: boolean;
  isEnabled: boolean;
}

export interface MembershipRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: string;
  planName: string;
  price: number;
  duration: string;
  status: 'pending' | 'approved' | 'active' | 'expired';
  paymentMethod: 'UPI' | 'Stripe' | 'Razorpay' | 'Credit Card' | 'Cash' | 'Offline';
  paymentProof?: string; // photo or note
  createdAt: string;
  adminNotes?: string;
  phone?: string;
  gender?: string;
  age?: string;
  emergencyContact?: string;
  fitnessGoals?: string;
  medicalConditions?: string;
}

export interface GroupClass {
  id: string;
  name: string;
  trainerId?: string;
  trainerName?: string;
  time: string; // e.g. "08:00 AM"
  day: string; // e.g. "Monday", "Tuesday"
  capacity: number;
  bookedCount: number;
  createdAt?: string;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  classId?: string;
  className?: string;
  trainerId?: string;
  trainerName?: string;
  time: string;
  date: string;
  status: 'booked' | 'cancelled';
  createdAt: string;
  phone?: string;
  notes?: string;
  experienceLevel?: string;
}

export interface Trainer {
  id: string;
  name: string;
  specialty: string;
  photoURL: string;
  socialFacebook?: string;
  socialInstagram?: string;
  socialTwitter?: string;
  bio?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  isPinned?: boolean;
  scheduledFor?: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'closed';
  replies?: Array<{
    sender: 'user' | 'admin';
    senderName: string;
    message: string;
    createdAt: string;
  }>;
  createdAt: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  adminNotes?: string;
  createdAt: string;
}

export interface GalleryMedia {
  id: string;
  url: string;
  type: 'image' | 'video';
  album: string; // e.g. "Gym Floor", "Classes", "Events"
  title: string;
}

export interface WebsiteContent {
  id: string;
  content: Record<string, any>;
  updatedAt: string;
}
