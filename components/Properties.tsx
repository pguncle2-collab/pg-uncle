'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Property {
  id: number;
  name: string;
  city: string;
  location: string;
  price: number;
  type: string;
  image: string;
  rating: number;
  reviews: number;
  amenities: string[];
  available: boolean;
}

export const Properties: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');

  const cities = ['All', 'Chandigarh', 'Mohali', 'Panchkula', 'Zirakpur'];
  const types = ['All', 'Single', 'Double', 'Triple'];

  const properties: Property[] = [
    {
      id: 1,
      name: 'Sunshine PG',
      city: 'Chandigarh',
      location: 'Sector 22',
      price: 8000,
      type: 'Single',
      image: 'https://media.gettyimages.com/id/889777132/photo/rooms-to-rent.jpg',
      rating: 4.8,
      reviews: 124,
      amenities: ['Wi-Fi', 'AC', 'Meals', 'Laundry'],
      available: true,
    },
    {
      id: 2,
      name: 'Green Valley PG',
      city: 'Mohali',
      location: 'Phase 7',
      price: 6500,
      type: 'Double',
      image: 'https://media.gettyimages.com/id/889777132/photo/rooms-to-rent.jpg',
      rating: 4.6,
      reviews: 89,
      amenities: ['Wi-Fi', 'Meals', 'Parking'],
      available: true,
    },
    {
      id: 3,
      name: 'Royal Residency',
      city: 'Chandigarh',
      location: 'Sector 35',
      price: 12000,
      type: 'Single',
      image: 'https://media.gettyimages.com/id/889777132/photo/rooms-to-rent.jpg',
      rating: 4.9,
      reviews: 156,
      amenities: ['Wi-Fi', 'AC', 'Gym', 'Meals', 'Laundry'],
      available: true,
    },
    {
      id: 4,
      name: 'Student Hub PG',
      city: 'Panchkula',
      location: 'Sector 20',
      price: 5500,
      type: 'Triple',
      image: 'https://media.gettyimages.com/id/889777132/photo/rooms-to-rent.jpg',
      rating: 4.4,
      reviews: 67,
      amenities: ['Wi-Fi', 'Meals', 'Study Room'],
      available: true,
    },
    {
      id: 5,
      name: 'Comfort Stay',
      city: 'Zirakpur',
      location: 'VIP Road',
      price: 7000,
      type: 'Double',
      image: 'https://media.gettyimages.com/id/889777132/photo/rooms-to-rent.jpg',
      rating: 4.7,
      reviews: 98,
      amenities: ['Wi-Fi', 'AC', 'Meals'],
      available: false,
    },
    {
      id: 6,
      name: 'Elite PG',
      city: 'Chandigarh',
      location: 'Sector 17',
      price: 10000,
      type: 'Single',
      image: 'https://media.gettyimages.com/id/889777132/photo/rooms-to-rent.jpg',
      rating: 4.8,
      reviews: 142,
      amenities: ['Wi-Fi', 'AC', 'Gym', 'Meals', 'Laundry', 'Parking'],
      available: true,
    },
  ];

  const filteredProperties = properties.filter((property) => {
    const cityMatch = selectedCity === 'All' || property.city === selectedCity;
    const typeMatch = selectedType === 'All' || property.type === selectedType;
    return cityMatch && typeMatch;
  });

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
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Finding the right PG is more than just four walls and a bed.
            It’s about feeling safe, comfortable, and stress-free—especially when you’re away from home.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 justify-center items-center">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 flex items-center">City:</span>
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCity === city
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                {city}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 flex items-center">Type:</span>
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedType === type
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Properties Grid */}
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
                  {property.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
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
