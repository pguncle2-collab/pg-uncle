'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Add padding-top to account for fixed navbar */}
      <div className="pt-20">
        <div className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">About PGUNCLE</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted partner in finding the perfect PG accommodation in Tricity, Chandigarh
          </p>
        </div>

        {/* Story Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                PGUNCLE was born from a simple idea: finding quality PG accommodation shouldn't be complicated. 
                We understand the challenges students and working professionals face when searching for a comfortable, 
                safe, and affordable place to stay.
              </p>
              <p>
                Based in Tricity, Chandigarh, PGUNCLE is our own trusted platform featuring carefully managed PG accommodations.
                Every resident undergoes background verification, and each place is carefully maintained — ensuring you get exactly what you see on our website.
              </p>
              <p>
                Our mission is to make the process of finding and booking PG accommodation as seamless as possible, 
                with transparent pricing, secure payments, and reliable customer support.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Trust & Safety</h3>
              <p className="text-gray-600">
                Every resident undergoes background verification to ensure your safety and peace of mind.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💎</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quality</h3>
              <p className="text-gray-600">
               We maintain high standards in PG, ensuring comfortable and hygienic living spaces.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Support</h3>
              <p className="text-gray-600">
                Our dedicated team is always ready to help you with any questions or concerns throughout your journey.
              </p>
            </div>
          </div>
        </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
