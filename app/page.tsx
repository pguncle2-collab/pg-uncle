'use client';

import React from 'react';
import Link from 'next/link';

export default function WrapperPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8 md:p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl mb-6 shadow-lg">
              <span className="text-5xl">🏠</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              pgUncle
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-2">
              Your Trusted Uncle for a Comfortable PG Stay
            </p>
            <p className="text-lg text-blue-200">
              in Tricity Chandigarh
            </p>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Coming Soon! 🚀
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                We're building something amazing for you. A platform where finding your perfect PG is as easy as talking to your uncle.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🏡</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Homely Environment</h3>
                  <p className="text-sm text-gray-600">Feel at home, not just a place to sleep</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">✨</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Clean & Hygienic</h3>
                  <p className="text-sm text-gray-600">Regular cleaning, no compromises</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🤝</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">No Broker, No Drama</h3>
                  <p className="text-sm text-gray-600">Deal directly with us</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">❤️</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Uncle-Level Care</h3>
                  <p className="text-sm text-gray-600">We look out for you like family</p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Want to see what we're building?
              </p>
              <Link 
                href="/main" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Preview Website
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            {/* Contact Info */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                <a href="mailto:info@pguncle.com" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <span>📧</span>
                  info@pguncle.com
                </a>
                <a href="tel:+919876543210" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <span>📞</span>
                  +91 98765 43210
                </a>
                <span className="flex items-center gap-2">
                  <span>📍</span>
                  Chandigarh, India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            © 2024 pgUncle. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
