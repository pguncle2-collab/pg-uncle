import React from 'react';
import Image from 'next/image';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  color: string;
}

export const Features: React.FC = () => {
  const features: Feature[] = [
    {
      title: 'Homely Environment',
      description: 'We believe a PG should feel like home, not just a place to sleep.',
      image: '/Gemini_Generated_Image_2ljwvi2ljwvi2ljw.png',
      color: 'blue',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      title: 'Clean & Hygienic Rooms',
      description: 'Regular cleaning and proper maintenance—no compromises.',
      image: '/Gemini_Generated_Image_i38nbni38nbni38n.png',
      color: 'green',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'No Broker, No Drama',
      description: 'Deal directly with us. What you see is what you get.',
      image: '/Gemini_Generated_Image_udk1wkudk1wkudk1.png',
      color: 'purple',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      title: 'Uncle-Level Care 😉',
      description: 'From safety to support, PGUNCLE looks out for you like family.',
      image: '/Gemini_Generated_Image_xgs7sixgs7sixgs7.png',
      color: 'orange',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
  ];

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 group-hover:from-blue-600 group-hover:to-blue-700',
    green: 'from-green-500 to-green-600 group-hover:from-green-600 group-hover:to-green-700',
    purple: 'from-purple-500 to-purple-600 group-hover:from-purple-600 group-hover:to-purple-700',
    orange: 'from-orange-500 to-orange-600 group-hover:from-orange-600 group-hover:to-orange-700',
  };

  return (
    <section className="py-16 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-5 md:px-6">
        <div className="text-center mb-16">
          <p className="text-blue-600 text-sm font-semibold mb-4 tracking-wide uppercase">
            Why Choose Us
          </p>
          <h2 className="text-2xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Why Choose <span className="text-blue-600">PGUNCLE?</span>
          </h2>
          <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto">
            We make finding your perfect PG accommodation simple and stress-free
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className={`absolute bottom-4 left-4 w-14 h-14 bg-gradient-to-br ${colorClasses[feature.color as keyof typeof colorClasses]} rounded-xl flex items-center justify-center text-white shadow-lg transition-all duration-300`}>
                  {feature.icon}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
