'use client';

import React from 'react';
import Image from 'next/image';

export default function WrapperPage() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070"
          alt="Modern PG Accommodation"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-blue-800/90 to-cyan-900/95" />
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-cyan-600/20 animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center p-4">
        <div className="max-w-4xl w-full text-center space-y-8 animate-fade-in">
          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-7xl md:text-9xl font-bold text-white tracking-tight">
              pgUncle
            </h1>
            <p className="text-2xl md:text-4xl text-blue-100 font-light">
              Your Trusted Uncle for a Comfortable PG Stay
            </p>
            <p className="text-xl md:text-2xl text-cyan-300 font-semibold">
              The Future of PG is Here
            </p>
          </div>

          {/* Coming Soon Badge */}
          <div className="inline-block pt-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-10 py-5 shadow-xl">
              <p className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
                <span className="animate-pulse">🚀</span>
                Coming Soon
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
    </div>
  );
}
