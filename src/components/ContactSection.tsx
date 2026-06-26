import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

interface ContactSectionProps {
  onSubmitContact: (name: string, email: string, phone: string, message: string) => void;
  texts: {
    address: string;
    phone: string;
    email: string;
  };
}

export default function ContactSection({ onSubmitContact, texts }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    onSubmitContact(name, email, phone, message);
    setIsSent(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');

    setTimeout(() => {
      setIsSent(false);
    }, 4000);
  };

  return (
    <section id="contact" className="bg-zinc-950 py-20 border-b border-zinc-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-red-600 font-semibold tracking-wider uppercase text-xs">Contact Us</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase mt-1">
            Get in the Zone
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-zinc-500 text-sm">
            Have questions about our facility, membership upgrades, or coaching setups? Submit a query and hear from our desk team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Quick Details */}
          <div className="lg:col-span-1 space-y-8 bg-zinc-900 p-8 border border-zinc-850 rounded-xl flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white uppercase tracking-wider">MS Office Details</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Walk into our Delhi branch or query online. Our administrative desk is fully staffed and active.
              </p>

              <div className="space-y-4">
                <div className="flex items-start text-sm">
                  <MapPin className="h-5 w-5 text-red-500 mr-3 shrink-0" />
                  <div>
                    <span className="block text-white font-bold uppercase tracking-wider text-xs">Corporate Location</span>
                    <span className="text-zinc-500">{texts.address}</span>
                  </div>
                </div>

                <div className="flex items-center text-sm">
                  <Phone className="h-5 w-5 text-red-500 mr-3 shrink-0" />
                  <div>
                    <span className="block text-white font-bold uppercase tracking-wider text-xs">Direct Phone Line</span>
                    <span className="text-zinc-500">{texts.phone}</span>
                  </div>
                </div>

                <div className="flex items-center text-sm">
                  <Mail className="h-5 w-5 text-red-500 mr-3 shrink-0" />
                  <div>
                    <span className="block text-white font-bold uppercase tracking-wider text-xs">Corporate Email</span>
                    <span className="text-zinc-500">{texts.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps link block */}
            <div className="pt-6 border-t border-zinc-800">
              <span className="text-xs uppercase font-mono text-zinc-500 block mb-2">Google Maps Integrated Location</span>
              <div className="h-32 bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden relative">
                {/* Visual placeholder for Maps iframe to ensure responsiveness */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=300')] bg-cover opacity-10 bg-center" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
                  <span className="text-red-500 text-xs font-bold uppercase tracking-wider">MS Fitness Delhi Central</span>
                  <p className="text-[10px] text-zinc-500 mt-1">Latitude/Longitude Coordinates Loaded</p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 bg-red-600 hover:bg-red-700 text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded"
                  >
                    View Map
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Form Panel */}
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-850 p-8 rounded-xl relative overflow-hidden">
            {isSent ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="h-14 w-14 bg-red-600 text-white rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-white uppercase">Query Submitted!</h3>
                <p className="text-zinc-500 text-sm max-w-md">Thank you for contacting MS Fitness. Your form submission has been synchronized with the Admin Panel in real time. Our representative will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Kumar"
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-600 text-white px-4 py-3 rounded-lg outline-none text-xs transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rahul@example.com"
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-600 text-white px-4 py-3 rounded-lg outline-none text-xs transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-600 text-white px-4 py-3 rounded-lg outline-none text-xs transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Message Query</label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your fitness goals or questions here..."
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-600 text-white px-4 py-3 rounded-lg outline-none text-xs transition-all resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold tracking-widest uppercase py-3.5 px-8 rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-red-600/10"
                >
                  <Send className="h-4 w-4" /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
