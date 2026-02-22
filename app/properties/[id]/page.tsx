'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { useAuth } from '@/contexts/AuthContext';
import { Footer } from '@/components/Footer';
import { BookVisitModal } from '@/components/BookVisitModal';
import { RoomImageModal } from '@/components/RoomImageModal';
import { BookingModal } from '@/components/BookingModal';
import { DiscountPopup } from '@/components/DiscountPopup';
import { propertyOperations } from '@/lib/supabaseOperations';
import { Property } from '@/lib/supabase';

export default function PropertyDetailPage() {
  const params = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedRoomType, setSelectedRoomType] = useState(0);
  const [selectedRoomImages, setSelectedRoomImages] = useState<{[key: number]: number}>({ 0: 0, 1: 0, 2: 0 });
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [showRoomImageModal, setShowRoomImageModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [roomImageModalIndex, setRoomImageModalIndex] = useState(0);
  const { openAuthModal } = useAuthModal();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const data = await propertyOperations.getById(params.id as string);
        setProperty(data);
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProperty();
    }
  }, [params.id]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      openAuthModal();
    } else {
      setShowBookingModal(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h1>
          <p className="text-gray-600 mb-4">The property you're looking for doesn't exist.</p>
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-semibold">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Mock data for features not yet in database
  const mockData = {
    foodAndKitchen: {
      single: {
        foodAvailable: true,
        mealsProvided: ['Breakfast', 'Lunch (On Request Only)', 'Dinner'],
        mealType: 'Veg Only',
        foodCharges: 'Included in Rent',
        hasFridge: true,
      },
      double: {
        foodAvailable: true,
        mealsProvided: ['Breakfast', 'Lunch (On Request Only)', 'Dinner'],
        mealType: 'Veg Only',
        foodCharges: 'Included in Rent',
        hasFridge: true,
      },
      triple: {
        foodAvailable: true,
        mealsProvided: ['Breakfast', 'Lunch (On Request Only)', 'Dinner'],
        mealType: 'Veg Only',
        foodCharges: 'Included in Rent',
        hasFridge: true,
      },
    },
    otherCharges: {
      single: {
        depositAmount: 12000,
        noticePeriod: '1 Month',
        gateClosingTime: '10:00 PM',
      },
      double: {
        depositAmount: 8000,
        noticePeriod: '1 Month',
        gateClosingTime: '10:00 PM',
      },
      triple: {
        depositAmount: 6000,
        noticePeriod: '1 Month',
        gateClosingTime: '10:00 PM',
      },
    },
    rules: {
      visitorEntry: true,
      nonVegFood: false,
      oppositeGender: false,
      smoking: false,
      drinking: false,
      loudMusic: false,
      party: false,
    },
    nearbyPlaces: [
      { name: 'Sector 17 Market', distance: '2.5 km', type: 'Shopping' },
      { name: 'PGI Hospital', distance: '3.0 km', type: 'Healthcare' },
      { name: 'Chandigarh University', distance: '1.5 km', type: 'Education' },
      { name: 'Elante Mall', distance: '4.0 km', type: 'Shopping' },
    ],
    contactPhone: '+91 98765 43210'
  };

  // Ensure room images exist
  const roomTypesWithImages = property.roomTypes?.map(room => ({
    ...room,
    images: room.images && room.images.length > 0 
      ? room.images 
      : property.images && property.images.length > 0 
        ? property.images 
        : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80']
  })) || [];

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
                  src={(property.images && property.images[selectedImage]) || property.image}
                  alt={property.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2 p-4">
                {(property.images || [property.image]).map((image, index) => (
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
            <div className="bg-white rounded-2xl shadow-lg p-6 property-price-container">
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
                  <span className="font-bold text-gray-900">{property.rating || 4.5}</span>
                  <span className="text-sm text-gray-600">({property.reviews || 0} reviews)</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold">
                  {roomTypesWithImages.length} Room Types Available
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {roomTypesWithImages.map((room, index) => {
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

                      {/* Room Images */}
                      <div className="mb-4">
                        <div 
                          className="relative h-48 rounded-lg overflow-hidden mb-2 cursor-pointer group"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRoomImageModalIndex(selectedRoomImages[index] || 0);
                            setShowRoomImageModal(true);
                            setSelectedRoomType(index);
                          }}
                        >
                          <Image
                            src={room.images[selectedRoomImages[index] || 0]}
                            alt={`${room.type} room`}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
                              <svg className="w-6 h-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {room.images.map((image, imgIndex) => (
                            <button
                              key={imgIndex}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRoomImages(prev => ({ ...prev, [index]: imgIndex }));
                              }}
                              className={`relative h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                (selectedRoomImages[index] || 0) === imgIndex ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <Image src={image} alt={`View ${imgIndex + 1}`} fill className="object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-xl font-bold text-gray-900 mb-1">{room.type} Sharing</h4>
                        <p className="text-sm text-gray-600">{room.description || `${room.type} occupancy room`}</p>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-gray-900">₹{room.price}</span>
                          <span className="text-gray-600">/month</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        {(room.features || ['Attached Bathroom', 'Wardrobe', 'Mattress']).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                          </div>
                        ))}
                      </div>

                      {/* Mobile Booking Buttons - Only visible on mobile */}
                      <div className="lg:hidden space-y-2 mt-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRoomType(index);
                            handleBookNow();
                          }}
                          disabled={!room.available}
                          className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                            room.available
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {room.available ? 'Book Now' : 'Fully Booked'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRoomType(index);
                            setShowVisitModal(true);
                          }}
                          className="w-full py-3 border-2 border-blue-500 text-blue-500 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                        >
                          Schedule a Visit
                        </button>
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

            {/* Common Area and Amenities */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Common Area and Amenities</h3>
                <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {property.amenities.filter(a => a.available).length} Available
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {property.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 rounded-xl border-2 border-green-200 bg-green-50"
                  >
                    <span className="text-2xl">{amenity.icon}</span>
                    <span className="font-medium text-gray-900 text-sm">{amenity.name}</span>
                  </div>
                ))}
              </div>

            </div>

            {/* Food and Kitchen */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Food and Kitchen</h3>
              
              <div className="space-y-4">
                {/* Food Available */}
                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border-2 border-green-200">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🍽️</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">Food Available</p>
                    <p className="text-sm text-gray-600 mb-2">
                      {mockData.foodAndKitchen[roomTypesWithImages[selectedRoomType]?.type.toLowerCase() as 'single' | 'double' | 'triple']?.mealsProvided.join(', ') || 'Breakfast, Dinner'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(mockData.foodAndKitchen[roomTypesWithImages[selectedRoomType]?.type.toLowerCase() as 'single' | 'double' | 'triple']?.mealsProvided || ['Breakfast', 'Dinner']).map((meal, index) => (
                        <span key={index} className="px-3 py-1 bg-white border border-green-300 rounded-full text-xs font-medium text-gray-700">
                          {meal}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Meal Type */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🥗</span>
                    <span className="font-medium text-gray-900">Meals provided</span>
                  </div>
                  <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    {mockData.foodAndKitchen[roomTypesWithImages[selectedRoomType]?.type.toLowerCase() as 'single' | 'double' | 'triple']?.mealType || 'Veg Only'}
                  </span>
                </div>

                {/* Fridge */}
                {mockData.foodAndKitchen[roomTypesWithImages[selectedRoomType]?.type.toLowerCase() as 'single' | 'double' | 'triple']?.hasFridge && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🧊</span>
                      <span className="font-medium text-gray-900">Fridge</span>
                    </div>
                    <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}

                {/* Food Charges */}
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💰</span>
                    <span className="font-medium text-gray-900">Food Charges</span>
                  </div>
                  <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    {mockData.foodAndKitchen[roomTypesWithImages[selectedRoomType]?.type.toLowerCase() as 'single' | 'double' | 'triple']?.foodCharges || 'Included in Rent'}
                  </span>
                </div>
              </div>

            </div>

            {/* Other Charges */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Other Charges</h3>
              
              <div className="space-y-4">
                {/* Deposit Amount */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💵</span>
                    <span className="font-medium text-gray-900">Deposit Amount</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">
                    ₹{(mockData.otherCharges[roomTypesWithImages[selectedRoomType]?.type.toLowerCase() as 'single' | 'double' | 'triple']?.depositAmount || roomTypesWithImages[selectedRoomType]?.price || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* House Rules */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">House Rules</h3>
              
              <div className="space-y-4">
                {/* Notice Period */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📅</span>
                    <span className="font-medium text-gray-900">Notice Period</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {mockData.otherCharges[roomTypesWithImages[selectedRoomType]?.type.toLowerCase() as 'single' | 'double' | 'triple']?.noticePeriod || '1 Month'}
                  </span>
                </div>

                {/* Rules Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
                  <div className={`p-4 rounded-xl border-2 ${mockData.rules.visitorEntry ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{mockData.rules.visitorEntry ? '✅' : '❌'}</span>
                      <span className="font-medium text-gray-900 text-sm">Visitor Entry</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {mockData.rules.visitorEntry ? 'Allowed' : 'Not Allowed'}
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl border-2 ${mockData.rules.loudMusic ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{mockData.rules.loudMusic ? '✅' : '❌'}</span>
                      <span className="font-medium text-gray-900 text-sm">Loud Music</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {mockData.rules.loudMusic ? 'Allowed' : 'Not Allowed'}
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl border-2 ${mockData.rules.party ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{mockData.rules.party ? '✅' : '❌'}</span>
                      <span className="font-medium text-gray-900 text-sm">Party</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {mockData.rules.party ? 'Allowed' : 'Not Allowed'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Nearby Places */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Nearby Places</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(property.nearbyPlaces || mockData.nearbyPlaces).map((place, index) => (
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
                </div>
                
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
                  onClick={handleBookNow}
                  disabled={!property.roomTypes[selectedRoomType].available}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 mb-4 ${
                    property.roomTypes[selectedRoomType].available
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {property.roomTypes[selectedRoomType].available ? 'Book Now' : 'Not Available'}
                </button>

                <button
                  onClick={() => setShowVisitModal(true)}
                  className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mb-3"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Schedule a Visit
                </button>

                <a
                  href={`tel:${property.contactPhone || mockData.contactPhone}`}
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
      
      {/* Book Visit Modal */}
      <BookVisitModal
        isOpen={showVisitModal}
        onClose={() => setShowVisitModal(false)}
        propertyId={property.id as string}
        propertyName={property.name}
      />

      {/* Room Image Modal */}
      {roomTypesWithImages[selectedRoomType] && (
        <RoomImageModal
          isOpen={showRoomImageModal}
          onClose={() => setShowRoomImageModal(false)}
          images={roomTypesWithImages[selectedRoomType].images || []}
          roomType={roomTypesWithImages[selectedRoomType].type}
          initialImageIndex={roomImageModalIndex}
        />
      )}

      {/* Booking Modal */}
      {roomTypesWithImages[selectedRoomType] && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          propertyId={property.id as string}
          propertyName={property.name}
          roomType={roomTypesWithImages[selectedRoomType].type}
          price={roomTypesWithImages[selectedRoomType].price}
          depositAmount={mockData.otherCharges[roomTypesWithImages[selectedRoomType].type.toLowerCase() as 'single' | 'double' | 'triple']?.depositAmount || roomTypesWithImages[selectedRoomType].price}
        />
      )}

      {/* Discount Popup */}
      <DiscountPopup />
    </div>
  );
}
