import React, { useState } from 'react';
import { GalleryMedia } from '../types';
import { Image, PlayCircle } from 'lucide-react';

interface GallerySectionProps {
  media: GalleryMedia[];
}

export default function GallerySection({ media }: GallerySectionProps) {
  const [selectedAlbum, setSelectedAlbum] = useState<string>('All');
  const albums = ['All', 'Gym Floor', 'Classes', 'Events'];

  const filteredMedia = selectedAlbum === 'All'
    ? media
    : media.filter(m => m.album === selectedAlbum);

  return (
    <section id="gallery" className="bg-zinc-950 py-20 border-b border-zinc-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-red-600 font-semibold tracking-wider uppercase text-xs">Gym Gallery</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase mt-1">
            Explore the Iron Paradise
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-zinc-500 text-sm">
            Take an inside look at our 12,000 square foot facility, premium classes, and high-energy powerlifter events.
          </p>
        </div>

        {/* Album Toggles */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {albums.map((alb) => (
            <button
              key={alb}
              onClick={() => setSelectedAlbum(alb)}
              className={`py-2 px-4 rounded-md text-xs font-semibold tracking-wider uppercase transition-all ${selectedAlbum === alb ? 'bg-red-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-850'}`}
            >
              {alb}
            </button>
          ))}
        </div>

        {/* Grid List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedia.map((m) => (
            <div
              key={m.id}
              className="group bg-zinc-900 border border-zinc-850 rounded-xl overflow-hidden relative shadow-lg h-64"
            >
              <img
                src={m.url}
                alt={m.title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 referrerpolicy=no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 flex flex-col justify-end p-5 opacity-80 group-hover:opacity-100 transition-opacity" />

              <div className="absolute bottom-5 left-5 right-5 z-10">
                <span className="bg-red-600/10 border border-red-500 text-red-500 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 inline-block">
                  {m.album}
                </span>
                <h4 className="text-white font-bold text-sm uppercase tracking-wider">{m.title}</h4>
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs mt-1">
                  {m.type === 'video' ? (
                    <>
                      <PlayCircle className="h-4 w-4 text-red-500 shrink-0" />
                      <span>Video Clip</span>
                    </>
                  ) : (
                    <>
                      <Image className="h-4 w-4 text-zinc-500 shrink-0" />
                      <span>Standard Photo</span>
                    </>
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
