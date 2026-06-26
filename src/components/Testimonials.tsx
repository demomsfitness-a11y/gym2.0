import React from 'react';
import { Quote, Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section id="testimonials" className="bg-zinc-950 py-20 border-b border-zinc-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-red-600 font-semibold tracking-wider uppercase text-xs">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase mt-1">
            Athletes of MS Fitness
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-zinc-500 text-sm">
            Hear from our active lifters and endurance athletes on how structured coaching and premium support helped them excel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="bg-zinc-900 border border-zinc-850 p-8 rounded-xl flex flex-col justify-between hover:border-zinc-700 transition-all shadow-md relative"
            >
              <Quote className="absolute top-6 right-8 h-10 w-10 text-zinc-800 shrink-0" />

              <div>
                {/* Rating stars */}
                <div className="flex space-x-1 mb-4">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-red-500 fill-red-500" />
                  ))}
                </div>

                <p className="text-zinc-400 text-sm leading-relaxed italic mb-8 relative z-10">
                  "{test.quote}"
                </p>
              </div>

              {/* User Bio */}
              <div className="flex items-center gap-4 border-t border-zinc-800 pt-5">
                <img
                  src={test.avatar}
                  alt={test.name}
                  className="h-12 w-12 rounded-full object-cover border border-zinc-700 referrerpolicy=no-referrer"
                />
                <div>
                  <h4 className="text-white font-bold text-sm uppercase tracking-wider">{test.name}</h4>
                  <span className="text-zinc-500 text-xs">{test.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
