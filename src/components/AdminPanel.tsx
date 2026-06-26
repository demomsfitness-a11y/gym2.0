import React, { useState } from 'react';
import {
  UserProfile,
  MembershipRequest,
  GroupClass,
  Trainer,
  SupportTicket,
  ContactSubmission,
  Announcement,
  GalleryMedia,
  MembershipPlan,
  Booking
} from '../types';
import {
  TrendingUp, Users, FileText, CheckCircle, XCircle, Award, Calendar,
  Bell, Image as ImageIcon, MessageSquare, ShieldAlert, Plus, Trash2, Edit, Save, Lock, Search
} from 'lucide-react';

interface AdminPanelProps {
  members: UserProfile[];
  membershipRequests: MembershipRequest[];
  classes: GroupClass[];
  trainers: Trainer[];
  tickets: SupportTicket[];
  contacts: ContactSubmission[];
  announcements: Announcement[];
  gallery: GalleryMedia[];
  plans: MembershipPlan[];
  bookings?: Booking[];
  onApproveRequest: (requestId: string, notes: string) => void;
  onRejectRequest: (requestId: string, notes: string) => void;
  onUpdatePlan: (plan: MembershipPlan) => void;
  onCreatePlan: (plan: MembershipPlan) => void;
  onDeletePlan: (planId: string) => void;
  onUpdateTrainer: (trainer: Trainer) => void;
  onCreateTrainer: (trainer: Trainer) => void;
  onDeleteTrainer: (trainerId: string) => void;
  onUpdateClass: (groupClass: GroupClass) => void;
  onCreateClass: (groupClass: GroupClass) => void;
  onDeleteClass: (classId: string) => void;
  onCreateAnnouncement: (title: string, content: string, isPinned: boolean) => void;
  onDeleteAnnouncement: (annId: string) => void;
  onSubmitSupportReply: (ticketId: string, reply: string) => void;
  onCloseTicket: (ticketId: string) => void;
  onDeleteContact: (contactId: string) => void;
  onMarkContactRead: (contactId: string) => void;
  onUpdateWebsiteContent: (key: string, data: any) => void;
  websiteContent: any;
}

