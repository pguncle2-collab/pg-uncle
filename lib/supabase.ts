import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  rating: number;
  reviews: number;
  type: string;
  availability: string;
  image: string;
  images?: string[];
  price: number;
  amenities: Amenity[];
  houseRules: string[];
  nearbyPlaces: NearbyPlace[];
  coordinates: {
    lat: number;
    lng: number;
  };
  roomTypes: RoomType[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoomType {
  type: string;
  price: number;
  totalSlots: number;
  occupiedSlots: number;
  availableSlots: number;
}

export interface Amenity {
  name: string;
  available: boolean;
}

export interface NearbyPlace {
  name: string;
  distance: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'user' | 'admin';
  createdAt?: string;
}
