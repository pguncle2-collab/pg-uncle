'use client';

import React, { useState, useEffect } from 'react';

interface RoomType {
  type: string;
  price: number;
  available: boolean;
  description: string;
  features: string[];
  totalSlots: number;
  occupiedSlots: number;
  availableSlots: number;
}

interface PropertyFormData {
  name: string;
  city: string;
  location: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  roomTypes: RoomType[];
  amenities: {
    name: string;
    icon: string;
    available: boolean;
  }[];
  rules: string[];
  images: string[];
  contactPhone: string;
}

interface PropertyFormProps {
  initialData?: PropertyFormData;
  onSubmit: (data: PropertyFormData) => void;
  onCancel: () => void;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<PropertyFormData>(
    initialData || {
      name: '',
      city: 'Chandigarh',
      location: '',
      address: '',
      coordinates: { lat: 30.7333, lng: 76.7794 },
      description: '',
      roomTypes: [
        { type: 'Single', price: 0, available: true, description: '', features: [], totalSlots: 0, occupiedSlots: 0, availableSlots: 0 },
      ],
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
      rules: [''],
      images: [''],
      contactPhone: '',
    }
  );

  const cities = ['Chandigarh', 'Mohali', 'Panchkula', 'Zirakpur'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addRoomType = () => {
    setFormData({
      ...formData,
      roomTypes: [
        ...formData.roomTypes,
        { type: '', price: 0, available: true, description: '', features: [], totalSlots: 0, occupiedSlots: 0, availableSlots: 0 },
      ],
    });
  };

  const removeRoomType = (index: number) => {
    setFormData({
      ...formData,
      roomTypes: formData.roomTypes.filter((_, i) => i !== index),
    });
  };

  const updateRoomType = (index: number, field: keyof RoomType, value: any) => {
    const newRoomTypes = [...formData.roomTypes];
    newRoomTypes[index] = { ...newRoomTypes[index], [field]: value };
    setFormData({ ...formData, roomTypes: newRoomTypes });
  };

  const addRule = () => {
    setFormData({ ...formData, rules: [...formData.rules, ''] });
  };

  const removeRule = (index: number) => {
    setFormData({ ...formData, rules: formData.rules.filter((_, i) => i !== index) });
  };

  const updateRule = (index: number, value: string) => {
    const newRules = [...formData.rules];
    newRules[index] = value;
    setFormData({ ...formData, rules: newRules });
  };

  const addImage = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImage = (index: number) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const toggleAmenity = (index: number) => {
    const newAmenities = [...formData.amenities];
    newAmenities[index].available = !newAmenities[index].available;
    setFormData({ ...formData, amenities: newAmenities });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="text-lg font-bold text-gray-900">Basic Information</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <select
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              required
            >
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location/Sector *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              placeholder="e.g., Sector 22"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Phone *
            </label>
            <input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              placeholder="+91 98765 43210"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Address *
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            placeholder="House No. 123, Sector 22-C, Chandigarh, 160022"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Latitude
            </label>
            <input
              type="number"
              step="0.0001"
              value={formData.coordinates.lat}
              onChange={(e) => setFormData({ 
                ...formData, 
                coordinates: { ...formData.coordinates, lat: parseFloat(e.target.value) }
              })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longitude
            </label>
            <input
              type="number"
              step="0.0001"
              value={formData.coordinates.lng}
              onChange={(e) => setFormData({ 
                ...formData, 
                coordinates: { ...formData.coordinates, lng: parseFloat(e.target.value) }
              })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Room Types */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold text-gray-900">Room Types</h4>
          <button
            type="button"
            onClick={addRoomType}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
          >
            + Add Room Type
          </button>
        </div>

        {formData.roomTypes.map((room, index) => (
          <div key={index} className="p-4 border-2 border-gray-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">Room Type {index + 1}</span>
              {formData.roomTypes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRoomType(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={room.type}
                  onChange={(e) => updateRoomType(index, 'type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Triple">Triple</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹/month)</label>
                <input
                  type="number"
                  value={room.price}
                  onChange={(e) => updateRoomType(index, 'price', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={room.available}
                    onChange={(e) => updateRoomType(index, 'available', e.target.checked)}
                    className="w-4 h-4 text-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Available</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Slots</label>
                <input
                  type="number"
                  value={room.totalSlots}
                  onChange={(e) => {
                    const total = parseInt(e.target.value) || 0;
                    updateRoomType(index, 'totalSlots', total);
                    const available = Math.max(0, total - room.occupiedSlots);
                    updateRoomType(index, 'availableSlots', available);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Occupied</label>
                <input
                  type="number"
                  value={room.occupiedSlots}
                  onChange={(e) => {
                    const occupied = parseInt(e.target.value) || 0;
                    updateRoomType(index, 'occupiedSlots', Math.min(occupied, room.totalSlots));
                    const available = Math.max(0, room.totalSlots - occupied);
                    updateRoomType(index, 'availableSlots', available);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  min="0"
                  max={room.totalSlots}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available</label>
                <input
                  type="number"
                  value={room.availableSlots}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  disabled
                />
              </div>
            </div>

            {room.availableSlots <= 3 && room.availableSlots > 0 && (
              <div className={`p-3 rounded-lg ${room.availableSlots <= 1 ? 'bg-red-50 border border-red-200' : 'bg-orange-50 border border-orange-200'}`}>
                <p className={`text-sm font-semibold ${room.availableSlots <= 1 ? 'text-red-700' : 'text-orange-700'}`}>
                  ⚠️ {room.availableSlots <= 1 ? 'Critical' : 'Low'} Inventory Alert: Only {room.availableSlots} slot{room.availableSlots !== 1 ? 's' : ''} available!
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={room.description}
                onChange={(e) => updateRoomType(index, 'description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="e.g., Private room with attached bathroom"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Amenities */}
      <div className="space-y-4">
        <h4 className="text-lg font-bold text-gray-900">Amenities</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {formData.amenities.map((amenity, index) => (
            <label
              key={index}
              className={`flex items-center gap-2 p-3 border-2 rounded-xl cursor-pointer transition-colors ${
                amenity.available ? 'border-green-500 bg-green-50' : 'border-gray-200'
              }`}
            >
              <input
                type="checkbox"
                checked={amenity.available}
                onChange={() => toggleAmenity(index)}
                className="w-4 h-4 text-blue-500 border-gray-300 rounded"
              />
              <span className="text-lg">{amenity.icon}</span>
              <span className="text-sm font-medium text-gray-900">{amenity.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* House Rules */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold text-gray-900">House Rules</h4>
          <button
            type="button"
            onClick={addRule}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
          >
            + Add Rule
          </button>
        </div>

        {formData.rules.map((rule, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={rule}
              onChange={(e) => updateRule(index, e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              placeholder="Enter a house rule"
            />
            {formData.rules.length > 1 && (
              <button
                type="button"
                onClick={() => removeRule(index)}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Images */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold text-gray-900">Property Images (URLs)</h4>
          <button
            type="button"
            onClick={addImage}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
          >
            + Add Image
          </button>
        </div>

        {formData.images.map((image, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="url"
              value={image}
              onChange={(e) => updateImage(index, e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              placeholder="https://example.com/image.jpg"
            />
            {formData.images.length > 1 && (
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-4 border-t border-gray-200">
        <button
          type="submit"
          className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all"
        >
          Save Property
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
