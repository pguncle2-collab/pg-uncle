'use client';

import React, { useState, useEffect } from 'react';

export const DiscountPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    console.log('DiscountPopup mounted');
    
    // Always show popup for testing - ignore sessionStorage
    console.log('Setting timer for 3 seconds...');
    const timer = setTimeout(() => {
      console.log('Timer fired! Showing popup...');
      setIsVisible(true);
    }, 3000);

    return () => {
      console.log('Cleaning up timer');
      clearTimeout(timer);
    };
  }, []);

  console.log('Render - isVisible:', isVisible);

  const handleClose = () => {
    console.log('Closing popup');
    setIsVisible(false);
    sessionStorage.setItem('discountPopupShown', 'true');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={handleBackdropClick}
      style={{ animation: 'fadeIn 0.3s ease-out' }}
    >
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 mx-auto"
        style={{ animation: 'scaleIn 0.4s ease-out', maxHeight: 'calc(100vh - 64px)' }}
      >
        {/* Close button - Fixed position */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 bg-gray-900/80 hover:bg-gray-900 text-white rounded-full shadow-xl transition-all hover:scale-110 backdrop-blur-sm"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 64px)' }}>
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 text-white px-6 py-10 md:px-10 md:py-12">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)',
              }} />
            </div>
            
            <div className="relative text-center">
              <div className="inline-block mb-4 animate-bounce">
                <span className="text-5xl md:text-6xl">🎉</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Exclusive Offer Just For You!
              </h2>
              <p className="text-lg md:text-xl text-white/90">
                Save Big on Your Next Booking
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8 md:px-10 md:py-10">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center">
                Choose Your Savings Plan
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                {/* 3 Months */}
                <div className="relative p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200 hover:border-blue-400 transition-all hover:scale-105 hover:shadow-xl">
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">3 Months</div>
                    <div className="text-xs md:text-sm text-gray-600 mb-3">Perfect for Short Stays</div>
                    <div className="py-3 px-4 bg-blue-500 text-white rounded-xl font-bold text-lg md:text-xl shadow-md">
                      ₹1,000 OFF
                    </div>
                  </div>
                </div>

                {/* 6 Months */}
                <div className="relative p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 hover:border-green-400 transition-all hover:scale-105 hover:shadow-xl">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-md">
                      POPULAR
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-green-600 mb-2">6 Months</div>
                    <div className="text-xs md:text-sm text-gray-600 mb-3">Best Value Deal</div>
                    <div className="py-3 px-4 bg-green-500 text-white rounded-xl font-bold text-lg md:text-xl shadow-md">
                      ₹3,000 OFF
                    </div>
                  </div>
                </div>

                {/* 12 Months */}
                <div className="relative p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-300 hover:border-yellow-400 transition-all hover:scale-105 hover:shadow-xl">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full animate-pulse shadow-md">
                      BEST DEAL
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-orange-600 mb-2">12 Months</div>
                    <div className="text-xs md:text-sm text-gray-600 mb-3">Maximum Savings</div>
                    <div className="py-3 px-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-bold text-lg md:text-xl shadow-md">
                      1 MONTH FREE
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <button
                onClick={handleClose}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-base md:text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Browse PG's
              </button>
              <p className="text-xs md:text-sm text-gray-500 mt-4">
                ⏰ Limited time offer • Valid on all properties
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.95);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        /* Hide scrollbar for Chrome, Safari and Opera */
        .custom-scrollbar::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .custom-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
};
