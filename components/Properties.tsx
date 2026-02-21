'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProperties } from '@/hooks/useProperties';

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
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const { properties, loading, error } = useProperties();

  const cities = ['All', 'Chandigarh', 'Mohali', 'Panchkula', 'Zirakpur'];
  const types = ['All', 'Single', 'Double', 'Triple', 'Quad'];
  const genders = ['All', 'Boys', 'Girls'];

  // Transform data to match component interface
  const transformedProperties: PropertyDisplay[] = properties.map((prop) => ({
    id: prop.id,
    name: prop.name,
    city: prop.city,
    location: prop.address,
    price: prop.price,
    type: prop.roomTypes?.[0]?.type || 'Single',
    gender: prop.gender || 'Boys',
    image: prop.images?.[0] || prop.image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    rating: prop.rating || 4.5,
    reviews: prop.reviews || 0,
    amenities: prop.amenities?.filter(a => a.available).map(a => a.name) || [],
    available: prop.isActive,
  }));

  const filteredProperties = transformedProperties.filter((property) => {
    const cityMatch = selectedCity === 'All' || property.city === selectedCity;
    const typeMatch = selectedType === 'All' || property.type === selectedType;
    const genderMatch = selectedGender === 'All' || property.gender === selectedGender;
    return cityMatch && typeMatch && genderMatch;
  });

  // Show loading state
  if (loading) {
    return (
      <section id="properties" className="py-16 lg:py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-5 md:px-6">
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            <p className="mt-4 text-xl text-gray-600">Loading properties...</p>
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
          <div className="text-center py-16 bg-red-50 rounded-2xl px-8">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-red-900 mb-2">Database Connection Error</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-sm text-gray-600">Please try again later or contact support</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="properties" className="py-16 lg:py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-5 md:px-6">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 rounded-full">
            <span className="text-blue-600 text-sm font-semibold">AVAILABLE PROPERTIES</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Find Your <span className="text-blue-600">Perfect PG</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            Finding the right PG is more than just four walls and a bed.
            It's about feeling safe, comfortable, and stress-free—especially when you're away from home.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
            <span className="text-green-600 text-sm font-semibold">
              ✓ {transformedProperties.length} properties available
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 mb-12">
          {/* Gender Filter - Prominent */}
          <div className="flex justify-center">
            <div className="inline-flex gap-3 p-2 bg-white rounded-2xl shadow-lg">
              {genders.map((gender) => (
                <button
                  key={gender}
                  onClick={() => setSelectedGender(gender)}
                  className={`px-8 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                    selectedGender === gender
                      ? gender === 'Boys'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                        : gender === 'Girls'
                        ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg'
                        : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {gender === 'Boys' && '🧔 '}
                  {gender === 'Girls' && '👩 '}
                  {gender}
                </button>
              ))}
            </div>
          </div>

          {/* City and Type Filters */}
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="text-sm font-medium text-gray-700 flex items-center">City:</span>
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
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

            <div className="flex flex-wrap gap-2 justify-center">
              <span className="text-sm font-medium text-gray-700 flex items-center">Type:</span>
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedType === type
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {selectedGender === 'Girls' ? (
          // Coming Soon for Girls
          <div className="text-center py-24">
            <div className="max-w-2xl mx-auto">
              <div className="w-32 h-32 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <span className="text-6xl">👩</span>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-4">Girls PG Coming Soon!</h3>
              <p className="text-xl text-gray-600 mb-8">
                We're working hard to bring you the best PG accommodations for girls. 
                Stay tuned for verified, safe, and comfortable options.
              </p>
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-pink-50 border-2 border-pink-200 rounded-xl">
                <svg className="w-6 h-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-pink-700 font-semibold">Launching Soon</span>
              </div>
            </div>
          </div>
        ) : (
          // Show properties for Boys or All
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={property.image}
                  alt={property.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {!property.available && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                      Not Available
                    </span>
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className={`text-sm font-semibold ${property.gender === 'Girls' ? 'text-pink-600' : 'text-blue-600'}`}>
                    {property.gender === 'Girls' ? '👩 Girls' : '🧔 Boys'}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-sm font-semibold text-gray-900">{property.type} Sharing</span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {property.name}
                    </h3>
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
                  {property.amenities.slice(0, 4).map((amenity, index) => {
                    // Map amenities to icons
                    const amenityIcons: { [key: string]: string } = {
                      'WiFi': '📶',
                      'AC': '❄️',
                      'Laundry': '🧺',
                      'Meals': '🍽️',
                      'Parking': '🅿️',
                      'Security': '🔒',
                      'Housekeeping': '🧹',
                      'Geyser`': '♨️',
                      'Fridge': '🧊',
                      'RO Water': '💧',
                      'Power Backup': '🔋',
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
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                      +{property.amenities.length - 4} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">₹{property.price}</span>
                    <span className="text-sm text-gray-600">/month</span>
                  </div>
                  <Link
                    href={`/properties/${property.id}`}
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

        {filteredProperties.length === 0 && selectedGender !== 'Girls' && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Properties Found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more results</p>
          </div>
        )}
          </>
        )}
      </div>
    </section>
  );
};
