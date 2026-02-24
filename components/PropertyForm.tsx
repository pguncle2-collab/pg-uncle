'use client';

import React, { useState, useEffect } from 'react';
import { uploadMultipleImages } from '@/lib/imageUpload';
import { addCacheBuster, refreshImageUrl } from '@/lib/imageUtils';

interface RoomType {
  type: string;
  price: number;
  available: boolean;
  description: string;
  features: string[];
  totalSlots: number;
  occupiedSlots: number;
  availableSlots: number;
  beds: number;
  images?: string[];
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
  nearbyPlaces: {
    name: string;
    distance: string;
    type: string;
  }[];
  images: string[];
}

interface PropertyFormProps {
  initialData?: PropertyFormData;
  onSubmit: (data: PropertyFormData) => void;
  onCancel: () => void;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const defaultAmenities = [
    { name: 'Fully Furnished', icon: '🛌', available: true },
    { name: 'Wifi', icon: '🛜', available: true },
    { name: 'AC', icon: '❄️', available: true },
    { name: 'Power Backup', icon: '🔋', available: true },
    { name: 'Room Cleaning Service', icon: '🧹', available: true },
    { name: 'Parking', icon: '🚗', available: true },
    { name: 'Meals', icon: '🍱', available: true },
    { name: 'Fridge', icon: '🧊', available: true },
    { name: 'Geyser', icon: '♨️', available: true },
    { name: 'RO', icon: '💧', available: true },
  ];

