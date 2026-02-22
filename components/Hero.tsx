'use client';

import React from 'react';
import Image from 'next/image';

interface HeroProps {
  onAuthClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onAuthClick }) => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1920&q=80"
          alt="PG Accommodation"
          fill
          className="object-cover scale-105 hover:scale-100 transition-transform duration-[3000ms]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>
      
      <div className="container mx-auto px-5 md:px-6 relative z-10 py-20 lg:py-32">
        <div className="max-w-5xl animate-fade-in">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-full">
            <span className="text-blue-300 text-sm font-medium">🏠 Premium PG Accommodations</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Your Trusted Uncle for a Comfortable <span className="text-blue-400">PG Stay</span> in <span className="text-blue-400">Tricity Chandigarh</span>
          </h1>
          <p className="text-base md:text-xl lg:text-2xl text-gray-200 mb-8 leading-relaxed">
            Whether you're a student chasing dreams or professional building a career, <span className="text-blue-400 font-semibold">PGUNCLE</span> gives you a safe, clean and homely PG - without stress, brokers, or surprises.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#properties" className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/50 hover:scale-105 flex items-center justify-center gap-2">
              Browse PG Options
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
          
          <div className="mt-12 flex flex-wrap gap-8 text-white">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-blue-600/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
              <div>
                <div className="text-sm text-gray-300">Verified PGs</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-blue-600/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
              <div>
                <div className="text-2xl font-bold">4.8/5</div>
                <div className="text-sm text-gray-300">Average Rating</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-blue-600/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <div className="text-sm text-gray-300">Happy Guests</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent z-10" />
    </section>
  );
};
