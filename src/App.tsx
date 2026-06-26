import React, { useState, useEffect } from 'react';
import { auth, db, handleFirestoreError, OperationType, googleProvider } from './firebase';
import { onAuthStateChanged, signInWithPopup, User as FirebaseUser } from 'firebase/auth';
import {
  collection, doc, setDoc, getDoc, getDocs, onSnapshot, updateDoc, addDoc, deleteDoc, writeBatch, query, where
} from 'firebase/firestore';
import {
  UserProfile, MembershipPlan, MembershipRequest, GroupClass, Trainer, SupportTicket, ContactSubmission, Announcement, GalleryMedia
} from './types';
import {
  DEFAULT_PLANS, DEFAULT_TRAINERS, DEFAULT_CLASSES, DEFAULT_GALLERY, DEFAULT_TESTIMONIALS, DEFAULT_FAQS, DEFAULT_BLOGS, DEFAULT_WEBSITE_TEXTS
} from './data';

// Component Imports
import Header from './components/Header';
import Footer from './components/Footer';
import BmiCalculator from './components/BmiCalculator';
import MembershipPlans from './components/MembershipPlans';
import GroupClasses from './components/GroupClasses';
import TrainersSection from './components/TrainersSection';
import GallerySection from './components/GallerySection';
import Testimonials from './components/Testimonials';
import ContactSection from './components/ContactSection';
import UserProfileView from './components/UserProfile';
import AdminPanel from './components/AdminPanel';
import AdminLoginModal from './components/AdminLoginModal';

