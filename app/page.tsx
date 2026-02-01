'use client';

import React from 'react';
import Link from 'next/link';
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
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl mb-4 shadow-2xl border border-white/20">
            <span className="text-6xl">🏠</span>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-tight">
              pgUncle
            </h1>
            <p className="text-2xl md:text-3xl text-blue-100 font-light">
              Your Trusted Uncle for a Comfortable PG Stay
            </p>
            <p className="text-lg md:text-xl text-cyan-200">
              in Tricity Chandigarh
            </p>
          </div>

          {/* Coming Soon Badge */}
          <div className="inline-block">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-8 py-4 shadow-xl">
              <p className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                <span className="animate-pulse">🚀</span>
                Coming Soon
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            We're building something amazing. A platform where finding your perfect PG is as easy as talking to your uncle.
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="text-3xl mb-2">🏡</div>
              <p className="text-sm text-white font-semibold">Homely</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="text-3xl mb-2">✨</div>
              <p className="text-sm text-white font-semibold">Clean</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="text-3xl mb-2">🤝</div>
              <p className="text-sm text-white font-semibold">No Broker</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="text-3xl mb-2">❤️</div>
              <p className="text-sm text-white font-semibold">Family Care</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <Link 
              href="/main" 
              className="group inline-flex items-center gap-3 bg-white hover:bg-blue-50 text-blue-900 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:scale-105"
            >
              Preview Website
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* Contact Info */}
          <div className="pt-8">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-100">
              <a href="mailto:info@pguncle.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <span>📧</span>
                info@pguncle.com
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-2 hover:text-white transition-colors">
                <span>📞</span>
                +91 98765 43210
              </a>
              <span className="flex items-center gap-2">
                <span>📍</span>
                Chandigarh, India
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-8">
            <p className="text-sm text-blue-200">
              © 2024 pgUncle. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
    </div>
  );
}
