'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProperties } from '@/hooks/useProperties';
import { analytics } from '@/lib/analytics';

interface PropertyDisplay {
  id: string;
  name: string;
  city: string;
  location: string;
  price: number;
  type: string;
  gender: string;
  image: string;
  rating: number;
  reviews: number;
  amenities: string[];
  available: boolean;
}

export const Properties: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [expandedAmenities, setExpandedAmenities] = useState<{ [key: string]: boolean }>({});
  const { properties, loading, error, fetchProperties } = useProperties();

  const cities = ['All', 'Chandigarh', 'Mohali', 'Panchkula', 'Zirakpur'];

  // Force refresh function
  const handleRefresh = async () => {
    if (typeof window !== 'undefined') {
      try {
        // Clear client-side cache
        sessionStorage.clear();
        
        // Clear server-side cache
        await fetch('/api/cache/clear', { method: 'POST' }).catch(err => {
          console.warn('Failed to clear server cache:', err);
        });
        
        // Force fetch without cache
        fetchProperties(0, false);
      } catch (error) {
        console.error('Refresh error:', error);
        // Still try to fetch even if cache clear fails
        fetchProperties(0, false);
      }
    }
  };

  // Helper function to optimize image URLs
  const optimizeImageUrl = (url: string, size: 'thumbnail' | 'medium' | 'large' = 'medium'): string => {
    // If it's a Supabase storage URL, add transformation parameters
    if (url.includes('supabase.co/storage')) {
      const sizeParams = {
        thumbnail: 'width=400&quality=75',
        medium: 'width=800&quality=80',
        large: 'width=1200&quality=85'
      };
      return `${url}?${sizeParams[size]}`;
    }
    
    // If it's Unsplash, use their optimization parameters
    if (url.includes('unsplash.com')) {
      const sizeParams = {
        thumbnail: 'w=400&q=75&fm=webp&fit=crop',
        medium: 'w=800&q=80&fm=webp&fit=crop',
        large: 'w=1200&q=85&fm=webp&fit=crop'
      };
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}${sizeParams[size]}`;
    }
    
    return url;
  };

  // Transform data to match component interface
  const transformedProperties: PropertyDisplay[] = properties.map((prop) => ({
    id: prop.id,
    name: prop.name,
    city: prop.city,
    location: prop.location || prop.address,
    price: prop.price,
    type: prop.roomTypes?.[0]?.type || 'Single',
    gender: 'All', // Default to 'All' since gender field was removed
    image: optimizeImageUrl(prop.images?.[0] || prop.image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', 'medium'),
    rating: prop.rating || 4.5,
    reviews: prop.reviews || 12,
    amenities: prop.amenities?.filter(a => a.available).map(a => a.name) || [],
    available: prop.isActive,
  }));

  const filteredProperties = transformedProperties.filter((property) => {
    const cityMatch = selectedCity === 'All' || property.city === selectedCity;
    // Removed type filter - show all types
    return cityMatch;
  });

  // Track filter changes
  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    analytics.filterProperties('city', city);
  };

  // Show loading state with skeleton
  if (loading) {
    return (
      <section id="properties" className="py-16 lg:py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-5 md:px-6">
          <div className="text-center mb-16">
            <p className="text-blue-600 text-sm font-semibold mb-4 tracking-wide uppercase">
              Available Properties
            </p>
            <h2 className="text-2xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Find Your <span className="text-blue-600">Perfect PG</span>
            </h2>
          </div>

          {/* Loading Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                    <div className="h-10 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section id="properties" className="py-16 lg:py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-5 md:px-6">
          <div className="text-center py-16 bg-red-50 rounded-2xl px-8 max-w-2xl mx-auto">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-red-900 mb-2">Database Connection Error</h3>
            <p className="text-red-600 mb-4">{error}</p>
            
            {/* Show helpful message if it's a timeout/pause error */}
            {(error.includes('timeout') || error.includes('paused')) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-left">
                <p className="text-sm text-blue-900 font-semibold mb-2">💡 This usually means:</p>
                <ul className="text-sm text-blue-800 space-y-1 list-disc ml-4">
                  <li>The database is paused (free tier pauses after inactivity)</li>
                  <li>The administrator needs to restore it</li>
                </ul>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
              >
                🔄 Retry
              </button>
              {(error.includes('timeout') || error.includes('paused')) && (
                <a
                  href="mailto:info@pguncle.com?subject=Database Connection Issue"
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold"
                >
                  📧 Contact Support
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="properties" className="py-16 lg:py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-5 md:px-6">
        <div className="text-center mb-16">
          <p className="text-blue-600 text-sm font-semibold mb-4 tracking-wide uppercase">
            Available Properties
          </p>
          <h2 className="text-2xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Find Your <span className="text-blue-600">Perfect PG</span>
          </h2>
          <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            Finding the right PG is more than just four walls and a bed.
            It's about feeling safe, comfortable, and stress-free—especially when you're away from home.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
              <span className="text-green-600 text-sm font-semibold">
                ✓ {transformedProperties.length} properties available
              </span>
            </div>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors"
              title="Refresh properties"
            >
              <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-blue-600 text-sm font-semibold">Refresh</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 mb-12">
          {/* City Filter */}
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            {/* City Filter - Dropdown on Mobile, Buttons on Desktop */}
            <div className="w-full md:w-auto">
              {/* Mobile Dropdown */}
              <div className="md:hidden">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select City:</label>
                <select
                  value={selectedCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none bg-white text-gray-900 font-medium"
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Desktop Buttons */}
              <div className="hidden md:flex flex-wrap gap-2 justify-center">
                <span className="text-sm font-medium text-gray-700 flex items-center">City:</span>
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleCityChange(city)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedCity === city
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property, index) => (
            <div
              key={property.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2"
            >
              <div className="relative h-64 overflow-hidden bg-gray-200">
                <Image
                  src={property.image}
                  alt={property.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  priority={index < 3}
                  loading={index < 6 ? 'eager' : 'lazy'}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={80}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAB//2Q=="
                />
                {!property.available && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                      Not Available
                    </span>
                  </div>
                )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-semibold text-gray-900">{property.type} Sharing</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Link href={`/properties/${property.id}`}>
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors cursor-pointer">
                          {property.name}
                        </h3>
                      </Link>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {property.location}, {property.city}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-lg">
                    <svg className="w-4 h-4 text-blue-500 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-900">{property.rating}</span>
                    <span className="text-xs text-gray-600">({property.reviews})</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {(expandedAmenities[property.id] 
                    ? property.amenities 
                    : property.amenities.slice(0, 4)
                  ).map((amenity, index) => {
                    // Map amenities to icons
                    const amenityIcons: { [key: string]: string } = {
                      'Wifi': '🛜',
                      'WiFi': '🛜',
                      'AC': '❄️',
                      'Laundry': '🧺',
                      'Meals': '🍱',
                      'Parking': '🚗',
                      'Security': '🔒',
                      'Housekeeping': '🧹',
                      'Room Cleaning Service': '🧹',
                      'Geyser': '♨️',
                      'Fridge': '🧊',
                      'RO': '💧',
                      'RO Water': '💧',
                      'Power Backup': '🔋',
                      'Fully Furnished': '🛌',
                    };
                    
                    const icon = amenityIcons[amenity] || '✓';
                    
                    return (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full flex items-center gap-1"
                      >
                        <span>{icon}</span>
                        {amenity}
                      </span>
                    );
                  })}
                  {property.amenities.length > 4 && (
                    <button
                      onClick={() => setExpandedAmenities(prev => ({
                        ...prev,
                        [property.id]: !prev[property.id]
                      }))}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold hover:bg-blue-200 transition-colors"
                    >
                      {expandedAmenities[property.id] 
                        ? 'Show Less' 
                        : `+${property.amenities.length - 4} More`
                      }
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-xl md:text-2xl font-bold text-gray-900">₹{property.price}</span>
                    <span className="text-sm text-gray-600">/month</span>
                  </div>
                  <Link
                    href={`/properties/${property.id}`}
                    onClick={() => analytics.viewPropertyDetails(property.id, property.name)}
                    className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${property.available
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    {property.available ? 'View Details' : 'Unavailable'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Properties Found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more results</p>
          </div>
        )}
      </div>
    </section>
  );
};
