'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { analytics } from '@/lib/analytics';

interface NavbarProps {
  onAuthClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onAuthClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, signOut } = useAuth();
  
  // Check if we're on a property details page or other pages
  const isPropertyPage = pathname?.startsWith('/properties/');
  const isStaticPage = pathname === '/about' || pathname === '/services' || pathname === '/contact' || pathname === '/privacy' || pathname === '/bookings' || pathname === '/profile';

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

  const handleSignOut = async () => {
    await signOut();
    analytics.logout();
    setShowUserMenu(false);
  };

  // Get user display name
  const getUserName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    const name = getUserName();
    return name.substring(0, 2).toUpperCase();
  };

  // Always use white background on property pages and static pages
  const shouldUseWhiteBg = isScrolled || isPropertyPage || isStaticPage;

  return (
    <nav
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        shouldUseWhiteBg ? 'bg-gradient-to-r from-sky-400 via-sky-200 to-blue-100 backdrop-blur-md shadow-lg' : 'bg-gradient-to-r from-sky-400 via-sky-200 to-blue-100 backdrop-blur-md shadow-lg'
      }`}
    >
      <div className="container mx-auto px-5 md:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/main" className="flex items-center gap-3 group">
            <div className="relative w-32 h-20 group-hover:scale-110 transition-transform">
              <Image
                src="/logo_black.png"
                alt="PGUncle Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/main"
              onClick={() => analytics.clickNavLink('Home')}
              className="font-medium text-gray-700 transition-colors hover:text-sky-600 hover:bg-sky-200/50 px-3 py-2 rounded-lg"
            >
              Home
            </Link>
            <Link
              href="/main#properties"
              onClick={() => analytics.clickNavLink('Properties')}
              className="font-medium text-gray-700 transition-colors hover:text-sky-600 hover:bg-sky-200/50 px-3 py-2 rounded-lg"
            >
              Properties
            </Link>
            <Link
              href="/about"
              onClick={() => analytics.clickNavLink('About')}
              className="font-medium text-gray-700 transition-colors hover:text-sky-600 hover:bg-sky-200/50 px-3 py-2 rounded-lg"
            >
              About
            </Link>
            <Link
              href="/main#contact"
              onClick={() => analytics.clickNavLink('Contact')}
              className="font-medium text-gray-700 transition-colors hover:text-sky-600 hover:bg-sky-200/50 px-3 py-2 rounded-lg"
            >
              Contact
            </Link>
          </div>

          {/* Auth Buttons / User Profile */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-sky-200/70 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                    {getUserInitials()}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm text-gray-900">
                      {getUserName()}
                    </p>
                    <p className="text-xs text-gray-600">
                      {user.email}
                    </p>
                  </div>
                  <svg 
                    className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''} text-gray-600`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="font-semibold text-gray-900">{getUserName()}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    
                    <Link
                      href="/bookings"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-sky-100 transition-colors"
                      onClick={() => {
                        analytics.clickNavLink('My Bookings');
                        setShowUserMenu(false);
                      }}
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span className="text-gray-700">My Bookings</span>
                    </Link>

                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-sky-100 transition-colors"
                      onClick={() => {
                        analytics.clickNavLink('Profile Settings');
                        setShowUserMenu(false);
                      }}
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-gray-700">Profile Settings</span>
                    </Link>

                    <div className="border-t border-gray-200 my-2"></div>

                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="text-red-600 font-medium">Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleAuthClick}
                className="px-6 py-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl font-semibold hover:from-sky-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl"
              >
                Login / Sign Up
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-sky-200/70 transition-colors"
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
              {/* User Profile in Mobile */}
              {isAuthenticated && user && (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {getUserInitials()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{getUserName()}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  
                  <Link
                    href="/bookings"
                    className="px-4 py-3 text-gray-700 hover:bg-sky-100 rounded-xl font-medium transition-colors flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    My Bookings
                  </Link>

                  <Link
                    href="/profile"
                    className="px-4 py-3 text-gray-700 hover:bg-sky-100 rounded-xl font-medium transition-colors flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile Settings
                  </Link>

                  <div className="border-t border-gray-200 my-2"></div>
                </>
              )}

              <Link
                href="/main"
                className="px-4 py-3 text-gray-700 hover:bg-sky-100 rounded-xl font-medium transition-colors"
                onClick={() => {
                  analytics.clickNavLink('Home - Mobile');
                  setIsMobileMenuOpen(false);
                }}
              >
                Home
              </Link>
              <Link
                href="/main#properties"
                className="px-4 py-3 text-gray-700 hover:bg-sky-100 rounded-xl font-medium transition-colors"
                onClick={() => {
                  analytics.clickNavLink('Properties - Mobile');
                  setIsMobileMenuOpen(false);
                }}
              >
                Properties
              </Link>
              <Link
                href="/main#contact"
                className="px-4 py-3 text-gray-700 hover:bg-sky-100 rounded-xl font-medium transition-colors"
                onClick={() => {
                  analytics.clickNavLink('Contact - Mobile');
                  setIsMobileMenuOpen(false);
                }}
              >
                Contact
              </Link>
              <div className="border-t border-gray-200 my-2"></div>
              
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 bg-red-500 text-white rounded-xl font-semibold text-center hover:bg-red-600 transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    handleAuthClick(e);
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl font-semibold text-center hover:from-sky-600 hover:to-blue-600 transition-all"
                >
                  Login / Sign Up
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
