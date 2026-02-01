'use client';

import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  icon: string;
}

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'What types of PG accommodations does pgUncle offer?',
      answer: 'pgUncle offers a variety of PG options, including single, double, and triple sharing rooms with detailed amenities to suit different needs.',
      icon: '🏠',
    },
    {
      question: 'How can I book a PG through pgUncle?',
      answer: 'You can book a PG through our website by browsing available options, selecting your preferences, and completing the booking process online.',
      icon: '📱',
    },
    {
      question: "What amenities are provided in pgUncle's PG accommodations?",
      answer: 'pgUncle offers amenities such as Wi-Fi, furnished rooms, laundry services, and 24/7 security to ensure a comfortable stay.',
      icon: '✨',
    },
    {
      question: 'Is there a way to schedule a visit before booking a PG?',
      answer: 'Yes, you can schedule a visit through our website to explore PG options in Chandigarh before making a booking decision.',
      icon: '📅',
    },
  ];

  return (
    <section className="py-16 lg:py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-5 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
            <span className="text-blue-300 text-sm font-semibold">FAQ</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Top FAQs for Your <span className="text-blue-400">Stay</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Find answers to commonly asked questions about our PG accommodations
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-white/10 hover:border-white/20 ${
                openIndex === index ? 'bg-white/10 border-white/20' : ''
              }`}
            >
              <button
                className="w-full p-6 lg:p-8 flex gap-4 items-center justify-between text-left cursor-pointer"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {faq.icon}
                  </div>
                  <p className="text-lg lg:text-xl font-semibold text-white">{faq.question}</p>
                </div>
                <div className={`w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180 bg-blue-500' : ''
                }`}>
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-96' : 'max-h-0'
              }`}>
                <div className="px-6 lg:px-8 pb-6 lg:pb-8">
                  <div className="pl-16 text-gray-300 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
