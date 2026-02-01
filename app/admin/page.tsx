'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PropertyForm } from '@/components/PropertyForm';

interface Property {
  id: string;
  name: string;
  city: string;
  location: string;
  address: string;
  roomTypes: {
    type: string;
    price: number;
    available: boolean;
    totalSlots: number;
    occupiedSlots: number;
    availableSlots: number;
  }[];
  rating: number;
  reviews: number;
  status: 'active' | 'inactive';
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Mock properties data
  const [properties, setProperties] = useState<Property[]>([
    {
      id: '1',
      name: 'Sunshine PG',
      city: 'Chandigarh',
      location: 'Sector 22',
      address: 'House No. 123, Sector 22-C, Chandigarh, 160022',
      roomTypes: [
        { type: 'Single', price: 12000, available: true, totalSlots: 10, occupiedSlots: 8, availableSlots: 2 },
        { type: 'Double', price: 8000, available: true, totalSlots: 15, occupiedSlots: 10, availableSlots: 5 },
        { type: 'Triple', price: 6000, available: false, totalSlots: 8, occupiedSlots: 8, availableSlots: 0 },
      ],
      rating: 4.8,
      reviews: 124,
      status: 'active',
    },
    {
      id: '2',
      name: 'Green Valley PG',
      city: 'Mohali',
      location: 'Phase 7',
      address: 'Plot No. 456, Phase 7, Mohali, 160062',
      roomTypes: [
        { type: 'Single', price: 10000, available: true, totalSlots: 8, occupiedSlots: 7, availableSlots: 1 },
        { type: 'Double', price: 7000, available: true, totalSlots: 12, occupiedSlots: 5, availableSlots: 7 },
      ],
      rating: 4.5,
      reviews: 89,
      status: 'active',
    },
    {
      id: '3',
      name: 'Royal Residency',
      city: 'Panchkula',
      location: 'Sector 15',
      address: 'House No. 789, Sector 15, Panchkula, 134109',
      roomTypes: [
        { type: 'Single', price: 11000, available: false, totalSlots: 6, occupiedSlots: 6, availableSlots: 0 },
        { type: 'Double', price: 7500, available: true, totalSlots: 10, occupiedSlots: 3, availableSlots: 7 },
        { type: 'Triple', price: 5500, available: true, totalSlots: 12, occupiedSlots: 8, availableSlots: 4 },
      ],
      rating: 4.6,
      reviews: 156,
      status: 'inactive',
    },
    {
      id: '4',
      name: 'City Center PG',
      city: 'Chandigarh',
      location: 'Sector 17',
      address: 'Building A, Sector 17, Chandigarh, 160017',
      roomTypes: [
        { type: 'Single', price: 15000, available: true, totalSlots: 5, occupiedSlots: 3, availableSlots: 2 },
        { type: 'Double', price: 10000, available: true, totalSlots: 8, occupiedSlots: 2, availableSlots: 6 },
      ],
      rating: 4.9,
      reviews: 203,
      status: 'active',
    },
    {
      id: '5',
      name: 'Student Hub PG',
      city: 'Zirakpur',
      location: 'VIP Road',
      address: 'Near Chandigarh University, VIP Road, Zirakpur, 140603',
      roomTypes: [
        { type: 'Double', price: 6500, available: true, totalSlots: 20, occupiedSlots: 12, availableSlots: 8 },
        { type: 'Triple', price: 5000, available: true, totalSlots: 15, occupiedSlots: 14, availableSlots: 1 },
      ],
      rating: 4.3,
      reviews: 67,
      status: 'active',
    },
    {
      id: '6',
      name: 'Comfort Stay PG',
      city: 'Mohali',
      location: 'Phase 11',
      address: 'SCO 234, Phase 11, Mohali, 160062',
      roomTypes: [
        { type: 'Single', price: 9500, available: true, totalSlots: 7, occupiedSlots: 4, availableSlots: 3 },
        { type: 'Double', price: 6500, available: false, totalSlots: 10, occupiedSlots: 10, availableSlots: 0 },
      ],
      rating: 4.4,
      reviews: 92,
      status: 'active',
    },
  ]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check (in production, use proper authentication)
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  const handleDeleteProperty = (id: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      setProperties(properties.filter(p => p.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setProperties(properties.map(p => 
      p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p
    ));
  };

  // Filter properties based on search and filters
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = filterCity === 'all' || property.city === filterCity;
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    
    return matchesSearch && matchesCity && matchesStatus;
  });

  // Calculate low inventory alerts (3 or fewer slots available)
  const lowInventoryCount = properties.reduce((count, property) => {
    const hasLowInventory = property.roomTypes.some(rt => rt.availableSlots > 0 && rt.availableSlots <= 3);
    return count + (hasLowInventory ? 1 : 0);
  }, 0);

  // Get properties with critical inventory (1 or fewer slots)
  const criticalInventoryProperties = properties.filter(property => 
    property.roomTypes.some(rt => rt.availableSlots > 0 && rt.availableSlots <= 1)
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-2xl">
              🔐
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Enter admin password"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Login to Dashboard
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-xl">
                🏠
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">pgUncle Admin</h1>
                <p className="text-sm text-gray-600">Property Management Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                View Site
              </Link>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Total Properties</span>
              <span className="text-2xl">🏠</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{properties.length}</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Active</span>
              <span className="text-2xl">✅</span>
            </div>
            <div className="text-3xl font-bold text-green-600">
              {properties.filter(p => p.status === 'active').length}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Low Inventory</span>
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="text-3xl font-bold text-orange-600">
              {lowInventoryCount}
            </div>
            <p className="text-xs text-gray-500 mt-1">≤3 slots available</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Avg Rating</span>
              <span className="text-2xl">⭐</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {properties.length > 0 
                ? (properties.reduce((acc, p) => acc + p.rating, 0) / properties.length).toFixed(1)
                : '0.0'
              }
            </div>
          </div>
        </div>

        {/* Critical Inventory Alerts */}
        {criticalInventoryProperties.length > 0 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl">⚠️</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-900 mb-2">Critical Inventory Alert!</h3>
                <p className="text-red-700 mb-3">The following properties have 1 or fewer slots available:</p>
                <div className="space-y-2">
                  {criticalInventoryProperties.map(property => (
                    <div key={property.id} className="bg-white rounded-lg p-3 border border-red-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{property.name}</p>
                          <div className="flex gap-3 mt-1">
                            {property.roomTypes
                              .filter(rt => rt.availableSlots > 0 && rt.availableSlots <= 1)
                              .map((rt, idx) => (
                                <span key={idx} className="text-sm text-red-600 font-medium">
                                  {rt.type}: {rt.availableSlots} slot{rt.availableSlots !== 1 ? 's' : ''} left
                                </span>
                              ))}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedProperty(property);
                            setShowEditModal(true);
                          }}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-semibold"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Properties</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Add New Property
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Properties
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, location, or address..."
                  className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by City
              </label>
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              >
                <option value="all">All Cities</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Mohali">Mohali</option>
                <option value="Panchkula">Panchkula</option>
                <option value="Zirakpur">Zirakpur</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredProperties.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{properties.length}</span> properties
            </p>
          </div>
        </div>

        {/* Properties Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Property</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Inventory</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rating</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProperties.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-gray-500 text-lg font-medium">No properties found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900">{property.name}</div>
                        <div className="text-sm text-gray-600">{property.address}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{property.city}</div>
                        <div className="text-gray-600">{property.location}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {property.roomTypes.map((room, idx) => {
                          const occupancyRate = (room.occupiedSlots / room.totalSlots) * 100;
                          const isLowInventory = room.availableSlots > 0 && room.availableSlots <= 3;
                          const isCritical = room.availableSlots > 0 && room.availableSlots <= 1;
                          
                          return (
                            <div key={idx} className="text-sm">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-gray-900">{room.type}</span>
                                <span className={`text-xs font-semibold ${
                                  isCritical ? 'text-red-600' : isLowInventory ? 'text-orange-600' : 'text-green-600'
                                }`}>
                                  {room.availableSlots}/{room.totalSlots} available
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                                <div
                                  className={`h-2 rounded-full transition-all ${
                                    occupancyRate >= 90 ? 'bg-red-500' :
                                    occupancyRate >= 70 ? 'bg-orange-500' :
                                    'bg-green-500'
                                  }`}
                                  style={{ width: `${occupancyRate}%` }}
                                />
                              </div>
                              <div className="flex items-center justify-between text-xs text-gray-600">
                                <span>₹{room.price}/mo</span>
                                <span>{occupancyRate.toFixed(0)}% occupied</span>
                              </div>
                              {isCritical && (
                                <div className="mt-1 flex items-center gap-1 text-xs text-red-600 font-semibold">
                                  <span>⚠️</span>
                                  <span>Critical - Only {room.availableSlots} left!</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="text-blue-500">⭐</span>
                        <span className="font-semibold text-gray-900">{property.rating}</span>
                        <span className="text-sm text-gray-600">({property.reviews})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(property.id)}
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          property.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {property.status === 'active' ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedProperty(property);
                            setShowEditModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(property.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Property Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0 bg-white rounded-t-2xl">
              <h3 className="text-2xl font-bold text-gray-900">
                {showAddModal ? 'Add New Property' : 'Edit Property'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setSelectedProperty(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 scrollbar-hide">
              <PropertyForm
                initialData={selectedProperty ? {
                  name: selectedProperty.name,
                  city: selectedProperty.city,
                  location: selectedProperty.location,
                  address: selectedProperty.address,
                  coordinates: { lat: 30.7333, lng: 76.7794 },
                  description: 'Property description',
                  roomTypes: selectedProperty.roomTypes.map(rt => ({
                    ...rt,
                    description: '',
                    features: [],
                  })),
                  amenities: [
                    { name: 'Wi-Fi', icon: '📶', available: true },
                    { name: 'AC', icon: '❄️', available: true },
                    { name: 'Meals', icon: '🍽️', available: true },
                    { name: 'Laundry', icon: '🧺', available: true },
                    { name: 'Parking', icon: '🚗', available: true },
                    { name: 'Gym', icon: '💪', available: false },
                    { name: 'Security', icon: '🔒', available: true },
                    { name: 'Housekeeping', icon: '🧹', available: true },
                  ],
                  rules: ['No smoking', 'Visitors allowed till 9 PM'],
                  images: ['https://media.gettyimages.com/id/889777132/photo/rooms-to-rent.jpg'],
                  contactPhone: '+91 98765 43210',
                } : undefined}
                onSubmit={(data) => {
                  if (showEditModal && selectedProperty) {
                    // Update existing property
                    setProperties(properties.map(p => 
                      p.id === selectedProperty.id 
                        ? {
                            ...p,
                            name: data.name,
                            city: data.city,
                            location: data.location,
                            address: data.address,
                            roomTypes: data.roomTypes.map(rt => ({
                              type: rt.type,
                              price: rt.price,
                              available: rt.available,
                              totalSlots: rt.totalSlots,
                              occupiedSlots: rt.occupiedSlots,
                              availableSlots: rt.availableSlots,
                            })),
                          }
                        : p
                    ));
                    alert('Property updated successfully!');
                  } else {
                    // Add new property
                    const newProperty: Property = {
                      id: (properties.length + 1).toString(),
                      name: data.name,
                      city: data.city,
                      location: data.location,
                      address: data.address,
                      roomTypes: data.roomTypes.map(rt => ({
                        type: rt.type,
                        price: rt.price,
                        available: rt.available,
                        totalSlots: rt.totalSlots,
                        occupiedSlots: rt.occupiedSlots,
                        availableSlots: rt.availableSlots,
                      })),
                      rating: 0,
                      reviews: 0,
                      status: 'active',
                    };
                    setProperties([...properties, newProperty]);
                    alert('Property added successfully!');
                  }
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setSelectedProperty(null);
                }}
                onCancel={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setSelectedProperty(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
