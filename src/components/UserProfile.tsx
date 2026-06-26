import React, { useState } from 'react';
import { UserProfile as ProfileType, Booking, SupportTicket, Announcement, MembershipRequest } from '../types';
import { User, QrCode, Calendar, ShieldAlert, MessageSquare, Download, Clock, Send, Bell, Settings } from 'lucide-react';

interface UserProfileProps {
  profile: ProfileType;
  bookings: Booking[];
  supportTickets: SupportTicket[];
  announcements: Announcement[];
  payments: MembershipRequest[];
  onUpdateProfile: (name: string, phone: string, photoURL: string) => void;
  onSubmitTicket: (subject: string, message: string, priority: 'low' | 'medium' | 'high') => void;
  onSubmitTicketReply: (ticketId: string, replyMessage: string) => void;
  onCancelBooking: (bookingId: string) => void;
}

export default function UserProfile({
  profile,
  bookings,
  supportTickets,
  announcements,
  payments,
  onUpdateProfile,
  onSubmitTicket,
  onSubmitTicketReply,
  onCancelBooking,
}: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<'id' | 'bookings' | 'support' | 'announcements' | 'settings'>('id');

  // Profile Edit fields
  const [name, setName] = useState(profile.name || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [photoURL, setPhotoURL] = useState(profile.photoURL || '');
  const [isSaved, setIsSaved] = useState(false);

  // New Support Ticket fields
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketPriority, setTicketPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  // Invoice Receipt Modal
  const [activeInvoice, setActiveInvoice] = useState<MembershipRequest | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(name, phone, photoURL);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    onSubmitTicket(ticketSubject, ticketMessage, ticketPriority);
    setTicketSubject('');
    setTicketMessage('');
  };

  const handleReplyTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage || !activeTicket) return;
    onSubmitTicketReply(activeTicket.id, replyMessage);
    setReplyMessage('');
    // Update local modal state
    const updatedReplies = [...(activeTicket.replies || []), {
      sender: 'user' as const,
      senderName: profile.name || profile.email,
      message: replyMessage,
      createdAt: new Date().toLocaleDateString()
    }];
    setActiveTicket({ ...activeTicket, replies: updatedReplies });
  };

  // Helper to trigger receipt printing
  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="bg-zinc-950 min-h-screen text-white py-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Welcome */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-red-600/10 via-transparent to-transparent pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="h-16 w-16 bg-red-600 text-white rounded-full flex items-center justify-center font-black text-2xl overflow-hidden border-2 border-red-500">
              {profile.photoURL ? (
                <img src={profile.photoURL} alt={profile.name || 'User'} className="h-full w-full object-cover referrerpolicy=no-referrer" />
              ) : (
                (profile.name || profile.email)[0].toUpperCase()
              )}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider">{profile.name || 'Athlete Name'}</h2>
              <span className="text-xs text-zinc-500">{profile.email}</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-zinc-800 text-zinc-400 text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-zinc-750">
                  ID: {profile.uid.substring(0, 8)}...
                </span>
                {profile.membershipStatus === 'active' ? (
                  <span className="bg-green-950/40 text-green-500 text-[10px] uppercase font-black px-2 py-0.5 rounded tracking-widest border border-green-900">
                    Active
                  </span>
                ) : profile.membershipStatus === 'pending' ? (
                  <span className="bg-yellow-950/40 text-yellow-500 text-[10px] uppercase font-black px-2 py-0.5 rounded tracking-widest border border-yellow-900">
                    Pending
                  </span>
                ) : (
                  <span className="bg-zinc-800 text-zinc-500 text-[10px] uppercase font-black px-2 py-0.5 rounded tracking-widest border border-zinc-700">
                    No Membership
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 relative z-10">
            {profile.membershipStatus === 'active' && (
              <div className="text-right text-xs sm:text-sm bg-zinc-950/50 px-4 py-3 border border-zinc-800 rounded-lg">
                <span className="text-zinc-500 block text-[10px] uppercase tracking-wider font-mono">Current Plan</span>
                <span className="text-white font-bold uppercase tracking-wide">{profile.activePlanName}</span>
                <span className="block text-[10px] text-zinc-600 mt-1">Expires: {profile.membershipExpiryDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Side Menu Toggles */}
          <div className="lg:col-span-1 bg-zinc-900 border border-zinc-850 rounded-xl overflow-hidden">
            <nav className="p-2 space-y-1">
              <button
                onClick={() => setActiveTab('id')}
                className={`w-full text-left py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-3 ${activeTab === 'id' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:bg-zinc-850 hover:text-white'}`}
              >
                <QrCode className="h-4 w-4 shrink-0" /> Digital ID Card
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`w-full text-left py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-3 ${activeTab === 'bookings' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:bg-zinc-850 hover:text-white'}`}
              >
                <Calendar className="h-4 w-4 shrink-0" /> Bookings & Attendance
              </button>
              <button
                onClick={() => setActiveTab('support')}
                className={`w-full text-left py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-3 ${activeTab === 'support' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:bg-zinc-850 hover:text-white'}`}
              >
                <MessageSquare className="h-4 w-4 shrink-0" /> Support Tickets
              </button>
              <button
                onClick={() => setActiveTab('announcements')}
                className={`w-full text-left py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-3 ${activeTab === 'announcements' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:bg-zinc-850 hover:text-white'}`}
              >
                <Bell className="h-4 w-4 shrink-0" /> Gym Notices
                {announcements.length > 0 && (
                  <span className="ml-auto bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0">
                    {announcements.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full text-left py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-3 ${activeTab === 'settings' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:bg-zinc-850 hover:text-white'}`}
              >
                <Settings className="h-4 w-4 shrink-0" /> Account Settings
              </button>
            </nav>
          </div>

          {/* Active Panel View */}
          <div className="lg:col-span-3 bg-zinc-900 border border-zinc-850 rounded-xl p-6 sm:p-8 min-h-[400px]">
            {/* 1. Digital ID Card Tab */}
            {activeTab === 'id' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-wider text-white">Your Digital Membership ID</h3>
                  <p className="text-zinc-500 text-xs mt-1">Scan this QR Code at the reception terminal for immediate biometric check-in logging.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {/* Digital Card UI */}
                  <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 relative overflow-hidden shadow-2xl flex flex-col justify-between h-72">
                    {/* Design accents */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-full blur-2xl" />
                    <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-red-600/5 rounded-full blur-2xl" />

                    <div className="flex justify-between items-center z-10 border-b border-zinc-850 pb-4">
                      <span className="text-sm font-black tracking-widest text-red-500">MS ATHLETICS</span>
                      <span className="text-[9px] font-mono text-zinc-500">MEMBER SINCE {profile.joinedAt || '2026'}</span>
                    </div>

                    <div className="my-6 z-10 flex items-center gap-4">
                      <div className="h-16 w-16 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-850 overflow-hidden shrink-0">
                        {profile.photoURL ? (
                          <img src={profile.photoURL} alt={profile.name} className="h-full w-full object-cover referrerpolicy=no-referrer" />
                        ) : (
                          <User className="h-6 w-6 text-zinc-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white uppercase tracking-wider leading-none mb-1">{profile.name || 'ATHLETE NAME'}</h4>
                        <span className="text-[10px] text-zinc-500 block font-mono">{profile.email}</span>
                        <span className="text-[10px] text-zinc-600 font-mono mt-1 block">RFID: {profile.uid.substring(0, 12)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-end border-t border-zinc-850 pt-4 z-10">
                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-zinc-500 block font-mono">Membership Tier</span>
                        <span className="text-white text-xs font-bold uppercase">{profile.activePlanName || 'NO ACTIVE PLAN'}</span>
                      </div>
                      <span className="bg-red-600 text-white font-mono font-black text-[9px] px-2.5 py-1 rounded tracking-widest uppercase">
                        {profile.membershipStatus || 'NONE'}
                      </span>
                    </div>
                  </div>

                  {/* Checkin QR */}
                  <div className="flex flex-col items-center justify-center p-6 bg-zinc-950 border border-zinc-800 rounded-xl text-center">
                    <span className="text-xs uppercase font-mono text-zinc-500 mb-4 block">Reception Scanner Code</span>
                    <div className="p-3 bg-white rounded-lg inline-block">
                      {/* Generates a nice QR code containing their user profile info */}
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(JSON.stringify({ uid: profile.uid, name: profile.name, email: profile.email }))}`} alt="RFID Checkin QR" className="h-32 w-32" />
                    </div>
                    <p className="text-[10px] text-zinc-600 mt-4 leading-relaxed max-w-[200px]">Keep this tab open as you approach the front gates of MS Fitness Delhi.</p>
                  </div>
                </div>

                {/* Receipts history list */}
                <div className="pt-6 border-t border-zinc-800">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4">Payment Receipts & Invoices</h4>
                  {payments.length === 0 ? (
                    <p className="text-xs text-zinc-500">No payment transaction history logged yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {payments.map((p) => (
                        <div key={p.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex items-center justify-between">
                          <div>
                            <span className="block text-xs font-bold text-white uppercase tracking-wider">{p.planName}</span>
                            <span className="text-[10px] text-zinc-500 block font-mono">Paid ₹{p.price} via {p.paymentMethod}</span>
                            <span className="text-[9px] text-zinc-600 mt-1 block">Status: <strong className="uppercase text-red-500">{p.status}</strong></span>
                          </div>
                          <button
                            onClick={() => setActiveInvoice(p)}
                            className="text-xs bg-zinc-850 hover:bg-zinc-800 text-red-500 font-bold py-1.5 px-3 rounded flex items-center gap-1.5 cursor-pointer border border-zinc-800"
                          >
                            <Download className="h-3 w-3" /> Receipt (PDF)
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. Bookings & Attendance Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-wider text-white">Your Class Reservations</h3>
                  <p className="text-zinc-500 text-xs mt-1">Manage scheduled slots or view your biometric gate attendance history.</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-800 pb-2">Active Class Bookings</h4>
                  {bookings.length === 0 ? (
                    <p className="text-xs text-zinc-500 py-4">No group classes booked yet. Go to <strong>Timetable</strong> to reserve a spot!</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {bookings.map((b) => (
                        <div key={b.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] bg-red-950/40 text-red-500 px-2 py-0.5 rounded border border-red-900 font-bold uppercase inline-block mb-2">
                              {b.date}
                            </span>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">{b.className}</h4>
                            <span className="text-xs text-zinc-500 block mt-1">Time: {b.time}</span>
                            <span className="text-xs text-zinc-500 block">Trainer: {b.trainerName || 'Coach'}</span>
                          </div>
                          {b.status === 'booked' ? (
                            <button
                              onClick={() => onCancelBooking(b.id)}
                              className="mt-4 text-[10px] bg-red-650 hover:bg-red-600 text-white font-bold py-1.5 rounded uppercase tracking-wider transition-colors block text-center"
                            >
                              Cancel Spot
                            </button>
                          ) : (
                            <span className="mt-4 text-[10px] text-zinc-600 font-bold block text-center uppercase py-1 border border-zinc-850 rounded">
                              Cancelled
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Attendance logs */}
                <div className="pt-6 border-t border-zinc-800">
                  <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">Biometric Gate Check-in Logs</h4>
                  {bookings.filter(b => b.status === 'booked').length === 0 ? (
                    <p className="text-xs text-zinc-500">No attendance records logged. Gate check-ins trigger when scanning your Digital RFID Card.</p>
                  ) : (
                    <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-zinc-900 text-zinc-400 font-mono border-b border-zinc-800">
                            <th className="p-3">Check-In Date</th>
                            <th className="p-3">Gate Terminal ID</th>
                            <th className="p-3">Access Log Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-850">
                          {bookings.filter(b => b.status === 'booked').map((b, i) => (
                            <tr key={i} className="hover:bg-zinc-900">
                              <td className="p-3 font-mono">{b.date} @ {b.time}</td>
                              <td className="p-3 text-zinc-500 font-mono">DELHI_MAIN_GATE_0{i+1}</td>
                              <td className="p-3 text-green-500 font-bold">APPROVED</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. Support Tickets Tab */}
            {activeTab === 'support' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-wider text-white">Administrative Support</h3>
                    <p className="text-zinc-500 text-xs mt-1">Submit technical queries, facility reports, or trainer upgrade requests.</p>
                  </div>
                  {activeTicket && (
                    <button
                      onClick={() => setActiveTicket(null)}
                      className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs py-1.5 px-3 rounded uppercase"
                    >
                      Back to list
                    </button>
                  )}
                </div>

                {activeTicket ? (
                  /* Detail Ticket View with Chat/Replies */
                  <div className="space-y-4">
                    <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-[10px] font-mono text-zinc-500">Subject Query</span>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${activeTicket.status === 'open' ? 'bg-red-950/20 text-red-500 border border-red-900' : 'bg-zinc-850 text-zinc-400 border border-zinc-700'}`}>
                          {activeTicket.status}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white uppercase tracking-wider mt-1">{activeTicket.subject}</h4>
                      <p className="text-zinc-400 text-xs mt-2 leading-relaxed">{activeTicket.message}</p>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto border-t border-b border-zinc-800 py-4">
                      <span className="text-[10px] uppercase font-mono text-zinc-500">Ticket Conversation Thread</span>
                      {(!activeTicket.replies || activeTicket.replies.length === 0) ? (
                        <p className="text-xs text-zinc-600">No responses from admin yet. Desk teams usually reply within 3 hours.</p>
                      ) : (
                        activeTicket.replies.map((rep, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg text-xs leading-relaxed max-w-[85%] ${rep.sender === 'user' ? 'bg-red-950/20 border border-red-900/50 text-white ml-auto' : 'bg-zinc-950 border border-zinc-800 text-zinc-300'}`}
                          >
                            <span className="font-bold block uppercase text-[9px] tracking-wider text-zinc-400 mb-1">{rep.senderName} ({rep.sender})</span>
                            <p>{rep.message}</p>
                          </div>
                        ))
                      )}
                    </div>

                    {activeTicket.status === 'open' && (
                      <form onSubmit={handleReplyTicket} className="flex gap-2">
                        <input
                          type="text"
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          placeholder="Type reply message to admin..."
                          className="flex-1 bg-zinc-950 border border-zinc-800 text-white text-xs px-3 py-2.5 rounded outline-none focus:border-red-600"
                          required
                        />
                        <button
                          type="submit"
                          className="bg-red-600 hover:bg-red-700 text-white px-4 rounded text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer"
                        >
                          <Send className="h-3.5 w-3.5" /> Send
                        </button>
                      </form>
                    )}
                  </div>
                ) : (
                  /* Create or View Tickets */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Submit Form */}
                    <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-lg">
                      <span className="text-xs uppercase font-mono text-zinc-500 block mb-3">Create New Ticket</span>
                      <form onSubmit={handleCreateTicket} className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Subject / Issue Title</label>
                          <input
                            type="text"
                            value={ticketSubject}
                            onChange={(e) => setTicketSubject(e.target.value)}
                            placeholder="e.g. Locker key request"
                            className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-600 text-white px-3 py-2.5 rounded outline-none text-xs transition-all"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Priority</label>
                          <select
                            value={ticketPriority}
                            onChange={(e: any) => setTicketPriority(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs px-3 py-2 rounded outline-none"
                          >
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Detailed Message</label>
                          <textarea
                            rows={3}
                            value={ticketMessage}
                            onChange={(e) => setTicketMessage(e.target.value)}
                            placeholder="Explain the technical or logistical issue..."
                            className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-600 text-white px-3 py-2 rounded outline-none text-xs resize-none transition-all"
                            required
                          ></textarea>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <MessageSquare className="h-3.5 w-3.5" /> Open Support Ticket
                        </button>
                      </form>
                    </div>

                    {/* Existing Tickets list */}
                    <div>
                      <span className="text-xs uppercase font-mono text-zinc-500 block mb-3">Your Support Tickets</span>
                      {supportTickets.length === 0 ? (
                        <p className="text-xs text-zinc-500">You do not have any open support tickets.</p>
                      ) : (
                        <div className="space-y-2">
                          {supportTickets.map((t) => (
                            <div
                              key={t.id}
                              onClick={() => setActiveTicket(t)}
                              className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg hover:border-red-600/30 transition-all cursor-pointer flex justify-between items-center"
                            >
                              <div>
                                <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t.subject}</h4>
                                <span className="text-[10px] text-zinc-500 font-mono">Date Filed: {t.createdAt}</span>
                              </div>
                              <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${t.status === 'open' ? 'bg-red-950/20 text-red-500 border border-red-900' : 'bg-zinc-800 text-zinc-400'}`}>
                                {t.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. Announcements Tab */}
            {activeTab === 'announcements' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-wider text-white">Important Gym Announcements</h3>
                  <p className="text-zinc-500 text-xs mt-1">Receive priority notices, equipment upgrade briefs, and holiday closures from administrative directors.</p>
                </div>

                {announcements.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-10 text-center">No notifications or announcements issued at this time.</p>
                ) : (
                  <div className="space-y-4">
                    {announcements.map((ann) => (
                      <div
                        key={ann.id}
                        className={`p-5 rounded-lg border ${ann.isPinned ? 'bg-red-950/10 border-red-600 relative' : 'bg-zinc-950 border-zinc-800'}`}
                      >
                        {ann.isPinned && (
                          <span className="absolute top-4 right-4 bg-red-600 text-white font-mono font-black text-[8px] px-2 py-0.5 rounded tracking-widest uppercase">
                            PINNED NOTICE
                          </span>
                        )}
                        <span className="text-[9px] font-mono text-zinc-500 block mb-1">{ann.createdAt}</span>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">{ann.title}</h4>
                        <p className="text-zinc-400 text-xs leading-relaxed whitespace-pre-wrap">{ann.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. Account Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-wider text-white">Profile Details</h3>
                  <p className="text-zinc-500 text-xs mt-1">Configure your personal name credentials, phone parameters, or secure avatar photo links.</p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg bg-zinc-950 p-6 rounded-lg border border-zinc-800">
                  {isSaved && (
                    <div className="bg-green-950/20 border border-green-900 text-green-500 text-xs p-3 rounded font-bold uppercase">
                      Profile details synchronized in Firestore!
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Full Identity Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Kumar"
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-600 text-white px-3 py-2 rounded outline-none text-xs transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-600 text-white px-3 py-2 rounded outline-none text-xs transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Profile Photo URL (Optional)</label>
                    <input
                      type="url"
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                      placeholder="e.g. https://images.unsplash.com/your-photo"
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-600 text-white px-3 py-2 rounded outline-none text-xs transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 px-6 rounded uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* PRINTABLE RECEIPT MODAL */}
        {activeInvoice && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div id="print-area" className="bg-white text-black max-w-md w-full rounded-xl p-8 relative shadow-2xl space-y-6">
              {/* Close on non-print */}
              <button
                onClick={() => setActiveInvoice(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-black font-bold uppercase text-xs no-print"
              >
                ✕ Close
              </button>

              <div className="text-center border-b border-zinc-200 pb-6">
                <span className="text-red-600 font-extrabold text-2xl tracking-widest block">MS FITNESS</span>
                <span className="text-[9px] font-mono text-zinc-500 uppercase block mt-1">102, Fitness Circle, Sector-4, Delhi Central, India</span>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mt-0.5">official tax invoice / payment receipt</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[8px] font-mono text-zinc-400 uppercase block">Invoice ID Code</span>
                  <span className="font-mono font-bold text-black">{activeInvoice.id}</span>
                </div>
                <div>
                  <span className="text-[8px] font-mono text-zinc-400 uppercase block">Date Processed</span>
                  <span className="font-mono font-bold text-black">{activeInvoice.createdAt}</span>
                </div>
                <div>
                  <span className="text-[8px] font-mono text-zinc-400 uppercase block">Member Name</span>
                  <span className="font-bold text-black uppercase">{activeInvoice.userName}</span>
                </div>
                <div>
                  <span className="text-[8px] font-mono text-zinc-400 uppercase block">Member Email</span>
                  <span className="text-zinc-600 font-mono">{activeInvoice.userEmail}</span>
                </div>
              </div>

              <div className="border-t border-b border-zinc-200 py-4 my-4">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 text-zinc-400 font-mono text-[9px] uppercase">
                      <th className="text-left pb-2">Plan Name</th>
                      <th className="text-right pb-2">Duration</th>
                      <th className="text-right pb-2">Net Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="pt-3 font-bold uppercase">{activeInvoice.planName}</td>
                      <td className="pt-3 text-right text-zinc-600">{activeInvoice.duration}</td>
                      <td className="pt-3 text-right font-bold text-black">₹{activeInvoice.price}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div>
                  <span className="text-[8px] text-zinc-400 font-mono uppercase block">Payment Gateway</span>
                  <span className="text-xs font-bold text-black uppercase">{activeInvoice.paymentMethod}</span>
                </div>
                <div className="text-right">
                  <span className="text-[8px] text-zinc-400 font-mono uppercase block">Grand Total Paid</span>
                  <span className="text-xl font-black text-black">₹{activeInvoice.price}.00</span>
                </div>
              </div>

              <div className="text-center pt-4 border-t border-zinc-100 text-[9px] text-zinc-400">
                <p>This document constitutes a valid system-generated transaction invoice for MS Fitness India.</p>
                <button
                  onClick={handlePrintInvoice}
                  className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded text-xs uppercase tracking-wider no-print cursor-pointer flex items-center justify-center gap-1"
                >
                  <Download className="h-4 w-4" /> Trigger Browser Print
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none;
            box-shadow: none;
            padding: 0;
            margin: 0;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
