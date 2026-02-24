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

// Create client only once
let supabaseInstance: any = null;

function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        storageKey: 'pguncle-auth',
        flowType: 'pkce',
        // Disable lock mechanism by providing a no-op lock function
        lock: async (_name: string, _acquireTimeout: number, fn: () => Promise<any>) => {
          // Skip locking, just execute the function directly
          return await fn();
        },
      },
      global: {
        headers: {
          'x-client-info': 'pguncle-web',
        },
        fetch: (url, options = {}) => {
          return fetch(url, {
            ...options,
            cache: 'no-store',
          });
        },
      },
      db: {
        schema: 'public',
      },
    });

    // Handle session recovery on client side
    if (typeof window !== 'undefined') {
      supabaseInstance.auth.getSession().catch((error: any) => {
        console.warn('Session recovery failed, clearing stale session:', error);
        // Clear stale session data
        localStorage.removeItem('pguncle-auth');
        window.location.reload();
      });
    }
  }
  return supabaseInstance;
}

export const supabase = getSupabaseClient();

// Database types
export interface Property {
  id: string;
  name: string;
  location: string;
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
