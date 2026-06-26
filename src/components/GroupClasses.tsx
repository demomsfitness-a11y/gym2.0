import React, { useState } from 'react';
import { GroupClass, Booking } from '../types';
import { Calendar, Clock, User, CheckCircle, ShieldAlert, X, Phone, Award, AlignLeft } from 'lucide-react';

interface GroupClassesProps {
  classes: GroupClass[];
  bookings: Booking[];
  onBookClass: (
    groupClass: GroupClass,
    bookingData?: {
      phone?: string;
      notes?: string;
      experienceLevel?: string;
    }
  ) => Promise<void> | void;
  onCancelBooking: (bookingId: string) => void;
  user: any;
  userActivePlanName?: string;
  userMembershipStatus?: string;
  userProfile?: any;
}

export default function GroupClasses({
  classes,
  bookings,
  onBookClass,
  onCancelBooking,
  user,
  userActivePlanName,
  userMembershipStatus,
  userProfile,
}: GroupClassesProps) {
  const [selectedDay, setSelectedDay] = useState<string>('All');
  const DAYS = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'];

  // Booking Modal State
  const [bookingClass, setBookingClass] = useState<GroupClass | null>(null);
  const [phone, setPhone] = useState<string>('');
  const [experienceLevel, setExperienceLevel] = useState<string>('Beginner');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const filteredClasses = selectedDay === 'All'
    ? classes
    : classes.filter(c => c.day === selectedDay);

  const getBookingForClass = (classId: string) => {
    if (!user) return null;
    return bookings.find(b => b.classId === classId && b.userId === user.uid && b.status === 'booked');
  };

  const hasActivePlan = userActivePlanName && userMembershipStatus === 'active';

  const handleOpenBookingModal = (cls: GroupClass) => {
    setBookingClass(cls);
    setPhone(userProfile?.phone || '');
    setExperienceLevel('Beginner');
    setNotes('');
    setIsSuccess(false);
    setErrorMessage('');
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingClass) return;
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await onBookClass(bookingClass, {
        phone,
        notes,
        experienceLevel
      });
      setIsSuccess(true);
      setTimeout(() => {
        setBookingClass(null);
        setIsSuccess(false);
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to reserve spot. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="timetable" className="bg-zinc-950 py-20 border-b border-zinc-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-red-600 font-semibold tracking-wider uppercase text-xs">Class Timetable</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase mt-1">
            Weekly Group Classes
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-zinc-500 text-sm">
            Check our structured class timetable and reserve your spots. Align your training schedule with elite coaching formats.
          </p>
        </div>

        {/* Warning if no active membership */}
        {user && !hasActivePlan && (
          <div className="max-w-3xl mx-auto mb-8 bg-red-950/20 border border-red-900 rounded-lg p-4 flex items-center gap-3 text-red-400">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <p className="text-xs">
              <strong>Membership Required:</strong> You need an approved, active membership plan to book spots in group classes. Head over to <strong>Memberships</strong> to select a plan.
            </p>
          </div>
        )}

        {/* Day Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`py-2 px-4 rounded-md text-xs font-semibold tracking-wider uppercase transition-all ${selectedDay === day ? 'bg-red-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => {
            const booking = getBookingForClass(cls.id);
            const isBooked = !!booking;
            const isFull = cls.bookedCount >= cls.capacity;

            return (
              <div
                key={cls.id}
                className="bg-zinc-900 border border-zinc-850 rounded-xl p-6 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-md"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-red-950/40 text-red-500 font-black text-[10px] uppercase px-2.5 py-1 rounded tracking-wider border border-red-900">
                      {cls.day}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {cls.time}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">{cls.name}</h3>

                  <div className="space-y-2 text-sm text-zinc-500 mb-6">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-red-500" />
                      <span>Trainer: {cls.trainerName || 'Coach'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-red-500" />
                      <span>Capacity: {cls.bookedCount} / {cls.capacity} spots booked</span>
                    </div>
                  </div>
                </div>

                <div>
                  {isBooked ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-1 bg-green-950/20 text-green-500 py-2.5 rounded text-xs font-bold border border-green-900 uppercase">
                        <CheckCircle className="h-4 w-4" /> Booked Successfully
                      </div>
                      <button
                        onClick={() => onCancelBooking(booking.id)}
                        className="w-full bg-zinc-950 hover:bg-zinc-800 text-zinc-400 py-1.5 rounded text-[10px] font-bold uppercase transition-colors"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  ) : (
                    <button
                      disabled={!hasActivePlan || isFull}
                      onClick={() => handleOpenBookingModal(cls)}
                      className={`w-full py-2.5 rounded text-xs font-black tracking-widest uppercase transition-colors ${!hasActivePlan ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-850' : isFull ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white cursor-pointer'}`}
                    >
                      {isFull ? 'FULLY BOOKED' : 'RESERVE SPOT'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Form Modal */}
      {bookingClass && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-880 max-w-md w-full rounded-xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setBookingClass(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {isSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-950/40 border border-green-900 text-green-500">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">Spot Reserved!</h3>
                <p className="text-zinc-500 text-xs">Your spot in <strong>{bookingClass.name}</strong> has been successfully booked.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking} className="space-y-5">
                <div>
                  <span className="text-xs uppercase font-mono text-red-500 font-bold tracking-wider">Class Booking Form</span>
                  <h3 className="text-xl font-black text-white uppercase mt-0.5">{bookingClass.name}</h3>
                  <p className="text-zinc-500 text-xs">
                    {bookingClass.day} at {bookingClass.time} with Trainer: <strong>{bookingClass.trainerName || 'Coach'}</strong>
                  </p>
                </div>

                {errorMessage && (
                  <div className="bg-red-950/20 border border-red-900 text-red-400 p-3 rounded text-xs font-medium">
                    {errorMessage}
                  </div>
                )}

                <div className="space-y-4 pt-2 border-t border-zinc-850">
                  {/* Name (ReadOnly) */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Full Name</label>
                    <input
                      type="text"
                      disabled
                      value={userProfile?.name || user?.displayName || 'Athlete'}
                      className="w-full bg-zinc-950/60 border border-zinc-850 text-zinc-500 px-3 py-2 rounded-md outline-none text-xs cursor-not-allowed"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Contact Phone *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                        <Phone className="h-3.5 w-3.5" />
                      </span>
                      <input
                        type="tel"
                        required
                        disabled={isSubmitting}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-600 text-white pl-9 pr-3 py-2 rounded-md outline-none text-xs transition-all disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Your Fitness Level *</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                        <Award className="h-3.5 w-3.5" />
                      </span>
                      <select
                        required
                        disabled={isSubmitting}
                        value={experienceLevel}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-600 text-white pl-9 pr-3 py-2 rounded-md outline-none text-xs transition-all disabled:opacity-50 appearance-none"
                      >
                        <option value="Beginner">Beginner / First Time</option>
                        <option value="Intermediate">Intermediate (Regular Trainer)</option>
                        <option value="Advanced">Advanced / Elite Athlete</option>
                      </select>
                    </div>
                  </div>

                  {/* Special Notes / Health Conditions */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Special requests / Health concerns</label>
                    <div className="relative">
                      <span className="absolute top-2.5 left-0 pl-3 flex items-start pointer-events-none text-zinc-500">
                        <AlignLeft className="h-3.5 w-3.5" />
                      </span>
                      <textarea
                        disabled={isSubmitting}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Back pain, pregnancy, target stamina, or None"
                        rows={3}
                        className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-600 text-white pl-9 pr-3 py-2 rounded-md outline-none text-xs transition-all disabled:opacity-50 resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-850 flex gap-3">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setBookingClass(null)}
                    className="flex-1 bg-zinc-950 hover:bg-zinc-850 text-zinc-400 py-2.5 rounded text-xs font-black tracking-wider uppercase transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded text-xs font-black tracking-wider uppercase transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                  >
                    {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