  const [formData, setFormData] = useState<PropertyFormData>(() => {
    if (initialData) {
      return {
        ...initialData,
        amenities: initialData.amenities && initialData.amenities.length > 0 
          ? initialData.amenities 
          : defaultAmenities
      };
    }
    return {
      name: '',
      city: 'Chandigarh',
      location: '',
      address: '',
      coordinates: { lat: 30.7333, lng: 76.7794 },
      description: '',
      roomTypes: [
        { type: 'Single', price: 0, available: true, description: '', features: [], totalSlots: 0, occupiedSlots: 0, availableSlots: 0, beds: 1, images: [] },
      ],
      amenities: defaultAmenities,
      rules: [''],
      nearbyPlaces: [{ name: '', distance: '', type: 'Shopping' }],
      images: [''],
    };
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>(initialData?.images || []);
  const [roomImageFiles, setRoomImageFiles] = useState<{[key: number]: File[]}>({});
  const [roomImagePreviewUrls, setRoomImagePreviewUrls] = useState<{[key: number]: string[]}>(() => {
    // Initialize with existing room images from initialData
    if (initialData?.roomTypes) {
      const roomImages: {[key: number]: string[]} = {};
      initialData.roomTypes.forEach((room, index) => {
        if (room.images && room.images.length > 0) {
          roomImages[index] = room.images;
        }
      });
      return roomImages;
    }
    return {};
  });
  const [isUploading, setIsUploading] = useState(false);

  const cities = ['Chandigarh', 'Mohali', 'Panchkula', 'Zirakpur'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsUploading(true);
    
    try {
      // Upload property images if any
      let uploadedImageUrls: string[] = [];
      if (imageFiles.length > 0) {
        uploadedImageUrls = await uploadMultipleImages(imageFiles, 'properties');
      }

      // Combine existing images with newly uploaded ones
      const allImages = [...imagePreviewUrls.filter(url => url && !url.startsWith('blob:')), ...uploadedImageUrls];
      
      // Upload room images for each room type
      const updatedRoomTypes = await Promise.all(
        formData.roomTypes.map(async (room, index) => {
          const roomFiles = roomImageFiles[index] || [];
          let roomUploadedUrls: string[] = [];
          
          if (roomFiles.length > 0) {
            roomUploadedUrls = await uploadMultipleImages(roomFiles, `properties/rooms`);
          }
          
          // Combine existing room images with newly uploaded ones
          const existingRoomImages = roomImagePreviewUrls[index]?.filter(url => url && !url.startsWith('blob:')) || [];
          const allRoomImages = [...existingRoomImages, ...roomUploadedUrls];
          
          return {
            ...room,
            images: allRoomImages.length > 0 ? allRoomImages : undefined
          };
        })
      );
      
      // Update form data with uploaded image URLs
      const dataToSubmit = {
        ...formData,
        images: allImages.length > 0 ? allImages : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'],
        roomTypes: updatedRoomTypes,
      };
      
      onSubmit(dataToSubmit);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const addRoomType = () => {
    setFormData({
      ...formData,
      roomTypes: [
        ...formData.roomTypes,
        { type: '', price: 0, available: true, description: '', features: [], totalSlots: 0, occupiedSlots: 0, availableSlots: 0, beds: 1, images: [] },
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

  const updateRoomTypeMultiple = (index: number, updates: Partial<RoomType>) => {
    const newRoomTypes = [...formData.roomTypes];
    newRoomTypes[index] = { ...newRoomTypes[index], ...updates };
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

  const addNearbyPlace = () => {
    setFormData({ 
      ...formData, 
      nearbyPlaces: [...formData.nearbyPlaces, { name: '', distance: '', type: 'Shopping' }] 
    });
  };

  const removeNearbyPlace = (index: number) => {
    setFormData({ 
      ...formData, 
      nearbyPlaces: formData.nearbyPlaces.filter((_, i) => i !== index) 
    });
  };

  const updateNearbyPlace = (index: number, field: 'name' | 'distance' | 'type', value: string) => {
    const newNearbyPlaces = [...formData.nearbyPlaces];
    newNearbyPlaces[index] = { ...newNearbyPlaces[index], [field]: value };
    setFormData({ ...formData, nearbyPlaces: newNearbyPlaces });
  };

  const toggleAmenity = (index: number) => {
    const newAmenities = [...formData.amenities];
    newAmenities[index].available = !newAmenities[index].available;
    setFormData({ ...formData, amenities: newAmenities });
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    
    // Validate file types and sizes
    const validFiles = newFiles.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 50 * 1024 * 1024; // 50MB
      
      if (!validTypes.includes(file.type)) {
        alert(`${file.name} is not a valid image type. Only JPEG, PNG, and WebP are allowed.`);
        return false;
      }
      
      if (file.size > maxSize) {
        alert(`${file.name} is too large. Maximum size is 50MB.`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    // Add to image files
    setImageFiles(prev => [...prev, ...validFiles]);

    // Create preview URLs
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    // Remove from preview URLs
    const urlToRemove = imagePreviewUrls[index];
    if (urlToRemove && urlToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(urlToRemove);
    }
    
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
    
    // Remove from files if it's a new upload
    const fileIndex = imageFiles.findIndex((_, i) => i === index - (imagePreviewUrls.length - imageFiles.length));
    if (fileIndex >= 0) {
      setImageFiles(prev => prev.filter((_, i) => i !== fileIndex));
    }
  };

  const handleRoomImageFileChange = (roomIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    
    // Validate file types and sizes
    const validFiles = newFiles.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 50 * 1024 * 1024; // 50MB
      
      if (!validTypes.includes(file.type)) {
        alert(`${file.name} is not a valid image type. Only JPEG, PNG, and WebP are allowed.`);
        return false;
      }
      
      if (file.size > maxSize) {
        alert(`${file.name} is too large. Maximum size is 50MB.`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    // Add to room image files
    setRoomImageFiles(prev => ({
      ...prev,
      [roomIndex]: [...(prev[roomIndex] || []), ...validFiles]
    }));

    // Create preview URLs
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setRoomImagePreviewUrls(prev => ({
      ...prev,
      [roomIndex]: [...(prev[roomIndex] || []), ...newPreviewUrls]
    }));
  };

  const removeRoomImage = (roomIndex: number, imageIndex: number) => {
    // Remove from preview URLs
    const roomUrls = roomImagePreviewUrls[roomIndex] || [];
    const urlToRemove = roomUrls[imageIndex];
    if (urlToRemove && urlToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(urlToRemove);
    }
    
    setRoomImagePreviewUrls(prev => ({
      ...prev,
      [roomIndex]: roomUrls.filter((_, i) => i !== imageIndex)
    }));
    
    // Remove from files if it's a new upload
    const roomFiles = roomImageFiles[roomIndex] || [];
    setRoomImageFiles(prev => ({
      ...prev,
      [roomIndex]: roomFiles.filter((_, i) => i !== imageIndex)
    }));
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
              Latitude *
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
              placeholder="30.7333"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longitude *
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
              placeholder="76.7794"
              required
            />
          </div>
        </div>
        
        {/* Helper text for coordinates */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800 mb-2">
            <strong>📍 How to get coordinates:</strong>
          </p>
          <ol className="text-sm text-blue-700 space-y-1 ml-4 list-decimal">
            <li>Open <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="underline font-medium">Google Maps</a></li>
            <li>Search for the PG address</li>
            <li>Right-click on the exact location</li>
            <li>Click on the coordinates (first option) to copy them</li>
            <li>Paste latitude and longitude in the fields above</li>
          </ol>
          <p className="text-xs text-blue-600 mt-2">
            Example: Chandigarh coordinates are Lat: 30.7333, Lng: 76.7794
          </p>
        </div>
        
        {/* Map Preview */}
        {formData.coordinates.lat && formData.coordinates.lng && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">📍 Location Preview:</p>
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${formData.coordinates.lat},${formData.coordinates.lng}&zoom=15`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
              />
            </div>
            <p className="text-xs text-gray-600 mt-2 text-center">
              This is how the location will appear to users
            </p>
          </div>
        )}
      </div>

      {/* Room Types */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-bold text-gray-900">Room Types & Inventory</h4>
            <p className="text-sm text-gray-600 mt-1">
              Total Rooms (how many rooms), Total Beds (total beds for that room type), Occupied, Available (auto-calculated)
            </p>
          </div>
          <button
            type="button"
            onClick={addRoomType}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-semibold"
          >
            + Add Room Type
          </button>
        </div>

        {/* Example Helper */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900 font-semibold mb-2">💡 Example:</p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Single Occupancy:</strong> 10 rooms, 10 total beds, 7 occupied = 3 available</li>
            <li>• <strong>Double Occupancy:</strong> 15 rooms, 30 total beds, 20 occupied = 10 available</li>
            <li>• <strong>Triple Occupancy:</strong> 8 rooms, 24 total beds, 18 occupied = 6 available</li>
          </ul>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Type *
                </label>
                <select
                  value={room.type}
                  onChange={(e) => updateRoomType(index, 'type', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-base"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Single">Single Occupancy</option>
                  <option value="Double">Double Occupancy</option>
                  <option value="Triple">Triple Occupancy</option>
                  <option value="Quad">Quad Occupancy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per Month (₹) *
                </label>
                <input
                  type="number"
                  value={room.price}
                  onChange={(e) => {
                    const value = e.target.value;
                    updateRoomType(index, 'price', value === '' ? 0 : parseInt(value));
                  }}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-base"
                  placeholder="e.g., 8000"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h5 className="text-sm font-semibold text-blue-900 mb-3">Inventory</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Total Rooms *
                    <span className="block text-xs text-gray-500 font-normal mt-0.5">
                      How many rooms
                    </span>
                  </label>
                  <input
                    type="number"
                    value={room.totalSlots}
                    onChange={(e) => {
                      const value = e.target.value;
                      const total = value === '' ? 0 : parseInt(value);
                      updateRoomType(index, 'totalSlots', total);
                    }}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-base"
                    placeholder="e.g., 10"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Total Beds *
                    <span className="block text-xs text-gray-500 font-normal mt-0.5">
                      Total beds available
                    </span>
                  </label>
                  <input
                    type="number"
                    value={room.beds}
                    onChange={(e) => {
                      const value = e.target.value;
                      const beds = value === '' ? 0 : parseInt(value);
                      const occupied = room.occupiedSlots || 0;
                      const available = Math.max(0, beds - occupied);
                      updateRoomTypeMultiple(index, {
                        beds: beds,
                        availableSlots: available
                      });
                    }}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-base"
                    placeholder="e.g., 20"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Occupied *
                    <span className="block text-xs text-gray-500 font-normal mt-0.5">
                      Currently occupied
                    </span>
                  </label>
                  <input
                    type="number"
                    value={room.occupiedSlots}
                    onChange={(e) => {
                      const value = e.target.value;
                      const occupied = value === '' ? 0 : parseInt(value);
                      const totalBeds = room.beds || 0;
                      const maxOccupied = Math.min(occupied, totalBeds);
                      const available = Math.max(0, totalBeds - maxOccupied);
                      updateRoomTypeMultiple(index, {
                        occupiedSlots: maxOccupied,
                        availableSlots: available
                      });
                    }}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-base"
                    placeholder="e.g., 15"
                    min="0"
                    max={room.beds || 0}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Available
                    <span className="block text-xs text-gray-500 font-normal mt-0.5">
                      Auto-calculated
                    </span>
                  </label>
                  <input
                    type="number"
                    value={room.availableSlots}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed text-base"
                    disabled
                    readOnly
                  />
                </div>
              </div>
              
              {/* Summary */}
              <div className="mt-3 pt-3 border-t border-blue-200">
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{room.totalSlots || 0}</div>
                    <div className="text-gray-600">Rooms</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">{room.beds || 0}</div>
                    <div className="text-gray-600">Total Beds</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-red-600">{room.occupiedSlots || 0}</div>
                    <div className="text-gray-600">Occupied</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-green-600">{room.availableSlots || 0}</div>
                    <div className="text-gray-600">Available</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <input
                type="checkbox"
                id={`available-${index}`}
                checked={room.available}
                onChange={(e) => updateRoomType(index, 'available', e.target.checked)}
                className="w-5 h-5 text-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={`available-${index}`} className="text-sm font-medium text-gray-900 cursor-pointer">
                This room type is currently available for booking
              </label>
            </div>

            {room.availableSlots <= 3 && room.availableSlots > 0 && (
              <div className={`p-3 rounded-lg ${room.availableSlots <= 1 ? 'bg-red-50 border border-red-200' : 'bg-orange-50 border border-orange-200'}`}>
                <p className={`text-sm font-semibold ${room.availableSlots <= 1 ? 'text-red-700' : 'text-orange-700'}`}>
                  ⚠️ {room.availableSlots <= 1 ? 'Critical' : 'Low'} Inventory Alert: Only {room.availableSlots} slot{room.availableSlots !== 1 ? 's' : ''} available!
                </p>
              </div>
            )}

            {/* Room Images Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Images (Optional)
                <span className="text-xs text-gray-500 ml-2">Max 20MB per image</span>
              </label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={(e) => handleRoomImageFileChange(index, e)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              {roomImagePreviewUrls[index] && roomImagePreviewUrls[index].length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {roomImagePreviewUrls[index].map((url, imgIndex) => (
                    <div key={imgIndex} className="relative group">
                      <img
                        src={url}
                        alt={`Room ${index + 1} preview ${imgIndex + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeRoomImage(index, imgIndex)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Upload images specific to this room type. These will be shown on the property detail page.
              </p>
            </div>

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

      {/* Nearby Places */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-bold text-gray-900">Nearby Places</h4>
            <p className="text-sm text-gray-600 mt-1">Add nearby landmarks, markets, hospitals, etc.</p>
          </div>
          <button
            type="button"
            onClick={addNearbyPlace}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-semibold"
          >
            + Add Place
          </button>
        </div>

        {/* Helper */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900 font-semibold mb-2">💡 Examples:</p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Shopping:</strong> Sector 17 Market - 2.5 km</li>
            <li>• <strong>Healthcare:</strong> PGI Hospital - 3.0 km</li>
            <li>• <strong>Education:</strong> Chandigarh University - 1.5 km</li>
            <li>• <strong>Transport:</strong> ISBT Bus Stand - 4.0 km</li>
          </ul>
        </div>

        {formData.nearbyPlaces.map((place, index) => (
          <div key={index} className="p-4 border-2 border-gray-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">Place {index + 1}</span>
              {formData.nearbyPlaces.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeNearbyPlace(index)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Place Name *
                </label>
                <input
                  type="text"
                  value={place.name}
                  onChange={(e) => updateNearbyPlace(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., Sector 17 Market"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Distance *
                </label>
                <input
                  type="text"
                  value={place.distance}
                  onChange={(e) => updateNearbyPlace(index, 'distance', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., 2.5 km"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  value={place.type}
                  onChange={(e) => updateNearbyPlace(index, 'type', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  required
                >
                  <option value="Shopping">🛍️ Shopping</option>
                  <option value="Healthcare">🏥 Healthcare</option>
                  <option value="Education">🎓 Education</option>
                  <option value="Transport">🚌 Transport</option>
                  <option value="Restaurant">🍽️ Restaurant</option>
                  <option value="Entertainment">🎬 Entertainment</option>
                  <option value="Bank">🏦 Bank</option>
                  <option value="Other">📍 Other</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Images */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-bold text-gray-900">Property Images</h4>
            <p className="text-sm text-gray-600 mt-1">Upload high-quality images (JPEG, PNG, WebP - Max 50MB each)</p>
          </div>
          <label className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm cursor-pointer font-semibold">
            + Add Images
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={handleImageFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Image Previews */}
        {imagePreviewUrls.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {imagePreviewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded">
                    Main Image
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {imagePreviewUrls.length === 0 && (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600 mb-2">No images uploaded yet</p>
            <p className="text-sm text-gray-500">Click "Add Images" to upload property photos</p>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isUploading}
          className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isUploading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Uploading Images...
            </>
          ) : (
            'Save Property'
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isUploading}
          className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
