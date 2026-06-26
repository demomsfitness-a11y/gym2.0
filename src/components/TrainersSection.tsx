import React from 'react';
import { Trainer } from '../types';
import { Instagram, Facebook, Twitter, Trophy } from 'lucide-react';

interface TrainersSectionProps {
  trainers: Trainer[];
}

export default function TrainersSection({ trainers }: TrainersSectionProps) {
  return (
    <section id="trainers" className="bg-zinc-950 py-20 border-b border-zinc-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-red-600 font-semibold tracking-wider uppercase text-xs">Expert Coaches</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase mt-1">
            Meet the Masters
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-zinc-500 text-sm">
            Our Elite trainers hold certified medical and athletic qualifications, dedicated to boosting your athletic baseline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trainers.map((trainer) => (
            <div
              key={trainer.id}
              className="bg-zinc-900 border border-zinc-850 rounded-xl overflow-hidden group hover:border-red-600/30 transition-all shadow-lg"
            >
              {/* Photo Area */}
              <div className="h-80 w-full relative overflow-hidden bg-zinc-950">
                <img
                  src={trainer.photoURL}
                  alt={trainer.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 referrerpolicy=no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
                
                {/* Specialty Overlay badge */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10">
                  <span className="bg-red-600 text-white font-black text-[10px] uppercase tracking-wider px-3 py-1.5 rounded flex items-center gap-1 shadow">
                    <Trophy className="h-3 w-3" /> {trainer.specialty}
                  </span>
                </div>
              </div>

              {/* Text Area */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-2">{trainer.name}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-6 h-12 overflow-hidden">{trainer.bio || 'Professional fitness and mobility master at MS Fitness.'}</p>

                {/* Social links */}
                <div className="flex space-x-4 border-t border-zinc-800 pt-4">
                  {trainer.socialInstagram && (
                    <a href={trainer.socialInstagram} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-red-500 transition-colors">
                      <Instagram className="h-4 w-4" />
                    </a>
                  )}
                  {trainer.socialFacebook && (
                    <a href={trainer.socialFacebook} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-red-500 transition-colors">
                      <Facebook className="h-4 w-4" />
                    </a>
                  )}
                  {trainer.socialTwitter && (
                    <a href={trainer.socialTwitter} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-red-500 transition-colors">
                      <Twitter className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