export default function AdminPanel({
  members,
  membershipRequests,
  classes,
  trainers,
  tickets,
  contacts,
  announcements,
  gallery,
  plans,
  bookings = [],
  onApproveRequest,
  onRejectRequest,
  onUpdatePlan,
  onCreatePlan,
  onDeletePlan,
  onUpdateTrainer,
  onCreateTrainer,
  onDeleteTrainer,
  onUpdateClass,
  onCreateClass,
  onDeleteClass,
  onCreateAnnouncement,
  onDeleteAnnouncement,
  onSubmitSupportReply,
  onCloseTicket,
  onDeleteContact,
  onMarkContactRead,
  onUpdateWebsiteContent,
  websiteContent,
}: AdminPanelProps) {
  const [adminTab, setAdminTab] = useState<'dash' | 'requests' | 'members' | 'plans' | 'classes' | 'trainers' | 'notices' | 'support' | 'contacts' | 'cms'>('dash');

  // Plan Form State
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [newPlan, setNewPlan] = useState<Partial<MembershipPlan>>({ name: '', price: 1000, duration: '1 Month', features: [], isEnabled: true });
  const [featureInput, setFeatureInput] = useState('');

  // Trainer Form State
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [newTrainer, setNewTrainer] = useState<Partial<Trainer>>({ name: '', specialty: '', photoURL: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd', bio: '' });

  // Class Form State
  const [editingClass, setEditingClass] = useState<GroupClass | null>(null);
  const [newClass, setNewClass] = useState<Partial<GroupClass>>({ name: '', time: '08:00 AM', day: 'Monday', capacity: 20 });

  // Notice Form State
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticePinned, setNoticePinned] = useState(false);

  // Ticket reply active
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [ticketReply, setTicketReply] = useState('');

  // Search filter
  const [memberSearch, setMemberSearch] = useState('');

  // Admin notes for requests
  const [requestNotes, setRequestNotes] = useState('');

  // Website CMS State
  const [cmsHero, setCmsHero] = useState(websiteContent?.heroTitle || 'FORGE YOUR FINEST SELF');
  const [cmsAbout, setCmsAbout] = useState(websiteContent?.aboutTitle || 'WE DEFINE MODERN ELITE TRAINING');
  const [cmsAddress, setCmsAddress] = useState(websiteContent?.address || 'Delhi Branch, India');
  const [cmsSaved, setCmsSaved] = useState(false);

  // Stats Calculations
  const totalRevenue = membershipRequests
    .filter(r => r.status === 'approved' || r.status === 'active')
    .reduce((sum, r) => sum + r.price, 0);

  const activeMembersCount = members.filter(m => m.membershipStatus === 'active').length;
  const pendingRequestsCount = membershipRequests.filter(r => r.status === 'pending').length;

  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateWebsiteContent('heroTitle', cmsHero);
    onUpdateWebsiteContent('aboutTitle', cmsAbout);
    onUpdateWebsiteContent('address', cmsAddress);
    setCmsSaved(true);
    setTimeout(() => setCmsSaved(false), 2000);
  };

  const handleCreatePlanForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlan.name) return;
    const planToCreate: MembershipPlan = {
      id: 'plan_' + Date.now(),
      name: newPlan.name,
      price: newPlan.price || 0,
      duration: newPlan.duration || '1 Month',
      features: newPlan.features || [],
      isEnabled: true,
      isPopular: newPlan.isPopular || false
    };
    onCreatePlan(planToCreate);
    setNewPlan({ name: '', price: 1000, duration: '1 Month', features: [] });
  };

  const handleCreateTrainerForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrainer.name || !newTrainer.specialty) return;
    const trainerToCreate: Trainer = {
      id: 'trainer_' + Date.now(),
      name: newTrainer.name,
      specialty: newTrainer.specialty,
      photoURL: newTrainer.photoURL || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd',
      bio: newTrainer.bio || ''
    };
    onCreateTrainer(trainerToCreate);
    setNewTrainer({ name: '', specialty: '', photoURL: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd', bio: '' });
  };

  const handleCreateClassForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClass.name) return;
    const classToCreate: GroupClass = {
      id: 'class_' + Date.now(),
      name: newClass.name,
      time: newClass.time || '08:00 AM',
      day: newClass.day || 'Monday',
      capacity: newClass.capacity || 20,
      bookedCount: 0
    };
    onCreateClass(classToCreate);
    setNewClass({ name: '', time: '08:00 AM', day: 'Monday', capacity: 20 });
  };

  const handleCreateAnnouncementForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle || !noticeContent) return;
    onCreateAnnouncement(noticeTitle, noticeContent, noticePinned);
    setNoticeTitle('');
    setNoticeContent('');
    setNoticePinned(false);
  };

  const handleReplyTicketForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketReply || !activeTicket) return;
    onSubmitSupportReply(activeTicket.id, ticketReply);
    setTicketReply('');
    setActiveTicket(null);
  };

  return (
    <div className="bg-zinc-950 min-h-screen text-white py-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header Title */}
        <div className="border-b border-zinc-850 pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">
              MS Fitness <span className="text-red-600">Control Hub</span>
            </h1>
            <p className="text-zinc-500 text-xs mt-1">Operational, financial, and relational database monitoring interface.</p>
          </div>
          <div className="flex gap-2">
            <span className="bg-red-950/40 border border-red-900 text-red-500 text-[10px] font-mono px-3 py-1 rounded">
              Secure Auth Node Active
            </span>
          </div>
        </div>

        {/* Dashboard Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Dashboard menu toggles */}
          <div className="lg:col-span-1 bg-zinc-900 border border-zinc-850 rounded-xl p-2 space-y-1">
            <button
              onClick={() => setAdminTab('dash')}
              className={`w-full text-left py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-3 ${adminTab === 'dash' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:bg-zinc-850'}`}
            >
              <TrendingUp className="h-4 w-4 shrink-0" /> Executive Stats
            </button>
            <button
              onClick={() => setAdminTab('requests')}
              className={`w-full text-left py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-between ${adminTab === 'requests' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:bg-zinc-850'}`}
            >
              <span className="flex items-center gap-3"><FileText className="h-4 w-4 shrink-0" /> Membership Requests</span>
              {pendingRequestsCount > 0 && <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">{pendingRequestsCount}</span>}
            </button>
            <button
              onClick={() => setAdminTab('members')}
              className={`w-full text-left py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-3 ${adminTab === 'members' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:bg-zinc-850'}`}
            >
              <Users className="h-4 w-4 shrink-0" /> Members list
            </button>
            <button
              onClick={() => setAdminTab('plans')}
              className={`w-full text-left py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-3 ${adminTab === 'plans' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:bg-zinc-850'}`}
            >
              <Award className="h-4 w-4 shrink-0" /> Gym Plans
            </button>
            <button
              onClick={() => setAdminTab('classes')}
              className={`w-full text-left py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-3 ${adminTab === 'classes' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:bg-zinc-850'}`}
            >
              <Calendar className="h-4 w-4 shrink-0" /> Class Schedule
            </button>
            <button
              onClick={() => setAdminTab('trainers')}
              className={`w-full text-left py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-3 ${adminTab === 'trainers' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:bg-zinc-850'}`}
            >
              <Users className="h-4 w-4 shrink-0" /> Gym Trainers
            </button>
            <button
              onClick={() => setAdminTab('notices')}
              className={`w-full text-left py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-3 ${adminTab === 'notices' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:bg-zinc-850'}`}
            >
              <Bell className="h-4 w-4 shrink-0" /> Announcements
            </button>
            <button
              onClick={() => setAdminTab('support')}
              className={`w-full text-left py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-between ${adminTab === 'support' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:bg-zinc-850'}`}
            >
              <span className="flex items-center gap-3"><MessageSquare className="h-4 w-4 shrink-0" /> Support Tickets</span>
              {tickets.filter(t => t.status === 'open').length > 0 && <span className="bg-yellow-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">{tickets.filter(t => t.status === 'open').length}</span>}
            </button>
            <button
              onClick={() => setAdminTab('contacts')}
              className={`w-full text-left py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-between ${adminTab === 'contacts' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:bg-zinc-850'}`}
            >
              <span className="flex items-center gap-3"><FileText className="h-4 w-4 shrink-0" /> Contact Inquiries</span>
              {contacts.filter(c => c.status === 'unread').length > 0 && <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">{contacts.filter(c => c.status === 'unread').length}</span>}
            </button>
            <button
              onClick={() => setAdminTab('cms')}
              className={`w-full text-left py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-3 ${adminTab === 'cms' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:bg-zinc-850'}`}
            >
              <Save className="h-4 w-4 shrink-0" /> Website Editor (CMS)
            </button>
          </div>

          {/* Active View Container */}
          <div className="lg:col-span-3 bg-zinc-900 border border-zinc-850 rounded-xl p-6 sm:p-8 min-h-[500px]">
            
            {/* TAB 1: EXECUTIVE STATS */}
            {adminTab === 'dash' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-wider text-white">Executive Metrics Summary</h3>
                  <p className="text-zinc-500 text-xs mt-1">Real-time aggregate totals synced securely from active collections.</p>
                </div>

                {/* Aggregate Widgets */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-mono">Gross Revenue</span>
                    <span className="text-2xl font-black text-red-600 mt-1 block">₹{totalRevenue}</span>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-mono">Total Members</span>
                    <span className="text-2xl font-black text-white mt-1 block">{members.length}</span>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-mono">Active Plans</span>
                    <span className="text-2xl font-black text-green-500 mt-1 block">{activeMembersCount}</span>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-mono">Pending Forms</span>
                    <span className="text-2xl font-black text-yellow-500 mt-1 block">{pendingRequestsCount}</span>
                  </div>
                </div>

                {/* Custom Analytical Visualizations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  {/* Revenue Distribution Chart */}
                  <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-lg space-y-4">
                    <span className="text-xs uppercase font-mono text-zinc-400 block">Gross Revenue Breakdown</span>
                    <div className="h-44 flex items-end justify-between gap-2 pt-6 border-b border-zinc-800 pb-2 px-4">
                      {/* Simple Bar Chart styled with HTML/CSS */}
                      <div className="flex flex-col items-center flex-1">
                        <div className="bg-red-600 w-full rounded-t-sm" style={{ height: '30%' }} />
                        <span className="text-[8px] font-mono mt-1 text-zinc-500">Basic</span>
                      </div>
                      <div className="flex flex-col items-center flex-1">
                        <div className="bg-red-500 w-full rounded-t-sm" style={{ height: '65%' }} />
                        <span className="text-[8px] font-mono mt-1 text-zinc-500">Premium</span>
                      </div>
                      <div className="flex flex-col items-center flex-1">
                        <div className="bg-red-700 w-full rounded-t-sm" style={{ height: '90%' }} />
                        <span className="text-[8px] font-mono mt-1 text-zinc-500">Elite</span>
                      </div>
                    </div>
                  </div>

                  {/* Attendance & Bookings Trend */}
                  <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-lg space-y-4">
                    <span className="text-xs uppercase font-mono text-zinc-400 block">Class Bookings Capacity Log</span>
                    <div className="space-y-3">
                      {classes.map((c) => (
                        <div key={c.id} className="text-xs space-y-1">
                          <div className="flex justify-between font-mono text-[10px] text-zinc-500">
                            <span>{c.name} ({c.day})</span>
                            <span>{c.bookedCount} / {c.capacity}</span>
                          </div>
                          <div className="h-1.5 bg-zinc-800 rounded-full w-full overflow-hidden">
                            <div className="h-full bg-red-600 rounded-full" style={{ width: `${(c.bookedCount / c.capacity) * 100}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: MEMBERSHIP REQUEST FLOW */}
            {adminTab === 'requests' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-wider text-white">Pending Requests</h3>
                  <p className="text-zinc-500 text-xs mt-1">Approve or reject submitted memberships with real-time verification and custom notes.</p>
                </div>

                {membershipRequests.filter(r => r.status === 'pending').length === 0 ? (
                  <p className="text-xs text-zinc-500 py-10 text-center">No pending membership requests awaiting review.</p>
                ) : (
                  <div className="space-y-4">
                    {membershipRequests.filter(r => r.status === 'pending').map((req) => (
                      <div key={req.id} className="bg-zinc-950 border border-zinc-800 p-5 rounded-lg space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-zinc-850 pb-3">
                          <div>
                            <span className="text-xs font-bold text-white uppercase tracking-wider">{req.userName}</span>
                            <span className="text-[10px] text-zinc-500 block font-mono">{req.userEmail}</span>
                          </div>
                          <div className="text-right sm:text-right">
                            <span className="bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-[9px] px-2 py-0.5 rounded">
                              {req.createdAt}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs leading-relaxed text-zinc-400">
                          <div>
                            <p>Requested plan: <strong className="text-white uppercase">{req.planName}</strong></p>
                            <p>Total amount: <strong className="text-red-500">₹{req.price}</strong></p>
                            <p>Duration: <strong>{req.duration}</strong></p>
                          </div>
                          <div>
                            <p>Payment Gateway: <strong className="text-white">{req.paymentMethod}</strong></p>
                            <p>Transaction ID / Ref: <strong className="text-white font-mono break-all">{req.paymentProof || 'N/A'}</strong></p>
                          </div>
                        </div>

                        {/* Registration form details */}
                        {(req.phone || req.gender || req.age || req.emergencyContact || req.fitnessGoals || req.medicalConditions) && (
                          <div className="bg-zinc-900/60 border border-zinc-850 p-3 rounded-md space-y-2 text-xs">
                            <h4 className="font-extrabold uppercase tracking-wider text-red-500 text-[10px]">Gym Registration Form Details</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-300">
                              {req.phone && <p>📞 Mobile: <strong>{req.phone}</strong></p>}
                              {req.gender && <p>👤 Gender: <strong>{req.gender}</strong></p>}
                              {req.age && <p>📅 Age: <strong>{req.age}</strong></p>}
                              {req.emergencyContact && <p>🚨 Emergency Contact: <strong>{req.emergencyContact}</strong></p>}
                              {req.fitnessGoals && <p>🎯 Fitness Goal: <strong>{req.fitnessGoals}</strong></p>}
                              {req.medicalConditions && <p>⚠️ Medical / Injuries: <strong>{req.medicalConditions}</strong></p>}
                            </div>
                          </div>
                        )}

                        <div className="space-y-2 border-t border-zinc-850 pt-4">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Add Admin Notes / Verification Remarks</label>
                          <input
                            type="text"
                            placeholder="e.g. UPI verified successfully"
                            value={requestNotes}
                            onChange={(e) => setRequestNotes(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 rounded text-xs outline-none focus:border-red-600"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => { onApproveRequest(req.id, requestNotes); setRequestNotes(''); }}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 rounded uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <CheckCircle className="h-4 w-4" /> Approve & Activate
                          </button>
                          <button
                            onClick={() => { onRejectRequest(req.id, requestNotes); setRequestNotes(''); }}
                            className="flex-1 bg-zinc-800 hover:bg-red-600 text-zinc-300 hover:text-white text-xs font-bold py-2 rounded uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <XCircle className="h-4 w-4" /> Reject Request
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: MEMBER MANAGEMENT */}
            {adminTab === 'members' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-wider text-white">Gym Members Database</h3>
                    <p className="text-zinc-500 text-xs mt-1">Search, audit profiles, and inspect subscription statuses in the directory.</p>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Search name or email..."
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white pl-9 pr-4 py-2 rounded text-xs outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-zinc-900 text-zinc-400 font-mono border-b border-zinc-800">
                        <th className="p-3">Member Details</th>
                        <th className="p-3">Plan Class</th>
                        <th className="p-3">Sub Status</th>
                        <th className="p-3">Date Registered</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850">
                      {members
                        .filter(m => (m.name || m.email).toLowerCase().includes(memberSearch.toLowerCase()))
                        .map((m) => (
                          <tr key={m.uid} className="hover:bg-zinc-900">
                            <td className="p-3">
                              <span className="block font-bold text-white uppercase">{m.name || 'Anonymous Athlete'}</span>
                              <span className="block text-[10px] text-zinc-500 font-mono mb-1">{m.email}</span>
                              {(m.phone || m.gender || m.age || m.emergencyContact || m.fitnessGoals || m.medicalConditions) && (
                                <div className="text-[10px] text-zinc-400 space-y-0.5 mt-1 border-t border-zinc-850 pt-1">
                                  {m.phone && <p>📞 Phone: <span className="text-zinc-300 font-mono">{m.phone}</span></p>}
                                  {(m.gender || m.age) && <p>👤 {m.gender || 'N/A'}{m.age ? `, ${m.age} yrs` : ''}</p>}
                                  {m.emergencyContact && <p>🚨 Emergency: <span className="text-zinc-300">{m.emergencyContact}</span></p>}
                                  {m.fitnessGoals && <p>🎯 Goal: <span className="text-zinc-300">{m.fitnessGoals}</span></p>}
                                  {m.medicalConditions && <p>⚠️ Medical: <span className="text-zinc-300">{m.medicalConditions}</span></p>}
                                </div>
                              )}
                            </td>
                            <td className="p-3 font-bold uppercase text-zinc-400">{m.activePlanName || 'No Active Plan'}</td>
                            <td className="p-3">
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${m.membershipStatus === 'active' ? 'bg-green-950/20 text-green-500 border-green-900' : m.membershipStatus === 'pending' ? 'bg-yellow-950/20 text-yellow-500 border-yellow-900' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>
                                {m.membershipStatus || 'none'}
                              </span>
                            </td>
                            <td className="p-3 font-mono text-zinc-500">{m.joinedAt || '2026-06-26'}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: MEMBERSHIP PLANS MANAGEMENT */}
            {adminTab === 'plans' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-wider text-white">Membership Plan Inventory</h3>
                    <p className="text-zinc-500 text-xs mt-1">Edit, duplicate, delete, or activate tier membership prices.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Create Plan Form */}
                  <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-lg">
                    <span className="text-xs uppercase font-mono text-zinc-400 block mb-3">Add Custom Membership Plan</span>
                    <form onSubmit={handleCreatePlanForm} className="space-y-4 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Plan Name</label>
                        <input
                          type="text"
                          value={newPlan.name}
                          onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                          placeholder="e.g. Gold Quarterly"
                          className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 rounded outline-none"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Price (INR)</label>
                          <input
                            type="number"
                            value={newPlan.price}
                            onChange={(e) => setNewPlan({ ...newPlan, price: parseInt(e.target.value) })}
                            className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 rounded outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Duration</label>
                          <input
                            type="text"
                            value={newPlan.duration}
                            onChange={(e) => setNewPlan({ ...newPlan, duration: e.target.value })}
                            placeholder="e.g. 3 Months"
                            className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 rounded outline-none"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Plan Features (Comma separated)</label>
                        <input
                          type="text"
                          placeholder="Unlimited access, Free locker, 1 PT session"
                          value={featureInput}
                          onChange={(e) => {
                            setFeatureInput(e.target.value);
                            setNewPlan({ ...newPlan, features: e.target.value.split(',').map(f => f.trim()) });
                          }}
                          className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 rounded outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isPopular"
                          checked={newPlan.isPopular}
                          onChange={(e) => setNewPlan({ ...newPlan, isPopular: e.target.checked })}
                          className="bg-zinc-900 border-zinc-800"
                        />
                        <label htmlFor="isPopular" className="text-[10px] text-zinc-400 font-bold uppercase">Mark as Popular Plan</label>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded uppercase tracking-wider cursor-pointer"
                      >
                        Create Membership Tier
                      </button>
                    </form>
                  </div>

                  {/* Plans inventory list */}
                  <div className="space-y-2">
                    <span className="text-xs uppercase font-mono text-zinc-400 block mb-3">Plan Database Catalog</span>
                    {plans.map((p) => (
                      <div key={p.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex justify-between items-center text-xs">
                        <div>
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider">{p.name}</h4>
                          <span className="font-mono text-red-500 block">₹{p.price} / {p.duration}</span>
                          <span className="text-[9px] text-zinc-500 mt-1 block">Features: {p.features.length} features listed</span>
                        </div>
                        <button
                          onClick={() => onDeletePlan(p.id)}
                          className="p-2 bg-red-950/20 text-red-500 hover:bg-red-600 hover:text-white rounded transition-colors cursor-pointer border border-red-900/50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: CLASS SCHEDULE */}
            {adminTab === 'classes' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-wider text-white">Class Timetable Scheduler</h3>
                  <p className="text-zinc-500 text-xs mt-1">Schedule group sessions, configure maximum capacities, and assign elite trainers.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Create Class Form */}
                  <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-lg">
                    <span className="text-xs uppercase font-mono text-zinc-400 block mb-3">Add Group Class Slot</span>
                    <form onSubmit={handleCreateClassForm} className="space-y-4 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Class Title</label>
                        <input
                          type="text"
                          value={newClass.name}
                          onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                          placeholder="e.g. Crossfit WOD"
                          className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 rounded outline-none"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Day</label>
                          <select
                            value={newClass.day}
                            onChange={(e) => setNewClass({ ...newClass, day: e.target.value })}
                            className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs px-3 py-2 rounded outline-none"
                          >
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Saturday">Saturday</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Time</label>
                          <input
                            type="text"
                            value={newClass.time}
                            onChange={(e) => setNewClass({ ...newClass, time: e.target.value })}
                            placeholder="e.g. 06:00 AM"
                            className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 rounded outline-none"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Maximum Seat Capacity</label>
                        <input
                          type="number"
                          value={newClass.capacity}
                          onChange={(e) => setNewClass({ ...newClass, capacity: parseInt(e.target.value) })}
                          className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 rounded outline-none"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded uppercase tracking-wider cursor-pointer"
                      >
                        Publish Class Schedule
                      </button>
                    </form>
                  </div>

                  {/* Scheduled Classes inventory list */}
                  <div className="space-y-2">
                    <span className="text-xs uppercase font-mono text-zinc-400 block mb-3">Live Schedules</span>
                    {classes.map((cls) => (
                      <div key={cls.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg text-xs space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">{cls.name}</h4>
                            <span className="font-mono text-red-500 block">{cls.day} @ {cls.time}</span>
                            <span className="text-[10px] text-zinc-500 block">Cap: {cls.bookedCount} / {cls.capacity} spots booked</span>
                          </div>
                          <button
                            onClick={() => onDeleteClass(cls.id)}
                            className="p-2 bg-red-950/20 text-red-500 hover:bg-red-600 hover:text-white rounded transition-colors border border-red-900/50 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* List Booked Athletes for this class slot */}
                        {(() => {
                          const classBookings = bookings.filter(b => b.classId === cls.id && b.status === 'booked');
                          if (classBookings.length === 0) return null;
                          return (
                            <div className="border-t border-zinc-900 pt-3 space-y-2">
                              <span className="text-[10px] uppercase font-bold text-red-500 tracking-wider block">Booked Athletes ({classBookings.length}):</span>
                              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                                {classBookings.map((b) => (
                                  <div key={b.id} className="bg-zinc-900 border border-zinc-850 p-2.5 rounded text-[11px] text-zinc-300">
                                    <div className="flex justify-between items-center font-bold">
                                      <span>{b.userName}</span>
                                      {b.experienceLevel && (
                                        <span className="text-[8px] uppercase bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-black tracking-wider">
                                          {b.experienceLevel}
                                        </span>
                                      )}
                                    </div>
                                    {b.phone && <div className="text-[9px] text-zinc-500 mt-0.5">📞 {b.phone}</div>}
                                    {b.notes && <div className="text-[9px] text-zinc-400 mt-1 italic bg-zinc-950 p-1.5 rounded border border-zinc-900">📝 {b.notes}</div>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: GYM TRAINERS */}
            {adminTab === 'trainers' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-wider text-white">Elite Coaching roster</h3>
                  <p className="text-zinc-500 text-xs mt-1">Configure specialist profiles, write bios, and upload high-resolution media references.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Create Trainer Form */}
                  <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-lg">
                    <span className="text-xs uppercase font-mono text-zinc-400 block mb-3">Add New Coach</span>
                    <form onSubmit={handleCreateTrainerForm} className="space-y-4 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Trainer Full Name</label>
                        <input
                          type="text"
                          value={newTrainer.name}
                          onChange={(e) => setNewTrainer({ ...newTrainer, name: e.target.value })}
                          placeholder="e.g. Coach Marcus"
                          className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 rounded outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Coaching Specialty</label>
                        <input
                          type="text"
                          value={newTrainer.specialty}
                          onChange={(e) => setNewTrainer({ ...newTrainer, specialty: e.target.value })}
                          placeholder="e.g. Strength / Powerlifting"
                          className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 rounded outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Trainer Bio</label>
                        <textarea
                          rows={2}
                          value={newTrainer.bio}
                          onChange={(e) => setNewTrainer({ ...newTrainer, bio: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 rounded outline-none"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded uppercase tracking-wider cursor-pointer"
                      >
                        Enroll Trainer
                      </button>
                    </form>
                  </div>

                  {/* Roster list */}
                  <div className="space-y-2">
                    <span className="text-xs uppercase font-mono text-zinc-400 block mb-3">Roster Database</span>
                    {trainers.map((t) => (
                      <div key={t.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex justify-between items-center text-xs">
                        <div>
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider">{t.name}</h4>
                          <span className="font-mono text-red-500 block">{t.specialty}</span>
                        </div>
                        <button
                          onClick={() => onDeleteTrainer(t.id)}
                          className="p-2 bg-red-950/20 text-red-500 hover:bg-red-600 hover:text-white rounded transition-colors border border-red-900/50 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: ANNOUNCEMENTS MANAGEMENT */}
            {adminTab === 'notices' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-wider text-white">Issue Gym Announcements</h3>
                  <p className="text-zinc-500 text-xs mt-1">Publish notices that synchronize instantly and display on client dashboards.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Create Notice Form */}
                  <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-lg">
                    <span className="text-xs uppercase font-mono text-zinc-400 block mb-3">Compose New Notice</span>
                    <form onSubmit={handleCreateAnnouncementForm} className="space-y-4 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Announcement Title</label>
                        <input
                          type="text"
                          value={noticeTitle}
                          onChange={(e) => setNoticeTitle(e.target.value)}
                          placeholder="e.g. Steam & Sauna Maintenance closure"
                          className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 rounded outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Body Content</label>
                        <textarea
                          rows={4}
                          value={noticeContent}
                          onChange={(e) => setNoticeContent(e.target.value)}
                          placeholder="Write technical or logistical announcement message here..."
                          className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 rounded outline-none resize-none"
                          required
                        ></textarea>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="noticePinned"
                          checked={noticePinned}
                          onChange={(e) => setNoticePinned(e.target.checked)}
                          className="bg-zinc-900 border-zinc-850"
                        />
                        <label htmlFor="noticePinned" className="text-[10px] text-zinc-400 font-bold uppercase">Pin Announcement to User Dashboard</label>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 rounded uppercase tracking-wider cursor-pointer"
                      >
                        Publish Notice
                      </button>
                    </form>
                  </div>

                  {/* Announcements list */}
                  <div className="space-y-2">
                    <span className="text-xs uppercase font-mono text-zinc-400 block mb-3">Published Announcements</span>
                    {announcements.map((ann) => (
                      <div key={ann.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex justify-between items-center text-xs">
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">{ann.title}</h4>
                          <span className="font-mono text-zinc-500 text-[10px] block">{ann.createdAt}</span>
                        </div>
                        <button
                          onClick={() => onDeleteAnnouncement(ann.id)}
                          className="p-2 bg-red-950/20 text-red-500 hover:bg-red-600 hover:text-white border border-red-900/50 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 8: SUPPORT TICKET CHAT */}
            {adminTab === 'support' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-wider text-white">Administrative Helpdesk Tickets</h3>
                  <p className="text-zinc-500 text-xs mt-1">Chat in real-time with users, resolve facility issues, and close ticket logs.</p>
                </div>

                {activeTicket ? (
                  /* Live Reply Window */
                  <div className="space-y-4">
                    <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">Ticket Reference</span>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mt-1">{activeTicket.subject}</h4>
                        <p className="text-zinc-400 text-xs mt-2 leading-relaxed">{activeTicket.message}</p>
                      </div>
                      <button
                        onClick={() => setActiveTicket(null)}
                        className="bg-zinc-800 hover:bg-zinc-750 text-white text-[10px] font-bold uppercase py-1 px-2.5 rounded"
                      >
                        Back
                      </button>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto border-t border-b border-zinc-800 py-4 font-sans text-xs">
                      {(!activeTicket.replies || activeTicket.replies.length === 0) ? (
                        <p className="text-xs text-zinc-600 italic">No conversation thread logged yet.</p>
                      ) : (
                        activeTicket.replies.map((rep, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg leading-relaxed max-w-[80%] ${rep.sender === 'admin' ? 'bg-red-950/15 border border-red-900/50 text-white ml-auto' : 'bg-zinc-950 border border-zinc-800 text-zinc-300'}`}
                          >
                            <span className="font-bold block uppercase text-[8px] text-zinc-500 mb-1">{rep.senderName} ({rep.sender})</span>
                            <p>{rep.message}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <form onSubmit={handleReplyTicketForm} className="flex gap-2">
                      <input
                        type="text"
                        value={ticketReply}
                        onChange={(e) => setTicketReply(e.target.value)}
                        placeholder="Type reply message to user..."
                        className="flex-1 bg-zinc-950 border border-zinc-800 text-xs px-3 py-2.5 text-white rounded outline-none"
                        required
                      />
                      <button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white px-5 rounded text-xs font-bold uppercase cursor-pointer"
                      >
                        Send Reply
                      </button>
                    </form>
                  </div>
                ) : (
                  /* Support ticket database listing */
                  <div className="space-y-3">
                    {tickets.length === 0 ? (
                      <p className="text-xs text-zinc-500 py-10 text-center">No active support tickets logged.</p>
                    ) : (
                      tickets.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => setActiveTicket(t)}
                          className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex items-center justify-between hover:border-zinc-700 cursor-pointer text-xs"
                        >
                          <div>
                            <span className="font-black text-white uppercase block">{t.subject}</span>
                            <span className="text-[10px] text-zinc-500 block">Member: {t.userName} ({t.createdAt})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${t.priority === 'high' ? 'bg-red-950/30 text-red-500' : 'bg-zinc-800 text-zinc-400'}`}>
                              {t.priority}
                            </span>
                            <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${t.status === 'open' ? 'bg-yellow-950/30 text-yellow-500' : 'bg-zinc-800 text-zinc-400'}`}>
                              {t.status}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 9: CONTACT RESPONSES */}
            {adminTab === 'contacts' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-wider text-white">Contact Form Inquiries</h3>
                  <p className="text-zinc-500 text-xs mt-1">View messages received from landing page contact forms instantly.</p>
                </div>

                {contacts.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-10 text-center">No contact inquiries logged.</p>
                ) : (
                  <div className="space-y-4">
                    {contacts.map((c) => (
                      <div key={c.id} className="bg-zinc-950 border border-zinc-800 p-5 rounded-lg space-y-3 text-xs leading-relaxed">
                        <div className="flex justify-between items-center border-b border-zinc-855 pb-2">
                          <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">{c.name}</h4>
                            <span className="text-[10px] text-zinc-500 font-mono">{c.email} | {c.phone || 'No Phone'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${c.status === 'unread' ? 'bg-red-950/20 text-red-500' : 'bg-zinc-850 text-zinc-400'}`}>
                              {c.status}
                            </span>
                            <button
                              onClick={() => onDeleteContact(c.id)}
                              className="text-red-500 hover:text-red-400 text-[10px] uppercase font-bold"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        <p className="text-zinc-400 italic">"{c.message}"</p>

                        {c.status === 'unread' && (
                          <button
                            onClick={() => onMarkContactRead(c.id)}
                            className="bg-zinc-850 hover:bg-zinc-800 text-white font-bold py-1 px-3 rounded uppercase text-[10px]"
                          >
                            Mark as Read
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 10: CMS WEBSITE Content Editor */}
            {adminTab === 'cms' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-wider text-white">Website content CMS</h3>
                  <p className="text-zinc-500 text-xs mt-1">Instantly edit website text, headings, and details without changing a single line of code.</p>
                </div>

                <form onSubmit={handleSaveCMS} className="space-y-4 bg-zinc-950 p-6 rounded-lg border border-zinc-850 text-xs">
                  {cmsSaved && (
                    <div className="bg-green-950/20 border border-green-900 text-green-500 p-3 rounded font-bold uppercase">
                      CMS data saved in Firestore and dynamically synchronized!
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Homepage Hero Heading Text</label>
                    <input
                      type="text"
                      value={cmsHero}
                      onChange={(e) => setCmsHero(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-600 text-white px-3 py-2 rounded outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">About Section Sub-Heading</label>
                    <input
                      type="text"
                      value={cmsAbout}
                      onChange={(e) => setCmsAbout(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-600 text-white px-3 py-2 rounded outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Gym Corporate Location Address</label>
                    <input
                      type="text"
                      value={cmsAddress}
                      onChange={(e) => setCmsAddress(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-600 text-white px-3 py-2 rounded outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="h-4 w-4" /> Save CMS configurations
                  </button>
                </form>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