// Icons
import { Dumbbell, ShieldAlert, BookOpen, Activity, Play, ChevronRight, Check } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);

  // Firestore Collections Data State
  const [plans, setPlans] = useState<MembershipPlan[]>(DEFAULT_PLANS);
  const [trainers, setTrainers] = useState<Trainer[]>(DEFAULT_TRAINERS);
  const [classes, setClasses] = useState<GroupClass[]>(DEFAULT_CLASSES);
  const [gallery, setGallery] = useState<GalleryMedia[]>(DEFAULT_GALLERY);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [membershipRequests, setMembershipRequests] = useState<MembershipRequest[]>([]);
  const [members, setMembers] = useState<UserProfile[]>([]);

  // CMS/Website Texts State
  const [websiteTexts, setWebsiteTexts] = useState(DEFAULT_WEBSITE_TEXTS);

  // 1. Listen for Auth State changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          // If logged in, fetch/create profile in Firestore
          const userRef = doc(db, 'users', firebaseUser.uid);
          const snapshot = await getDoc(userRef).catch(err => {
            handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`);
            throw err;
          });

          if (snapshot.exists()) {
            setUserProfile(snapshot.data() as UserProfile);
          } else {
            // Create default user profile
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL || '',
              membershipStatus: 'none',
              joinedAt: new Date().toLocaleDateString(),
              updatedAt: new Date().toLocaleDateString()
            };
            await setDoc(userRef, newProfile).catch(err => {
              handleFirestoreError(err, OperationType.CREATE, `users/${firebaseUser.uid}`);
              throw err;
            });
            setUserProfile(newProfile);
          }
        } catch (err) {
          console.error('Error fetching/creating user profile:', err);
        }

        // Automatic Admin bypass if email matches developer demo user
        if (firebaseUser.email === 'demo.msfitness@gmail.com') {
          setIsAdminLoggedIn(true);
        }
      } else {
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Database Seeding (Admins only)
  useEffect(() => {
    if (!isAdminLoggedIn) return;

    const seedDb = async () => {
      try {
        const plansSnap = await getDocs(collection(db, 'groupClasses')).catch(err => {
          handleFirestoreError(err, OperationType.GET, 'groupClasses');
          throw err;
        });
        if (plansSnap.empty) {
          const batch = writeBatch(db);
          // Seed classes
          DEFAULT_CLASSES.forEach(c => {
            batch.set(doc(db, 'groupClasses', c.id), c);
          });
          // Seed plans
          DEFAULT_PLANS.forEach(p => {
            batch.set(doc(db, 'websiteContent', 'plan_' + p.id), { id: p.id, ...p });
          });
          // Seed trainers
          DEFAULT_TRAINERS.forEach(t => {
            batch.set(doc(db, 'trainers', t.id), t);
          });
          // Seed gallery
          DEFAULT_GALLERY.forEach(g => {
            batch.set(doc(db, 'gallery', g.id), g);
          });
          await batch.commit().catch(err => {
            handleFirestoreError(err, OperationType.WRITE, 'seeding');
            throw err;
          });
          console.log('Database seeded successfully.');
        }
      } catch (err) {
        console.error('Database seeding failed:', err);
      }
    };
    seedDb();
  }, [isAdminLoggedIn]);

  // 3. Public Real-time Listeners
  useEffect(() => {
    const unsubClasses = onSnapshot(collection(db, 'groupClasses'), (snap) => {
      const data: GroupClass[] = [];
      snap.forEach(doc => data.push(doc.data() as GroupClass));
      if (data.length > 0) setClasses(data);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'groupClasses');
    });

    const unsubTrainers = onSnapshot(collection(db, 'trainers'), (snap) => {
      const data: Trainer[] = [];
      snap.forEach(doc => data.push(doc.data() as Trainer));
      if (data.length > 0) setTrainers(data);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'trainers');
    });

    const unsubGallery = onSnapshot(collection(db, 'gallery'), (snap) => {
      const data: GalleryMedia[] = [];
      snap.forEach(doc => data.push(doc.data() as GalleryMedia));
      if (data.length > 0) setGallery(data);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'gallery');
    });

    const unsubAnnouncements = onSnapshot(collection(db, 'announcements'), (snap) => {
      const data: Announcement[] = [];
      snap.forEach(doc => data.push(doc.data() as Announcement));
      setAnnouncements(data.sort((a,b) => b.createdAt.localeCompare(a.createdAt)));
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'announcements');
    });

    const unsubCMS = onSnapshot(doc(db, 'websiteContent', 'homepage'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setWebsiteTexts(prev => ({ ...prev, ...data.content }));
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'websiteContent/homepage');
    });

    return () => {
      unsubClasses();
      unsubTrainers();
      unsubGallery();
      unsubAnnouncements();
      unsubCMS();
    };
  }, []);

  // 4. Authenticated & Admin-specific Listeners
  useEffect(() => {
    if (!user) {
      setBookings([]);
      setMembershipRequests([]);
      setSupportTickets([]);
      setContactSubmissions([]);
      setMembers([]);
      return;
    }

    let unsubBookings: () => void;
    let unsubRequests: () => void;
    let unsubTickets: () => void;
    let unsubContacts: (() => void) | undefined;
    let unsubMembers: (() => void) | undefined;

    if (isAdminLoggedIn) {
      unsubBookings = onSnapshot(collection(db, 'bookings'), (snap) => {
        const data: any[] = [];
        snap.forEach(doc => data.push(doc.data()));
        setBookings(data);
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, 'bookings');
      });

      unsubRequests = onSnapshot(collection(db, 'membershipRequests'), (snap) => {
        const data: MembershipRequest[] = [];
        snap.forEach(doc => data.push(doc.data() as MembershipRequest));
        setMembershipRequests(data);
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, 'membershipRequests');
      });

      unsubTickets = onSnapshot(collection(db, 'supportTickets'), (snap) => {
        const data: SupportTicket[] = [];
        snap.forEach(doc => data.push(doc.data() as SupportTicket));
        setSupportTickets(data);
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, 'supportTickets');
      });

      unsubContacts = onSnapshot(collection(db, 'contactSubmissions'), (snap) => {
        const data: ContactSubmission[] = [];
        snap.forEach(doc => data.push(doc.data() as ContactSubmission));
        setContactSubmissions(data);
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, 'contactSubmissions');
      });

      unsubMembers = onSnapshot(collection(db, 'users'), (snap) => {
        const data: UserProfile[] = [];
        snap.forEach(doc => data.push(doc.data() as UserProfile));
        setMembers(data);
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, 'users');
      });
    } else {
      const qBookings = query(collection(db, 'bookings'), where('userId', '==', user.uid));
      unsubBookings = onSnapshot(qBookings, (snap) => {
        const data: any[] = [];
        snap.forEach(doc => data.push(doc.data()));
        setBookings(data);
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, `bookings?userId=${user.uid}`);
      });

      const qRequests = query(collection(db, 'membershipRequests'), where('userId', '==', user.uid));
      unsubRequests = onSnapshot(qRequests, (snap) => {
        const data: MembershipRequest[] = [];
        snap.forEach(doc => data.push(doc.data() as MembershipRequest));
        setMembershipRequests(data);
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, `membershipRequests?userId=${user.uid}`);
      });

      const qTickets = query(collection(db, 'supportTickets'), where('userId', '==', user.uid));
      unsubTickets = onSnapshot(qTickets, (snap) => {
        const data: SupportTicket[] = [];
        snap.forEach(doc => data.push(doc.data() as SupportTicket));
        setSupportTickets(data);
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, `supportTickets?userId=${user.uid}`);
      });
    }

    return () => {
      if (unsubBookings) unsubBookings();
      if (unsubRequests) unsubRequests();
      if (unsubTickets) unsubTickets();
      if (unsubContacts) unsubContacts();
      if (unsubMembers) unsubMembers();
    };
  }, [user, isAdminLoggedIn]);

  // --- ACTIONS ---

  // Handle Contact Submission
  const handleContactSubmit = async (name: string, email: string, phone: string, message: string) => {
    try {
      const submissionId = 'sub_' + Date.now();
      const submission: ContactSubmission = {
        id: submissionId,
        name,
        email,
        phone,
        message,
        status: 'unread',
        createdAt: new Date().toLocaleDateString()
      };
      await setDoc(doc(db, 'contactSubmissions', submissionId), submission).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `contactSubmissions/${submissionId}`);
        throw err;
      });
    } catch (err) {
      console.error('Contact submission write failed:', err);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Auth login error from select plan:', error);
      alert('Login failed. Please try again or allow popups in your browser.');
    }
  };

  // Handle Membership Request
  const handleMembershipRequest = async (
    plan: MembershipPlan,
    paymentMethod: string,
    paymentProof: string,
    registrationData?: {
      name?: string;
      phone?: string;
      gender?: string;
      age?: string;
      emergencyContact?: string;
      fitnessGoals?: string;
      medicalConditions?: string;
    }
  ) => {
    if (!user) {
      throw new Error('Please login first.');
    }

    let activeProfile = userProfile;
    if (!activeProfile) {
      try {
        const userRef = doc(db, 'users', user.uid);
        const snapshot = await getDoc(userRef);
        if (snapshot.exists()) {
          activeProfile = snapshot.data() as UserProfile;
          setUserProfile(activeProfile);
        } else {
          const newProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            name: user.displayName || '',
            photoURL: user.photoURL || '',
            membershipStatus: 'none',
            joinedAt: new Date().toLocaleDateString(),
            updatedAt: new Date().toLocaleDateString()
          };
          await setDoc(userRef, newProfile);
          activeProfile = newProfile;
          setUserProfile(newProfile);
        }
      } catch (err) {
        console.error('Failed to resolve user profile on-demand:', err);
        throw new Error('Failed to load user profile. Please ensure you are logged in and have permissions.');
      }
    }

    try {
      const requestId = 'req_' + Date.now();
      const request: MembershipRequest = {
        id: requestId,
        userId: user.uid,
        userName: registrationData?.name || activeProfile.name || user.displayName || user.email || 'Athlete',
        userEmail: user.email || '',
        planId: plan.id,
        planName: plan.name,
        price: plan.price,
        duration: plan.duration,
        status: 'pending',
        paymentMethod: paymentMethod as any,
        paymentProof,
        createdAt: new Date().toLocaleDateString(),
        phone: registrationData?.phone || activeProfile.phone || '',
        gender: registrationData?.gender || activeProfile.gender || '',
        age: registrationData?.age || activeProfile.age || '',
        emergencyContact: registrationData?.emergencyContact || activeProfile.emergencyContact || '',
        fitnessGoals: registrationData?.fitnessGoals || activeProfile.fitnessGoals || '',
        medicalConditions: registrationData?.medicalConditions || activeProfile.medicalConditions || ''
      };

      await setDoc(doc(db, 'membershipRequests', requestId), request).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `membershipRequests/${requestId}`);
        throw err;
      });

      // Instantly update user local profile status to pending and save registration info
      const profileUpdate: Partial<UserProfile> = {
        membershipStatus: 'pending',
        activePlanId: plan.id,
        activePlanName: plan.name,
        updatedAt: new Date().toLocaleDateString()
      };

      if (registrationData) {
        if (registrationData.name) profileUpdate.name = registrationData.name;
        if (registrationData.phone) profileUpdate.phone = registrationData.phone;
        if (registrationData.gender) profileUpdate.gender = registrationData.gender;
        if (registrationData.age) profileUpdate.age = registrationData.age;
        if (registrationData.emergencyContact) profileUpdate.emergencyContact = registrationData.emergencyContact;
        if (registrationData.fitnessGoals) profileUpdate.fitnessGoals = registrationData.fitnessGoals;
        if (registrationData.medicalConditions) profileUpdate.medicalConditions = registrationData.medicalConditions;
      }

      await updateDoc(doc(db, 'users', user.uid), profileUpdate).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
        throw err;
      });

      // Update local profile state
      setUserProfile(prev => prev ? {
        ...prev,
        ...profileUpdate
      } : {
        ...activeProfile,
        ...profileUpdate
      });

    } catch (err) {
      console.error('Membership request write failed:', err);
      throw err;
    }
  };

  // Approve Request (Admin Action)
  const handleApproveRequest = async (requestId: string, notes: string) => {
    try {
      const reqRef = doc(db, 'membershipRequests', requestId);
      await updateDoc(reqRef, {
        status: 'active',
        adminNotes: notes
      }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `membershipRequests/${requestId}`);
        throw err;
      });

      // Find user uid from requests
      const targetRequest = membershipRequests.find(r => r.id === requestId);
      if (targetRequest) {
        // Calculate expiry date (mock adding months depending on duration)
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + (targetRequest.duration.includes('12') ? 12 : 1));

        await updateDoc(doc(db, 'users', targetRequest.userId), {
          membershipStatus: 'active',
          membershipExpiryDate: expiryDate.toLocaleDateString(),
          updatedAt: new Date().toLocaleDateString()
        }).catch(err => {
          handleFirestoreError(err, OperationType.UPDATE, `users/${targetRequest.userId}`);
          throw err;
        });
      }
    } catch (err) {
      console.error('Approve request failed:', err);
    }
  };

  // Reject Request (Admin Action)
  const handleRejectRequest = async (requestId: string, notes: string) => {
    try {
      await updateDoc(doc(db, 'membershipRequests', requestId), {
        status: 'expired',
        adminNotes: notes
      }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `membershipRequests/${requestId}`);
        throw err;
      });
      const targetRequest = membershipRequests.find(r => r.id === requestId);
      if (targetRequest) {
        await updateDoc(doc(db, 'users', targetRequest.userId), {
          membershipStatus: 'none',
          updatedAt: new Date().toLocaleDateString()
        }).catch(err => {
          handleFirestoreError(err, OperationType.UPDATE, `users/${targetRequest.userId}`);
          throw err;
        });
      }
    } catch (err) {
      console.error('Reject request failed:', err);
    }
  };

  // Book class reservation
  const handleBookClass = async (
    groupClass: GroupClass,
    bookingData?: {
      phone?: string;
      notes?: string;
      experienceLevel?: string;
    }
  ) => {
    if (!user || !userProfile) return;
    try {
      const bookingId = 'book_' + Date.now();
      const booking = {
        id: bookingId,
        userId: user.uid,
        userName: userProfile.name || user.displayName || 'Athlete',
        classId: groupClass.id,
        className: groupClass.name,
        trainerName: groupClass.trainerName || 'Coach',
        time: groupClass.time,
        date: new Date().toLocaleDateString(),
        status: 'booked' as const,
        createdAt: new Date().toLocaleDateString(),
        phone: bookingData?.phone || '',
        notes: bookingData?.notes || '',
        experienceLevel: bookingData?.experienceLevel || 'Beginner'
      };

      await setDoc(doc(db, 'bookings', bookingId), booking).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `bookings/${bookingId}`);
        throw err;
      });

      // Increment bookedCount
      await updateDoc(doc(db, 'groupClasses', groupClass.id), {
        bookedCount: (groupClass.bookedCount || 0) + 1
      }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `groupClasses/${groupClass.id}`);
        throw err;
      });
    } catch (err) {
      console.error('Booking failed:', err);
      throw err;
    }
  };

  // Cancel reservation
  const handleCancelBooking = async (bookingId: string) => {
    try {
      const targetBooking = bookings.find(b => b.id === bookingId);
      if (targetBooking) {
        await updateDoc(doc(db, 'bookings', bookingId), {
          status: 'cancelled'
        }).catch(err => {
          handleFirestoreError(err, OperationType.UPDATE, `bookings/${bookingId}`);
          throw err;
        });

        const targetClass = classes.find(c => c.id === targetBooking.classId);
        if (targetClass) {
          await updateDoc(doc(db, 'groupClasses', targetClass.id), {
            bookedCount: Math.max(0, (targetClass.bookedCount || 0) - 1)
          }).catch(err => {
            handleFirestoreError(err, OperationType.UPDATE, `groupClasses/${targetClass.id}`);
            throw err;
          });
        }
      }
    } catch (err) {
      console.error('Cancellation failed:', err);
    }
  };

  // Create Announcement (Admin Action)
  const handleCreateAnnouncement = async (title: string, content: string, isPinned: boolean) => {
    try {
      const annId = 'ann_' + Date.now();
      const ann: Announcement = {
        id: annId,
        title,
        content,
        isPinned,
        createdAt: new Date().toLocaleDateString()
      };
      await setDoc(doc(db, 'announcements', annId), ann).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `announcements/${annId}`);
        throw err;
      });
    } catch (err) {
      console.error('Announcement creation failed:', err);
    }
  };

  const handleDeleteAnnouncement = async (annId: string) => {
    try {
      await deleteDoc(doc(db, 'announcements', annId)).catch(err => {
        handleFirestoreError(err, OperationType.DELETE, `announcements/${annId}`);
        throw err;
      });
    } catch (err) {
      console.error('Announcement deletion failed:', err);
    }
  };

  // Create Support Ticket
  const handleCreateTicket = async (subject: string, message: string, priority: 'low' | 'medium' | 'high') => {
    if (!user || !userProfile) return;
    try {
      const ticketId = 'ticket_' + Date.now();
      const ticket: SupportTicket = {
        id: ticketId,
        userId: user.uid,
        userName: userProfile.name || user.displayName || 'Athlete',
        subject,
        message,
        priority,
        status: 'open',
        replies: [],
        createdAt: new Date().toLocaleDateString()
      };
      await setDoc(doc(db, 'supportTickets', ticketId), ticket).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `supportTickets/${ticketId}`);
        throw err;
      });
    } catch (err) {
      console.error('Ticket creation failed:', err);
    }
  };

  // Reply Support Ticket (User or Admin)
  const handleReplyTicket = async (ticketId: string, replyMessage: string, senderType: 'user' | 'admin' = 'user') => {
    try {
      const ticketRef = doc(db, 'supportTickets', ticketId);
      const ticketSnap = await getDoc(ticketRef).catch(err => {
        handleFirestoreError(err, OperationType.GET, `supportTickets/${ticketId}`);
        throw err;
      });
      if (ticketSnap.exists()) {
        const ticket = ticketSnap.data() as SupportTicket;
        const updatedReplies = [...(ticket.replies || []), {
          sender: senderType,
          senderName: senderType === 'admin' ? 'MS Admin' : (userProfile?.name || 'Athlete'),
          message: replyMessage,
          createdAt: new Date().toLocaleDateString()
        }];
        await updateDoc(ticketRef, { replies: updatedReplies }).catch(err => {
          handleFirestoreError(err, OperationType.UPDATE, `supportTickets/${ticketId}`);
          throw err;
        });
      }
    } catch (err) {
      console.error('Ticket reply failed:', err);
    }
  };

  // Mark support ticket closed (Admin Action)
  const handleCloseTicket = async (ticketId: string) => {
    try {
      await updateDoc(doc(db, 'supportTickets', ticketId), { status: 'closed' }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `supportTickets/${ticketId}`);
        throw err;
      });
    } catch (err) {
      console.error('Closing ticket failed:', err);
    }
  };

  // CMS dynamic edit save
  const handleCMSUpdate = async (key: string, value: any) => {
    try {
      const currentTexts = { ...websiteTexts, [key]: value };
      await setDoc(doc(db, 'websiteContent', 'homepage'), {
        id: 'homepage',
        content: currentTexts,
        updatedAt: new Date().toLocaleDateString()
      }).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, 'websiteContent/homepage');
        throw err;
      });
      setWebsiteTexts(currentTexts);
    } catch (err) {
      console.error('CMS Write failed:', err);
    }
  };

  // Simple static plans operations
  const handleCreatePlan = async (plan: MembershipPlan) => {
    setPlans(prev => [...prev, plan]);
  };
  const handleDeletePlan = async (planId: string) => {
    setPlans(prev => prev.filter(p => p.id !== planId));
  };

  // Trainer Operations
  const handleCreateTrainer = async (trainer: Trainer) => {
    try {
      await setDoc(doc(db, 'trainers', trainer.id), trainer).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `trainers/${trainer.id}`);
        throw err;
      });
      setTrainers(prev => [...prev, trainer]);
    } catch (err) {
      console.error('Error creating trainer:', err);
    }
  };

  // Class Operations
  const handleCreateClass = async (groupClass: GroupClass) => {
    try {
      await setDoc(doc(db, 'groupClasses', groupClass.id), groupClass).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `groupClasses/${groupClass.id}`);
        throw err;
      });
      setClasses(prev => [...prev, groupClass]);
    } catch (err) {
      console.error('Error creating class:', err);
    }
  };

  // Navigation pages routing
  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-black min-h-screen flex flex-col justify-between selection:bg-red-600 selection:text-white">
      {/* Header Bar */}
      <Header
        user={user}
        isAdminLoggedIn={isAdminLoggedIn}
        onNavigate={navigateTo}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onAdminLogout={() => setIsAdminLoggedIn(false)}
      />

      {/* Main Container Stage */}
      <main className="flex-grow">
        {/* Render Announcements at top of website home */}
        {currentPage === 'home' && announcements.filter(a => a.isPinned).map(a => (
          <div key={a.id} className="bg-red-650 text-white text-xs py-3 px-4 text-center font-bold font-sans flex items-center justify-center gap-2 relative">
            <ShieldAlert className="h-4 w-4" />
            <span>{a.title}: {a.content.substring(0, 100)}...</span>
          </div>
        ))}

        {/* Home Landing Page */}
        {currentPage === 'home' && (
          <div className="animate-fade-in font-sans">
            {/* Hero Splash Area */}
            <section className="relative bg-zinc-950 text-white min-h-[80vh] flex items-center overflow-hidden border-b border-zinc-900">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1500')] bg-cover opacity-20 bg-center" />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20">
                <div className="max-w-2xl space-y-6">
                  <span className="text-red-600 font-extrabold tracking-widest uppercase text-sm font-mono border-l-4 border-red-600 pl-3">
                    Delhi Central Elite Athletic Club
                  </span>
                  <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none uppercase">
                    {websiteTexts.heroTitle}
                  </h1>
                  <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                    {websiteTexts.heroSubtitle}
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <button
                      onClick={() => navigateTo('plans')}
                      className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-md text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-xl shadow-red-600/10"
                    >
                      Join Club
                    </button>
                    <button
                      onClick={() => navigateTo('classes')}
                      className="bg-transparent border border-zinc-700 hover:border-red-600 hover:bg-red-600/5 text-white px-8 py-4 rounded-md text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
                    >
                      Class Schedule
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Pitch Stats */}
            <section className="bg-zinc-950 py-12 border-b border-zinc-900">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <span className="text-4xl font-black text-red-600">12K</span>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Sq Ft Facility</p>
                </div>
                <div>
                  <span className="text-4xl font-black text-white">35+</span>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Plate Loaded Rigs</p>
                </div>
                <div>
                  <span className="text-4xl font-black text-white">100%</span>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Qualified Coaches</p>
                </div>
                <div>
                  <span className="text-4xl font-black text-red-600">24/7</span>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Elite Card Access</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* About Section */}
        {currentPage === 'about' && (
          <section className="bg-zinc-950 py-20 border-b border-zinc-900 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <span className="text-red-600 font-semibold tracking-wider uppercase text-xs">Establishment Bio</span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
                    {websiteTexts.aboutTitle}
                  </h2>
                  <p className="text-zinc-300 text-sm font-semibold">
                    {websiteTexts.aboutSubtitle}
                  </p>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    {websiteTexts.aboutDescription}
                  </p>
                </div>
                <div className="h-96 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
                  <img
                    src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800"
                    alt="MS Facility"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Dynamic Section Routing */}
        {currentPage === 'plans' && (
          <MembershipPlans
            plans={plans}
            user={user}
            onPurchaseRequest={handleMembershipRequest}
            onLoginRequest={handleGoogleLogin}
            userActivePlanId={userProfile?.activePlanId}
            userMembershipStatus={userProfile?.membershipStatus}
            userProfile={userProfile}
          />
        )}

        {currentPage === 'classes' && (
          <GroupClasses
            classes={classes}
            bookings={bookings}
            onBookClass={handleBookClass}
            onCancelBooking={handleCancelBooking}
            user={user}
            userActivePlanName={userProfile?.activePlanName}
            userMembershipStatus={userProfile?.membershipStatus}
            userProfile={userProfile}
          />
        )}

        {currentPage === 'trainers' && (
          <TrainersSection trainers={trainers} />
        )}

        {currentPage === 'gallery' && (
          <GallerySection media={gallery} />
        )}

        {currentPage === 'bmi' && (
          <BmiCalculator />
        )}

        {currentPage === 'testimonials' && (
          <Testimonials testimonials={DEFAULT_TESTIMONIALS} />
        )}

        {/* FAQ Page */}
        {currentPage === 'faq' && (
          <section className="bg-zinc-950 py-20 border-b border-zinc-900 font-sans">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-black text-center text-white uppercase mb-12">Frequently Asked Queries</h2>
              <div className="space-y-4">
                {DEFAULT_FAQS.map((faq, i) => (
                  <div key={i} className="bg-zinc-900 border border-zinc-850 p-6 rounded-xl">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">{faq.q}</h4>
                    <p className="text-zinc-500 text-xs leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Blog Section */}
        {currentPage === 'blog' && (
          <section className="bg-zinc-950 py-20 border-b border-zinc-900 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <span className="text-red-600 font-semibold tracking-wider uppercase text-xs">MS News</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase mt-1">MS Fitness Blog</h2>
                <p className="mt-3 max-w-2xl mx-auto text-zinc-500 text-sm">Read the latest athletic training, powerlifting biomechanics, and cardiovascular recovery newsletters.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {DEFAULT_BLOGS.map((blog) => (
                  <div key={blog.id} className="bg-zinc-900 border border-zinc-850 rounded-xl overflow-hidden hover:border-red-600/30 transition-all">
                    <div className="h-48 bg-zinc-950">
                      <img src={blog.image} alt={blog.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-6 space-y-3">
                      <span className="text-[10px] text-zinc-500 font-mono block">{blog.date} | By {blog.author}</span>
                      <h4 className="text-base font-bold text-white uppercase tracking-wider h-12 overflow-hidden leading-tight">{blog.title}</h4>
                      <p className="text-zinc-500 text-xs leading-relaxed h-12 overflow-hidden">{blog.excerpt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {currentPage === 'contact' && (
          <ContactSection onSubmitContact={handleContactSubmit} texts={websiteTexts} />
        )}

        {/* Legal Pages */}
        {currentPage === 'privacy' && (
          <section className="bg-zinc-950 py-20 text-zinc-400 font-sans text-xs sm:text-sm leading-relaxed border-b border-zinc-900">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <h2 className="text-2xl font-black text-white uppercase border-b border-zinc-800 pb-3">Privacy & Biometric Policy</h2>
              <p>At MS Fitness Delhi, we prioritize the secure isolation of your biometric RFID card credentials and private contact profiles. All profile files are protected by high-grade application encryption.</p>
              <p>We do not sell or lease user contact numbers or email credentials. Gate check-in histories are retained strictly for logistical verification purposes.</p>
            </div>
          </section>
        )}

        {currentPage === 'terms' && (
          <section className="bg-zinc-950 py-20 text-zinc-400 font-sans text-xs sm:text-sm leading-relaxed border-b border-zinc-900">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <h2 className="text-2xl font-black text-white uppercase border-b border-zinc-800 pb-3">Terms & Conditions of Club Entry</h2>
              <p>Access to our 12,000 square foot facility is strictly governed by approved active membership plans. Users agree to wear appropriate athletic apparel and verify check-ins via scanner terminals.</p>
              <p>Membership requests and fee payments are governed by our local bank processing guidelines. No recursive spamming of tickets is permitted.</p>
            </div>
          </section>
        )}

        {/* User Dashboard Portal Routing */}
        {currentPage === 'user-panel' && userProfile && (
          <UserProfileView
            profile={userProfile}
            bookings={bookings.filter(b => b.userId === user?.uid)}
            supportTickets={supportTickets.filter(t => t.userId === user?.uid)}
            announcements={announcements}
            payments={membershipRequests.filter(r => r.userId === user?.uid)}
            onUpdateProfile={async (name, phone, photoURL) => {
              if (user) {
                await updateDoc(doc(db, 'users', user.uid), { name, phone, photoURL }).catch(err => {
                  handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
                  throw err;
                });
                setUserProfile(prev => prev ? { ...prev, name, phone, photoURL } : null);
              }
            }}
            onSubmitTicket={handleCreateTicket}
            onSubmitTicketReply={handleReplyTicket}
            onCancelBooking={handleCancelBooking}
          />
        )}

        {/* Admin Dashboard Control Panel Routing */}
        {currentPage === 'admin' && isAdminLoggedIn && (
          <AdminPanel
            members={members}
            membershipRequests={membershipRequests}
            classes={classes}
            trainers={trainers}
            tickets={supportTickets}
            contacts={contactSubmissions}
            announcements={announcements}
            gallery={gallery}
            plans={plans}
            bookings={bookings}
            onApproveRequest={handleApproveRequest}
            onRejectRequest={handleRejectRequest}
            onUpdatePlan={() => {}} // redirects to static updates
            onCreatePlan={handleCreatePlan}
            onDeletePlan={handleDeletePlan}
            onUpdateTrainer={() => {}}
            onCreateTrainer={handleCreateTrainer}
            onDeleteTrainer={async (id) => {
              await deleteDoc(doc(db, 'trainers', id)).catch(err => {
                handleFirestoreError(err, OperationType.DELETE, `trainers/${id}`);
                throw err;
              });
            }}
            onUpdateClass={() => {}}
            onCreateClass={handleCreateClass}
            onDeleteClass={async (id) => {
              await deleteDoc(doc(db, 'groupClasses', id)).catch(err => {
                handleFirestoreError(err, OperationType.DELETE, `groupClasses/${id}`);
                throw err;
              });
            }}
            onCreateAnnouncement={handleCreateAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
            onSubmitSupportReply={(id, reply) => handleReplyTicket(id, reply, 'admin')}
            onCloseTicket={handleCloseTicket}
            onDeleteContact={async (id) => {
              await deleteDoc(doc(db, 'contactSubmissions', id)).catch(err => {
                handleFirestoreError(err, OperationType.DELETE, `contactSubmissions/${id}`);
                throw err;
              });
            }}
            onMarkContactRead={async (id) => {
              await updateDoc(doc(db, 'contactSubmissions', id), { status: 'read' }).catch(err => {
                handleFirestoreError(err, OperationType.UPDATE, `contactSubmissions/${id}`);
                throw err;
              });
            }}
            onUpdateWebsiteContent={handleCMSUpdate}
            websiteContent={websiteTexts}
          />
        )}
      </main>

      {/* Footer Details */}
      <Footer onNavigate={navigateTo} texts={websiteTexts} />

      {/* Admin Credentials Login Modal Popup */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdminLoggedIn(true);
          navigateTo('admin');
        }}
      />
    </div>
  );
}
