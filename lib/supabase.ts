import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Validate environment variables in non-build environments
if (typeof window !== 'undefined' || process.env.NODE_ENV === 'production') {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Missing Supabase environment variables!');
    console.error('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing');
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing');
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'pguncle-auth',
    // Disable lock mechanism to prevent AbortError
    lock: false,
  },
  global: {
    headers: {
      'x-client-info': 'pguncle-web',
    },
  },
  db: {
    schema: 'public',
  },
});

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
  gender?: string;
  description?: string;
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
  contactPhone?: string;
}

export interface RoomType {
  type: string;
  price: number;
  totalSlots: number;
  occupiedSlots: number;
  availableSlots: number;
  available?: boolean;
  description?: string;
  features?: string[];
  images?: string[];
  beds?: number;
}

export interface Amenity {
  name: string;
  icon?: string;
  available: boolean;
}

export interface NearbyPlace {
  name: string;
  distance: string;
  type?: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'user' | 'admin';
  createdAt?: string;
}
