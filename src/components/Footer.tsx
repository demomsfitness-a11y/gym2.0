import React from 'react';
import { Dumbbell, Phone, Mail, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
  texts: {
    address: string;
    phone: string;
    email: string;
    socialInstagram: string;
    socialFacebook: string;
    socialTwitter: string;
  };
}

export default function Footer({ onNavigate, texts }: FooterProps) {
  return (
    <footer id="app-footer" className="bg-zinc-950 border-t border-zinc-900 text-zinc-400 py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* About Column */}
        <div className="space-y-4">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="p-2 bg-red-600 rounded-lg flex items-center justify-center mr-2">
              <Dumbbell className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-wider text-white">
              MS <span className="text-red-600">FITNESS</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed text-zinc-500">
            MS Fitness is Delhi's premier athletic club, featuring high-end resistance rigs, professional coaches, and full-stack biomechanical monitoring systems.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href={texts.socialInstagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-900 hover:bg-red-600 hover:text-white rounded-full transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
            <a href={texts.socialFacebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-900 hover:bg-red-600 hover:text-white rounded-full transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
            <a href={texts.socialTwitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-900 hover:bg-red-600 hover:text-white rounded-full transition-colors">
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div>
          <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-6 border-l-2 border-red-600 pl-3">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            <li><button onClick={() => onNavigate('home')} className="hover:text-red-500 transition-colors">Home</button></li>
            <li><button onClick={() => onNavigate('about')} className="hover:text-red-500 transition-colors">About Us</button></li>
            <li><button onClick={() => onNavigate('plans')} className="hover:text-red-500 transition-colors">Membership Plans</button></li>
            <li><button onClick={() => onNavigate('classes')} className="hover:text-red-500 transition-colors">Timetable & Schedule</button></li>
            <li><button onClick={() => onNavigate('trainers')} className="hover:text-red-500 transition-colors">Our Trainers</button></li>
          </ul>
        </div>

        {/* Legal Column */}
        <div>
          <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-6 border-l-2 border-red-600 pl-3">Support & Legal</h3>
          <ul className="space-y-3 text-sm">
            <li><button onClick={() => onNavigate('privacy')} className="hover:text-red-500 transition-colors">Privacy Policy</button></li>
            <li><button onClick={() => onNavigate('terms')} className="hover:text-red-500 transition-colors">Terms & Conditions</button></li>
            <li><button onClick={() => onNavigate('faq')} className="hover:text-red-500 transition-colors">Frequently Asked Questions</button></li>
            <li><button onClick={() => onNavigate('contact')} className="hover:text-red-500 transition-colors">Get in Touch</button></li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div>
          <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-6 border-l-2 border-red-600 pl-3">MS Fitness Hub</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start">
              <MapPin className="h-5 w-5 text-red-500 mr-3 shrink-0" />
              <span className="text-zinc-500">{texts.address}</span>
            </li>
            <li className="flex items-center">
              <Phone className="h-4 w-4 text-red-500 mr-3 shrink-0" />
              <span className="text-zinc-500">{texts.phone}</span>
            </li>
            <li className="flex items-center">
              <Mail className="h-4 w-4 text-red-500 mr-3 shrink-0" />
              <span className="text-zinc-500">{texts.email}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-zinc-900 text-center text-xs text-zinc-600">
        <p>&copy; 2026 MS Fitness. All Rights Reserved. Empowering athletes globally.</p>
        <p className="mt-2 text-zinc-700">Protected by modern cloud authentication and robust security protocols.</p>
      </div>
    </footer>
  );
}
