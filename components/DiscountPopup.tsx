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
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
      style={{ animation: 'fadeIn 0.3s ease-out' }}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden"
        style={{ 
          animation: 'scaleIn 0.4s ease-out',
          maxHeight: 'calc(100vh - 40px)',
          maxHeight: 'calc(100dvh - 40px)' /* Use dynamic viewport height for mobile */
        }}
      >
        {/* Close button - Fixed position */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 md:top-3 md:right-3 z-20 p-1.5 md:p-2 bg-gray-900/80 hover:bg-gray-900 text-white rounded-full shadow-xl transition-all hover:scale-110 backdrop-blur-sm"
          aria-label="Close"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto overflow-x-hidden custom-scrollbar" style={{ maxHeight: 'calc(100vh - 40px)', maxHeight: 'calc(100dvh - 40px)' }}>
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 text-white px-4 py-6 md:px-8 md:py-8">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)',
              }} />
            </div>
            
            <div className="relative text-center">
              <div className="inline-block mb-2 animate-bounce">
                <span className="text-3xl md:text-4xl">🎉</span>
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-1.5 md:mb-2">
                Exclusive Offer Just For You!
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-white/90">
                Save Big on Your First Booking
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 py-5 md:px-6 md:py-6 lg:px-8 lg:py-8">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-5 lg:p-6 mb-4 md:mb-5">
              <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-3 md:mb-4 text-center">
                Choose Your Savings Plan
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                {/* 3 Months */}
                <div className="relative p-3 md:p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg md:rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-all hover:scale-105 hover:shadow-lg">
                  <div className="text-center">
                    <div className="text-lg md:text-xl lg:text-2xl font-bold text-blue-600 mb-0.5 md:mb-1">3 Months</div>
                    <div className="text-xs text-gray-600 mb-1.5 md:mb-2">Short Stays</div>
                    <div className="py-1.5 md:py-2 px-2 md:px-3 bg-blue-500 text-white rounded-lg font-bold text-sm md:text-base lg:text-lg shadow-md">
                      ₹1,000 OFF
                    </div>
                  </div>
                </div>

                {/* 6 Months */}
                <div className="relative p-3 md:p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg md:rounded-xl border-2 border-green-200 hover:border-green-400 transition-all hover:scale-105 hover:shadow-lg">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                    <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full shadow-md">
                      POPULAR
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="text-lg md:text-xl lg:text-2xl font-bold text-green-600 mb-0.5 md:mb-1">6 Months</div>
                    <div className="text-xs text-gray-600 mb-1.5 md:mb-2">Best Value</div>
                    <div className="py-1.5 md:py-2 px-2 md:px-3 bg-green-500 text-white rounded-lg font-bold text-sm md:text-base lg:text-lg shadow-md">
                      ₹3,000 OFF
                    </div>
                  </div>
                </div>

                {/* 12 Months */}
                <div className="relative p-3 md:p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg md:rounded-xl border-2 border-yellow-300 hover:border-yellow-400 transition-all hover:scale-105 hover:shadow-lg">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                    <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full animate-pulse shadow-md">
                      BEST DEAL
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="text-lg md:text-xl lg:text-2xl font-bold text-orange-600 mb-0.5 md:mb-1">12 Months</div>
                    <div className="text-xs text-gray-600 mb-1.5 md:mb-2">Max Savings</div>
                    <div className="py-1.5 md:py-2 px-2 md:px-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-bold text-sm md:text-base lg:text-lg shadow-md">
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
                className="px-5 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg md:rounded-xl font-bold text-sm md:text-base hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Browse PG's
              </button>
              <p className="text-xs text-gray-500 mt-2 md:mt-3">
                ⏰ Limited time offer • Valid on all PG's
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
        
        /* Custom scrollbar styles - hidden by default, visible on hover */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: transparent transparent;
        }
        
        .custom-scrollbar:hover {
          scrollbar-color: #d1d5db transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 3px;
        }
        
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: #d1d5db;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};
