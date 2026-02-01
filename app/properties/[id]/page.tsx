'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { Footer } from '@/components/Footer';

export default function PropertyDetailPage() {
  const params = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedRoomType, setSelectedRoomType] = useState(0);
  const { openAuthModal } = useAuthModal();

  // Mock property data - in real app, fetch based on params.id
  const property = {
    id: params.id,
    name: 'Sunshine PG',
    city: 'Chandigarh',
    location: 'Sector 22',
    address: 'House No. 123, Sector 22-C, Chandigarh, 160022',
    coordinates: {
      lat: 30.7333,
      lng: 76.7794,
    },
    roomTypes: [
      {
        type: 'Single',
        price: 12000,
        available: true,
        description: 'Private room with attached bathroom',
        features: ['1 Person', 'Attached Bathroom', 'AC', 'Study Table', 'Wardrobe'],
        totalSlots: 10,
        occupiedSlots: 8,
        availableSlots: 2,
      },
      {
        type: 'Double',
        price: 8000,
        available: true,
        description: 'Shared room for 2 people',
        features: ['2 People', 'Shared Bathroom', 'AC', 'Study Table', 'Wardrobe'],
        totalSlots: 15,
        occupiedSlots: 10,
        availableSlots: 5,
      },
      {
        type: 'Triple',
        price: 6000,
        available: false,
        description: 'Shared room for 3 people',
        features: ['3 People', 'Shared Bathroom', 'Fan', 'Study Table', 'Wardrobe'],
        totalSlots: 8,
        occupiedSlots: 8,
        availableSlots: 0,
      },
    ],
    rating: 4.8,
    reviews: 124,
    description: 'Welcome to Sunshine PG, a premium paying guest accommodation in the heart of Chandigarh. Our facility offers comfortable living spaces with modern amenities, perfect for students and working professionals. Located in Sector 22, you\'ll have easy access to markets, restaurants, and public transport.',
    amenities: [
      { name: 'Wi-Fi', icon: '�', available: true },
      { name: 'AC', icon: '❄️', available: true },
      { name: 'Meals', icon: '🍽️', available: true },
      { name: 'Laundry', icon: '�', available: true },
      { name: 'Parking', icon: '🚗', available: true },
      { name: 'Gym', icon: '💪', available: false },
      { name: 'Security', icon: '🔒', available: true },
      { name: 'Housekeeping', icon: '🧹', available: true },
    ],
    images: [
      'https://media.gettyimages.com/id/889777132/photo/rooms-to-rent.jpg',
      'https://media.gettyimages.com/id/889777132/photo/rooms-to-rent.jpg',
      'https://media.gettyimages.com/id/889777132/photo/rooms-to-rent.jpg',
      'https://media.gettyimages.com/id/889777132/photo/rooms-to-rent.jpg',
    ],
    rules: [
      'No smoking inside the premises',
      'Visitors allowed till 9 PM',
      'Maintain cleanliness',
      'No loud music after 10 PM',
      'Respect other residents',
    ],
    nearbyPlaces: [
      { name: 'Sector 17 Market', distance: '2.5 km', type: 'Shopping' },
      { name: 'PGI Hospital', distance: '3.0 km', type: 'Healthcare' },
      { name: 'Chandigarh University', distance: '1.5 km', type: 'Education' },
      { name: 'Elante Mall', distance: '4.0 km', type: 'Shopping' },
    ],
    contactPhone: '+91 98765 43210',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-5 md:px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link href="/#properties" className="hover:text-blue-600">Properties</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{property.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-5 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative h-96">
                <Image
                  src={property.images[selectedImage]}
                  alt={property.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2 p-4">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image src={image} alt={`View ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.name}</h1>
                  <p className="text-gray-600 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {property.address}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-xl">
                  <svg className="w-5 h-5 text-blue-500 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                  <span className="font-bold text-gray-900">{property.rating}</span>
                  <span className="text-sm text-gray-600">({property.reviews} reviews)</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold">
                  {property.roomTypes.length} Room Types Available
                </span>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-xl font-bold text-gray-900 mb-3">About this PG</h3>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>
            </div>

            {/* Room Types & Pricing */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Room Types & Pricing</h3>
              
              {/* Low Inventory Alert */}
              {property.roomTypes.some(rt => rt.availableSlots > 0 && rt.availableSlots <= 3) && (
                <div className="mb-6 p-4 bg-orange-50 border-2 border-orange-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <h4 className="font-bold text-orange-900 mb-1">Limited Availability!</h4>
                      <p className="text-sm text-orange-700">
                        Some room types are filling up fast. Book now to secure your spot!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {property.roomTypes.map((room, index) => {
                  const isLowInventory = room.availableSlots > 0 && room.availableSlots <= 3;
                  const isCritical = room.availableSlots > 0 && room.availableSlots <= 1;
                  
                  return (
                    <div
                      key={index}
                      onClick={() => room.available && setSelectedRoomType(index)}
                      className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        selectedRoomType === index
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : room.available
                          ? 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                          : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      {!room.available && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                            Fully Booked
                          </span>
                        </div>
                      )}
                      
                      {room.available && isLowInventory && (
                        <div className="absolute top-3 right-3">
                          <span className={`${isCritical ? 'bg-red-500' : 'bg-orange-500'} text-white text-xs px-2 py-1 rounded-full font-semibold animate-pulse`}>
                            {isCritical ? '🔥 Last Spot!' : '⚡ Filling Fast'}
                          </span>
                        </div>
                      )}

                      <div className="mb-4">
                        <h4 className="text-xl font-bold text-gray-900 mb-1">{room.type} Sharing</h4>
                        <p className="text-sm text-gray-600">{room.description}</p>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-gray-900">₹{room.price}</span>
                          <span className="text-gray-600">/month</span>
                        </div>
                      </div>

                      {/* Availability Indicator */}
                      {room.available && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-600">Availability</span>
                            <span className={`text-xs font-bold ${
                              isCritical ? 'text-red-600' : isLowInventory ? 'text-orange-600' : 'text-green-600'
                            }`}>
                              {room.availableSlots} of {room.totalSlots} slots
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                isCritical ? 'bg-red-500' : isLowInventory ? 'bg-orange-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${(room.availableSlots / room.totalSlots) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        {room.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                          </div>
                        ))}
                      </div>
                      
                      {selectedRoomType === index && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 ${
                      amenity.available
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-gray-50 opacity-50'
                    }`}
                  >
                    <span className="text-2xl">{amenity.icon}</span>
                    <span className="font-medium text-gray-900">{amenity.name}</span>
                    {amenity.available && (
                      <svg className="w-5 h-5 text-green-500 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">House Rules</h3>
              <ul className="space-y-3">
                {property.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Nearby Places */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Nearby Places</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.nearbyPlaces.map((place, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📍</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{place.name}</p>
                      <p className="text-sm text-gray-600">{place.distance} • {place.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Google Maps */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Location</h3>
              <div className="relative w-full h-96 rounded-xl overflow-hidden">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${property.coordinates.lat},${property.coordinates.lng}&zoom=15`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-xl"
                />
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">{property.name}</p>
                    <p className="text-gray-600">{property.address}</p>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${property.coordinates.lat},${property.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Get Directions
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Booking Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-2">Selected Room Type</p>
                  <p className="text-lg font-bold text-gray-900">
                    {property.roomTypes[selectedRoomType].type} Sharing
                  </p>
                  
                  {/* Availability Status */}
                  {property.roomTypes[selectedRoomType].available && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Availability</span>
                        <span className={`text-xs font-bold ${
                          property.roomTypes[selectedRoomType].availableSlots <= 1 ? 'text-red-600' :
                          property.roomTypes[selectedRoomType].availableSlots <= 3 ? 'text-orange-600' :
                          'text-green-600'
                        }`}>
                          {property.roomTypes[selectedRoomType].availableSlots} slots left
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            property.roomTypes[selectedRoomType].availableSlots <= 1 ? 'bg-red-500' :
                            property.roomTypes[selectedRoomType].availableSlots <= 3 ? 'bg-orange-500' :
                            'bg-green-500'
                          }`}
                          style={{ 
                            width: `${(property.roomTypes[selectedRoomType].availableSlots / property.roomTypes[selectedRoomType].totalSlots) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Low Inventory Alert in Sidebar */}
                {property.roomTypes[selectedRoomType].available && 
                 property.roomTypes[selectedRoomType].availableSlots <= 3 && (
                  <div className={`mb-4 p-3 rounded-lg ${
                    property.roomTypes[selectedRoomType].availableSlots <= 1 
                      ? 'bg-red-50 border border-red-200' 
                      : 'bg-orange-50 border border-orange-200'
                  }`}>
                    <div className="flex items-start gap-2">
                      <span className="text-lg">
                        {property.roomTypes[selectedRoomType].availableSlots <= 1 ? '🔥' : '⚡'}
                      </span>
                      <div>
                        <p className={`text-sm font-bold ${
                          property.roomTypes[selectedRoomType].availableSlots <= 1 
                            ? 'text-red-900' 
                            : 'text-orange-900'
                        }`}>
                          {property.roomTypes[selectedRoomType].availableSlots <= 1 
                            ? 'Last Spot Available!' 
                            : 'Filling Fast!'}
                        </p>
                        <p className={`text-xs ${
                          property.roomTypes[selectedRoomType].availableSlots <= 1 
                            ? 'text-red-700' 
                            : 'text-orange-700'
                        }`}>
                          Only {property.roomTypes[selectedRoomType].availableSlots} slot{property.roomTypes[selectedRoomType].availableSlots !== 1 ? 's' : ''} remaining. Book now!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-gray-900">
                      ₹{property.roomTypes[selectedRoomType].price}
                    </span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <p className="text-sm text-gray-500">Inclusive of all charges</p>
                </div>

                <button
                  onClick={openAuthModal}
                  disabled={!property.roomTypes[selectedRoomType].available}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 mb-4 ${
                    property.roomTypes[selectedRoomType].available
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {property.roomTypes[selectedRoomType].available ? 'Book Now' : 'Not Available'}
                </button>

                <a
                  href={`tel:${property.contactPhone}`}
                  className="w-full py-4 rounded-xl font-bold text-lg border-2 border-blue-500 text-blue-600 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Contact Us
                </a>

                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">Need Help?</p>
                      <p>Call us for property inquiries, booking assistance, or any questions.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
