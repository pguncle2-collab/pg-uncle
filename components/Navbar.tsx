'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  onAuthClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onAuthClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Check if we're on a property details page
  const isPropertyPage = pathname?.startsWith('/properties/');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuthClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAuthClick) {
      onAuthClick();
    }
  };

  // Always use white background on property pages
  const shouldUseWhiteBg = isScrolled || isPropertyPage;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        shouldUseWhiteBg ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-5 md:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/main" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              🏠
            </div>
            <span className={`text-2xl font-bold transition-colors ${shouldUseWhiteBg ? 'text-gray-900' : 'text-white'}`}>
              pgUncle
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/main"
              className={`font-medium transition-colors hover:text-blue-500 ${
                shouldUseWhiteBg ? 'text-gray-700' : 'text-white'
              }`}
            >
              Home
            </Link>
            <Link
              href="/main#properties"
              className={`font-medium transition-colors hover:text-blue-500 ${
                shouldUseWhiteBg ? 'text-gray-700' : 'text-white'
              }`}
            >
              Properties
            </Link>
            <Link
              href="/main#pricing"
              className={`font-medium transition-colors hover:text-blue-500 ${
                shouldUseWhiteBg ? 'text-gray-700' : 'text-white'
              }`}
            >
              Pricing
            </Link>
            <Link
              href="/main#contact"
              className={`font-medium transition-colors hover:text-blue-500 ${
                shouldUseWhiteBg ? 'text-gray-700' : 'text-white'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={handleAuthClick}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
            >
              Login / Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              shouldUseWhiteBg ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 bg-white rounded-2xl shadow-xl mt-2 mb-4">
            <div className="flex flex-col gap-2 px-4">
              <Link
                href="/main"
                className="px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/main#properties"
                className="px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Properties
              </Link>
              <Link
                href="/main#pricing"
                className="px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/main#contact"
                className="px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="border-t border-gray-200 my-2"></div>
              <button
                onClick={(e) => {
                  handleAuthClick(e);
                  setIsMobileMenuOpen(false);
                }}
                className="px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold text-center"
              >
                Login / Sign Up
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
