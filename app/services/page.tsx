'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function ServicesPage() {
  const services = [
    {
      icon: '🏠',
      title: 'PG Accommodation',
      description: 'Find verified PG accommodations with single, double, triple, and quad sharing options across Chandigarh.',
      features: ['Verified Properties', 'Flexible Duration', 'All Amenities Included', 'Safe & Secure']
    },
    {
      icon: '💳',
      title: 'Secure Payments',
      description: 'Book your bed with confidence using our secure payment gateway powered by Razorpay.',
      features: ['Multiple Payment Options', 'Instant Confirmation', 'Secure Transactions', 'Payment Protection']
    },
    {
      icon: '📱',
      title: 'Easy Booking',
      description: 'Book your ideal PG in just a few clicks with our user-friendly platform.',
      features: ['Quick Search', 'Instant Booking', 'Real-time Availability', 'Mobile Friendly']
    },
    {
      icon: '🤝',
      title: 'Customer Support',
      description: '24/7 customer support to help you with any queries or concerns.',
      features: ['Email Support', 'Phone Support', 'Quick Response', 'Dedicated Team']
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Add padding-top to account for fixed navbar */}
      <div className="pt-20">
        <div className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need for a hassle-free PG accommodation experience
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-3xl mb-4">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-700">
                    <span className="text-green-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect PG?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Browse through our PG's and book your ideal accommodation today
          </p>
          <a
            href="/"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Browse PG's
          </a>
        </div>
      </div>
      </div>

      <Footer />
    </div>
  );
}
