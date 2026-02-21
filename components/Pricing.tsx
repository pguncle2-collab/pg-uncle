'use client';

import React from 'react';

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  icon: string;
}

export const Pricing: React.FC = () => {
  const tiers: PricingTier[] = [
    {
      name: 'Basic Accommodation',
      price: '₹5,000',
      description: 'Enjoy comfortable lodging with all the essential amenities included.',
      features: ['Single bed', 'Shared washroom', 'Basic meals', 'Wi-Fi access', '24/7 security'],
      icon: '🏠',
    },
    {
      name: 'Enhanced Comfort',
      price: '₹8,000',
      description: 'Includes all features from the Basic Accommodation with additional conveniences.',
      features: ['Double bed', 'Private washroom', 'Laundry service', 'Meal variety', 'Study table'],
      popular: true,
      icon: '⭐',
    },
    {
      name: 'Premium Living',
      price: '₹12,000',
      description: 'Includes all features from previous tiers with luxury add-ons.',
      features: ['AC room', 'Housekeeping', 'CCTV surveillance', 'Personalized meals'],
      icon: '👑',
    },
  ];

  return (
    <section id="pricing" className="py-16 lg:py-32 bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-5 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
            <span className="text-blue-200 text-sm font-semibold">PRICING PLANS</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Find Your Ideal PG in <span className="text-blue-300">Chandigarh</span>
          </h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Choose the perfect plan that fits your budget and lifestyle
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-8">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`group relative flex flex-col w-full max-w-md bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:bg-white/10 ${
                tier.popular ? 'lg:scale-110 border-2 border-blue-400 shadow-2xl shadow-blue-500/20' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-gray-900 px-6 py-2 rounded-bl-2xl font-bold text-sm">
                  MOST POPULAR
                </div>
              )}
              
              <div className="p-8 flex flex-col gap-6 text-white flex-1">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                    {tier.icon}
                  </div>
                  <h3 className="text-2xl font-bold">{tier.name}</h3>
                </div>
                
                <div className="py-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">{tier.price}</span>
                    <span className="text-gray-300">/month</span>
                  </div>
                </div>
                
                <p className="text-gray-300 leading-relaxed">{tier.description}</p>
                
                <div className="flex flex-col gap-3 flex-1">
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-gray-200">{feature}</p>
                    </div>
                  ))}
                </div>
                
                <button className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 ${
                  tier.popular
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-gray-900 hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-blue-500/50'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/30'
                }`}>
                  Choose Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
