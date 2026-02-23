'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PropertyForm } from '@/components/PropertyForm';
import { useProperties } from '@/hooks/useProperties';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Use properties hook - only fetch when authenticated
  const { properties, loading, error, addProperty, updateProperty, deleteProperty, togglePropertyActive, fetchProperties } = useProperties(false);
  
  // Local error state for admin-specific errors
  const [adminError, setAdminError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      // Fetch properties after successful login
      setTimeout(() => {
        fetchProperties();
      }, 100);
    } else {
      alert('Invalid password');
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      await deleteProperty(id);
    }
  };

  const handleToggleStatus = async (id: string) => {
    const property = properties.find(p => p.id === id);
    console.log('Toggle status clicked for property:', id);
    console.log('Current property:', property);
    console.log('Current isActive:', property?.isActive);
    console.log('Will toggle to:', !property?.isActive);
    
    if (property) {
      try {
        const result = await togglePropertyActive(id, !property.isActive);
        console.log('Toggle result:', result);
        alert(`Property status changed to: ${!property.isActive ? 'Active' : 'Inactive'}`);
      } catch (error) {
        console.error('Error toggling status:', error);
        alert(`Failed to toggle status: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  // Filter properties based on search and filters
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = filterCity === 'all' || property.city === filterCity;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && property.isActive) ||
                         (filterStatus === 'inactive' && !property.isActive);
    
    return matchesSearch && matchesCity && matchesStatus;
  });

  // Calculate low inventory alerts (3 or fewer slots available)
  const lowInventoryCount = properties.reduce((count, property) => {
    const hasLowInventory = property.roomTypes?.some(rt => rt.availableSlots > 0 && rt.availableSlots <= 3);
    return count + (hasLowInventory ? 1 : 0);
  }, 0);

  // Get properties with critical inventory (1 or fewer slots)
  const criticalInventoryProperties = properties.filter(property => 
    property.roomTypes?.some(rt => rt.availableSlots > 0 && rt.availableSlots <= 1)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-xl text-gray-600 mb-4">Loading properties...</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Taking too long? Click to refresh
          </button>
        </div>
      </div>
    );
  }

  if (error || adminError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-md">
          <div className="text-6xl mb-4 text-center">⚠️</div>
          <h3 className="text-2xl font-bold text-red-900 mb-2 text-center">Database Error</h3>
          <p className="text-red-600 text-center mb-4">{error || adminError}</p>
          
          {/* Check if it's a timeout/pause error */}
          {((error || adminError || '').includes('timeout') || (error || adminError || '').includes('paused')) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-900 font-semibold mb-2">💡 Quick Fix:</p>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal ml-4">
                <li>Your Supabase project may be paused (free tier)</li>
                <li>Click the button below to open Supabase Dashboard</li>
                <li>Click "Restore Project" if you see it</li>
                <li>Wait 1-2 minutes and click "Retry" here</li>
              </ol>
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                setAdminError(null);
                fetchProperties();
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
            >
              🔄 Retry Connection
            </button>
            
            {((error || adminError || '').includes('timeout') || (error || adminError || '').includes('paused')) && (
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-center font-semibold"
              >
                🚀 Open Supabase Dashboard
              </a>
            )}
            
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setAdminError(null);
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold"
            >
              ← Back to Login
            </button>
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
                <h1 className="text-2xl font-bold text-gray-900">PGUNCLE Admin</h1>
                <p className="text-sm text-gray-600">Property Management Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={async () => {
                  const startTime = Date.now();
                  try {
                    await fetchProperties();
                    const duration = Date.now() - startTime;
                    alert(`✅ Database Connected!\nResponse time: ${duration}ms`);
                  } catch (err) {
                    alert('❌ Database connection failed. Please check if your Supabase project is paused.');
                  }
                }}
                className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-medium border border-blue-200"
                title="Test database connection"
              >
                🔍 Test Connection
              </button>
              <div className="text-sm text-green-600 font-semibold">
                ✓ System Connected
              </div>
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
              {properties.filter(p => p.isActive).length}
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
                ? (properties.reduce((acc, p) => acc + (p.rating || 0), 0) / properties.length).toFixed(1)
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
                              ?.filter(rt => rt.availableSlots > 0 && rt.availableSlots <= 1)
                              .map((rt, idx) => (
                                <span key={idx} className="text-sm text-red-600 font-medium">
                                  {rt.type}: {rt.availableSlots} slot{rt.availableSlots !== 1 ? 's' : ''} left
                                </span>
                              ))}
                          </div>
                        </div>
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
                  placeholder="Search by name or address..."
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
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
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        ₹{property.price}/mo
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="text-blue-500">⭐</span>
                        <span className="font-semibold text-gray-900">{property.rating || 0}</span>
                        <span className="text-sm text-gray-600">({property.reviews || 0})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(property.id)}
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          property.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {property.isActive ? 'Active' : 'Inactive'}
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
            <div className="p-6 overflow-y-auto flex-1">
              <PropertyForm
                initialData={selectedProperty ? {
                  name: selectedProperty.name,
                  city: selectedProperty.city,
                  location: selectedProperty.address,
                  address: selectedProperty.address,
                  coordinates: selectedProperty.coordinates || { lat: 30.7333, lng: 76.7794 },
                  description: 'Property description',
                  roomTypes: selectedProperty.roomTypes?.map((rt: any) => ({
                    ...rt,
                    description: '',
                    features: [],
                  })) || [],
                  amenities: selectedProperty.amenities?.map((a: any) => {
                    // Update icons to match current defaults
                    const iconMap: { [key: string]: string } = {
                      'Fully Furnished': '🛌',
                      'Wifi': '🛜',
                      'WiFi': '🛜',
                      'Power Backup': '🔋',
                      'Room Cleaning Service': '🧹',
                      'Parking': '🚗',
                      'Meals': '🍱',
                      'Fridge': '🧊',
                      'Geyser': '♨️',
                      'RO': '💧',
                      'RO Water': '💧',
                    };
                    return {
                      ...a,
                      icon: iconMap[a.name] || a.icon
                    };
                  }) || [],
                  rules: selectedProperty.houseRules || [],
                  nearbyPlaces: selectedProperty.nearbyPlaces || [{ name: '', distance: '', type: 'Shopping' }],
                  images: selectedProperty.images || [selectedProperty.image],
                  contactPhone: selectedProperty.contactPhone || '+91 98765 43210',
                } : undefined}
                onSubmit={async (data) => {
                  console.log('Form submitted with data:', data);
                  try {
                    if (showEditModal && selectedProperty) {
                      // Update existing property
                      console.log('Updating property:', selectedProperty.id);
                      const updateData = {
                        name: data.name,
                        city: data.city,
                        address: data.address,
                        coordinates: data.coordinates,
                        roomTypes: data.roomTypes,
                        price: data.roomTypes[0]?.price || 0, // Update main price field
                        amenities: data.amenities,
                        houseRules: data.rules,
                        nearbyPlaces: data.nearbyPlaces,
                        images: data.images,
                        contactPhone: data.contactPhone,
                      };
                      console.log('Update data:', updateData);
                      await updateProperty(selectedProperty.id, updateData);
                      alert('Property updated successfully!');
                      // Force page reload to clear all caches
                      window.location.reload();
                    } else {
                      // Add new property
                      console.log('Adding new property');
                      const newPropertyData = {
                        name: data.name,
                        city: data.city,
                        address: data.address,
                        rating: 0,
                        reviews: 0,
                        type: data.roomTypes.map(rt => rt.type).join(', '),
                        availability: 'Available',
                        image: data.images[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
                        images: data.images,
                        price: data.roomTypes[0]?.price || 0,
                        amenities: data.amenities,
                        houseRules: data.rules,
                        nearbyPlaces: data.nearbyPlaces,
                        coordinates: data.coordinates,
                        roomTypes: data.roomTypes,
                        isActive: true,
                        contactPhone: data.contactPhone,
                      };
                      console.log('New property data:', newPropertyData);
                      await addProperty(newPropertyData);
                      alert('Property added successfully!');
                      // Force page reload to clear all caches
                      window.location.reload();
                    }
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedProperty(null);
                  } catch (error) {
                    console.error('Error saving property:', error);
                    alert(`Failed to save property: ${error instanceof Error ? error.message : 'Unknown error'}`);
                  }
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
