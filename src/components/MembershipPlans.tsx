import React, { useState } from 'react';
import { MembershipPlan, UserProfile } from '../types';
import { Check, Flame, CreditCard, ShieldCheck, User as UserIcon, Phone, Heart, Calendar, ShieldAlert } from 'lucide-react';
import { User } from 'firebase/auth';

interface MembershipPlansProps {
  plans: MembershipPlan[];
  user: User | null;
  onPurchaseRequest: (
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
  ) => Promise<void> | void;
  onLoginRequest: () => void;
  userActivePlanId?: string;
  userMembershipStatus?: string;
  userProfile?: UserProfile | null;
}

export default function MembershipPlans({
  plans,
  user,
  onPurchaseRequest,
  onLoginRequest,
  userActivePlanId,
  userMembershipStatus,
  userProfile,
}: MembershipPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Stripe' | 'Credit Card' | 'Cash'>('UPI');
  const [paymentProof, setPaymentProof] = useState<string>('');
  const [isSuccessMessage, setIsSuccessMessage] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Registration Form States
  const [regName, setRegName] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regGender, setRegGender] = useState<string>('Male');
  const [regAge, setRegAge] = useState<string>('');
  const [regEmergencyContact, setRegEmergencyContact] = useState<string>('');
  const [regFitnessGoals, setRegFitnessGoals] = useState<string>('General Fitness');
  const [regMedicalConditions, setRegMedicalConditions] = useState<string>('');

  const handleOpenPurchaseModal = (plan: MembershipPlan) => {
    if (!user) {
      onLoginRequest();
      return;
    }
    setSelectedPlan(plan);
    setIsSuccessMessage(false);
    setErrorMessage(null);
    setIsSubmitting(false);

    // Prepopulate from userProfile or auth
    setRegName(userProfile?.name || user.displayName || '');
    setRegPhone(userProfile?.phone || '');
    setRegGender(userProfile?.gender || 'Male');
    setRegAge(userProfile?.age || '');
    setRegEmergencyContact(userProfile?.emergencyContact || '');
    setRegFitnessGoals(userProfile?.fitnessGoals || 'General Fitness');
    setRegMedicalConditions(userProfile?.medicalConditions || '');
  };

  const handleConfirmPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await onPurchaseRequest(
        selectedPlan,
        paymentMethod,
        paymentProof || 'Online confirmation ref',
        {
          name: regName,
          phone: regPhone,
          gender: regGender,
          age: regAge,
          emergencyContact: regEmergencyContact,
          fitnessGoals: regFitnessGoals,
          medicalConditions: regMedicalConditions
        }
      );
      setIsSuccessMessage(true);
      setTimeout(() => {
        setSelectedPlan(null);
        setIsSuccessMessage(false);
        setPaymentProof('');
      }, 2000);
    } catch (err: any) {
      console.error('Error submitting purchase request:', err);
      let msg = 'Failed to submit membership request. Please try again.';
      if (err instanceof Error) {
        try {
          const parsed = JSON.parse(err.message);
          if (parsed && parsed.error) {
            msg = `Submission Error: ${parsed.error}`;
          } else {
            msg = err.message;
          }
        } catch {
          msg = err.message;
        }
      }
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activePlans = plans.filter(p => p.isEnabled);

  return (
    <section id="pricing" className="bg-zinc-950 py-20 border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-red-600 font-semibold tracking-wider uppercase text-xs">Membership Plans</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase mt-1">
            Choose Your Power Level
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-zinc-500 text-sm">
            Fully flexible contract structures with no hidden fees. Select your tier and start your transformation today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {activePlans.map((plan) => {
            const isUserActive = userActivePlanId === plan.id;
            const isPending = isUserActive && userMembershipStatus === 'pending';
            const isActive = isUserActive && userMembershipStatus === 'active';

            return (
              <div
                key={plan.id}
                className={`bg-zinc-900 border ${plan.isPopular ? 'border-red-600 relative ring-2 ring-red-600/30' : 'border-zinc-800'} rounded-xl p-8 flex flex-col justify-between h-full hover:shadow-2xl transition-all hover:scale-[1.02] duration-300`}
              >
                {plan.isPopular && (
                  <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-red-600 text-white font-black font-sans uppercase tracking-widest text-[10px] px-4 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Flame className="h-3 w-3" /> Popular Plan
                  </span>
                )}

                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-black text-white">₹{plan.price}</span>
                    <span className="text-zinc-500 ml-2 text-sm">/ {plan.duration}</span>
                  </div>

                  {plan.discount && (
                    <div className="bg-red-950/40 border border-red-900 text-red-500 text-xs px-3 py-1 rounded-md font-bold inline-block mb-4">
                      Save {plan.discount}% today!
                    </div>
                  )}

                  <ul className="space-y-3 mb-8 text-sm">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-zinc-400">
                        <Check className="h-4 w-4 text-red-500 mr-2.5 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto">
                  {isUserActive ? (
                    <div className="text-center">
                      <span className={`block w-full py-3.5 rounded-lg text-xs font-black tracking-widest uppercase border ${isActive ? 'bg-red-950/20 border-red-600 text-red-500' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}>
                        {userMembershipStatus === 'pending' && '📝 Pending Approval'}
                        {userMembershipStatus === 'active' && '💪 Active Membership'}
                        {userMembershipStatus === 'approved' && '✅ Approved (Ready)'}
                        {userMembershipStatus === 'expired' && '❌ Plan Expired'}
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenPurchaseModal(plan)}
                      className={`w-full py-3.5 rounded-lg text-xs font-black tracking-widest uppercase transition-all duration-200 cursor-pointer ${plan.isPopular ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'}`}
                    >
                      Select Plan
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Purchase Overlay Dialog */}
        {selectedPlan && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 max-w-xl w-full rounded-xl p-6 relative animate-scale-up max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedPlan(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white"
              >
                ✕
              </button>

              {isSuccessMessage ? (
                <div className="text-center py-8 space-y-4">
                  <div className="h-12 w-12 bg-red-600 text-white flex items-center justify-center rounded-full mx-auto animate-bounce">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white uppercase">Request Submitted!</h3>
                  <p className="text-zinc-500 text-sm">Your request has been filed under status: <strong>Pending</strong>. Admin has received immediate notification to review your payment details.</p>
                </div>
              ) : (
                <form onSubmit={handleConfirmPurchase} className="space-y-5">
                  <div>
                    <span className="text-xs uppercase font-mono text-red-500 font-bold tracking-wider">Step 1: Gym Registration Form</span>
                    <h3 className="text-xl font-black text-white uppercase mt-0.5">{selectedPlan.name}</h3>
                    <p className="text-zinc-500 text-xs">Plan Duration: <strong>{selectedPlan.duration}</strong> | Membership Price: <strong>₹{selectedPlan.price}</strong></p>
                  </div>

                  {errorMessage && (
                    <div className="bg-red-950/40 border border-red-900/50 rounded-lg p-3 text-red-400 text-xs font-semibold leading-relaxed">
                      {errorMessage}
                    </div>
                  )}

                  {/* personal info section */}
                  <div className="border-t border-zinc-800 pt-4 space-y-4">
                    <h4 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                      <UserIcon className="h-3.5 w-3.5 text-red-500" /> Applicant Information
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          disabled={isSubmitting}
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-600 text-white px-3 py-2 rounded-md outline-none text-xs transition-all disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Mobile / WhatsApp Number *</label>
                        <input
                          type="tel"
                          required
                          disabled={isSubmitting}
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-600 text-white px-3 py-2 rounded-md outline-none text-xs transition-all disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Age *</label>
                        <input
                          type="number"
                          required
                          min="10"
                          max="100"
                          disabled={isSubmitting}
                          value={regAge}
                          onChange={(e) => setRegAge(e.target.value)}
                          placeholder="e.g. 24"
                          className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-600 text-white px-3 py-2 rounded-md outline-none text-xs transition-all disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Gender *</label>
                        <select
                          required
                          disabled={isSubmitting}
                          value={regGender}
                          onChange={(e) => setRegGender(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-600 text-white px-3 py-2 rounded-md outline-none text-xs transition-all disabled:opacity-50"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* fitness & emergency section */}
                  <div className="border-t border-zinc-800 pt-4 space-y-4">
                    <h4 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                      <Heart className="h-3.5 w-3.5 text-red-500" /> Medical & Preference Details
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Emergency Contact Name & Phone *</label>
                        <input
                          type="text"
                          required
                          disabled={isSubmitting}
                          value={regEmergencyContact}
                          onChange={(e) => setRegEmergencyContact(e.target.value)}
                          placeholder="e.g. Father: 98765 00000"
                          className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-600 text-white px-3 py-2 rounded-md outline-none text-xs transition-all disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Primary Fitness Goal *</label>
                        <select
                          required
                          disabled={isSubmitting}
                          value={regFitnessGoals}
                          onChange={(e) => setRegFitnessGoals(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-600 text-white px-3 py-2 rounded-md outline-none text-xs transition-all disabled:opacity-50"
                        >
                          <option value="General Fitness">General Fitness</option>
                          <option value="Weight Loss">Weight Loss / Fat Burn</option>
                          <option value="Bodybuilding">Muscle Gain / Bodybuilding</option>
                          <option value="Strength & Conditioning">Strength & Conditioning</option>
                          <option value="Cardio & Stamina">Cardio & Stamina</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Medical Conditions / Injuries (If None, write 'None')</label>
                      <input
                        type="text"
                        disabled={isSubmitting}
                        value={regMedicalConditions}
                        onChange={(e) => setRegMedicalConditions(e.target.value)}
                        placeholder="e.g. Asthma, Knee pain, None"
                        className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-600 text-white px-3 py-2 rounded-md outline-none text-xs transition-all disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* payment section */}
                  <div className="border-t border-zinc-800 pt-4 space-y-4">
                    <span className="text-xs uppercase font-mono text-red-500 font-bold tracking-wider block">Step 2: Payment Details</span>
                    
                    <div className="space-y-3">
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Select Gateway</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['UPI', 'Stripe', 'Credit Card', 'Cash'].map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => setPaymentMethod(mode as any)}
                            className={`py-2 px-3 border rounded text-xs font-bold uppercase transition-all ${paymentMethod === mode ? 'bg-red-600/15 border-red-600 text-red-500' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-850'} disabled:opacity-50`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>

                    {paymentMethod === 'UPI' && (
                      <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg space-y-2 text-center">
                        <p className="text-xs text-zinc-400">Scan QR or Transfer directly to: <strong>msfitness@upi</strong></p>
                        <div className="w-32 h-32 bg-white rounded mx-auto flex items-center justify-center border border-zinc-200">
                          <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=upi://pay?pa=msfitness@upi" alt="UPI QR" className="h-28 w-28" />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                        {paymentMethod === 'Cash' ? 'Cash Handover Details' : 'Payment Reference Number / Transaction ID'}
                      </label>
                      <input
                        type="text"
                        disabled={isSubmitting}
                        value={paymentProof}
                        onChange={(e) => setPaymentProof(e.target.value)}
                        placeholder={paymentMethod === 'Cash' ? 'e.g. Will pay cash at reception' : 'e.g. TXN987654321'}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-600 text-white px-3 py-2.5 rounded-md outline-none text-xs transition-all disabled:opacity-50"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer mt-2 shadow-lg shadow-red-600/10 disabled:opacity-50"
                  >
                    <CreditCard className="h-4 w-4" /> {isSubmitting ? 'Submitting Request...' : 'Request Membership'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
