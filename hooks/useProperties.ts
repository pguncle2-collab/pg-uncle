'use client';

import { useState, useEffect } from 'react';
import { Property } from '@/lib/supabase';
import { propertyOperations } from '@/lib/supabaseOperations';

// Version key to force cache invalidation on code updates
const CACHE_VERSION = 'v2'; // Increment this to force cache clear
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes (reduced from 3)

// Use sessionStorage for cache (clears on browser close)
function getCachedData(): { properties: Property[] | null; timestamp: number | null } {
  if (typeof window === 'undefined') return { properties: null, timestamp: null };
  
  try {
    const cached = sessionStorage.getItem(`properties_cache_${CACHE_VERSION}`);
    if (!cached) {
      // Clear old cache versions
      clearOldCacheVersions();
      return { properties: null, timestamp: null };
    }
    
    const parsed = JSON.parse(cached);
    return {
      properties: parsed.properties || null,
      timestamp: parsed.timestamp || null
    };
  } catch {
    return { properties: null, timestamp: null };
  }
}

function clearOldCacheVersions() {
  if (typeof window === 'undefined') return;
  
  try {
    // Clear any old cache keys
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith('properties_cache_') && key !== `properties_cache_${CACHE_VERSION}`) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Failed to clear old cache versions:', error);
  }
}

function setCachedData(properties: Property[]) {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.setItem(`properties_cache_${CACHE_VERSION}`, JSON.stringify({
      properties,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn('Failed to cache properties:', error);
  }
}

function clearCachedData() {
  if (typeof window === 'undefined') return;
  
  try {
    // Clear current version cache
    sessionStorage.removeItem(`properties_cache_${CACHE_VERSION}`);
    // Also clear any old versions
    clearOldCacheVersions();
  } catch (error) {
    console.warn('Failed to clear cache:', error);
  }
}

export function useProperties(autoFetch: boolean = true) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async (retryCount = 0, useCache = true) => {
    try {
      // Check if we have valid cached data
      if (useCache) {
        const { properties: cachedProperties, timestamp: cacheTimestamp } = getCachedData();
        
        if (cachedProperties && cacheTimestamp) {
          const now = Date.now();
          const age = now - cacheTimestamp;
          
          if (age < CACHE_DURATION) {
            setProperties(cachedProperties);
            setLoading(false);
            return;
          }
        }
      }

      setLoading(true);
      setError(null);
      
      // Add timeout wrapper - 10 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Database query timed out after 10 seconds. Your Supabase project may be paused or experiencing connectivity issues.'));
        }, 10000);
      });
      
      const queryPromise = propertyOperations.getAll();
      const data = await Promise.race([queryPromise, timeoutPromise]) as Property[];
      
      // Update cache in sessionStorage
      setCachedData(data);
      
      setProperties(data);
      setLoading(false);
      
    } catch (err: any) {
      let errorMessage = err.message || 'Failed to fetch properties';
      
      // Handle abort errors with retry
      if ((err.name === 'AbortError' || errorMessage.includes('AbortError')) && retryCount < 2) {
        setTimeout(() => {
          fetchProperties(retryCount + 1, false);
        }, 1000);
        return;
      }
      
      // Handle timeout
      if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
        errorMessage = '⚠️ Database Connection Timeout\n\nYour Supabase project may be:\n1. Paused (free tier pauses after inactivity)\n2. Experiencing connectivity issues\n\nPlease:\n1. Go to https://supabase.com/dashboard\n2. Check if your project is paused\n3. Click "Restore Project" if needed\n4. Wait 1-2 minutes and try again';
      }
      
      // Handle abort errors specifically
      if (err.name === 'AbortError' || errorMessage.includes('AbortError')) {
        errorMessage = 'Database connection timed out. Your Supabase project may be paused. Please check your Supabase dashboard and restore the project if needed.';
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchProperties();
    }
  }, [autoFetch]);

  const addProperty = async (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newProperty = await propertyOperations.create(property);
      
      // Update local state
      setProperties([newProperty, ...properties]);
      
      // Invalidate cache to force refresh
      clearCachedData();
      
      return newProperty;
    } catch (err: any) {
      setError(err.message || 'Failed to add property');
      throw err;
    }
  };

  const updateProperty = async (id: string, property: Partial<Property>) => {
    try {
      const updatedProperty = await propertyOperations.update(id, property);
      
      // Update local state
      setProperties(properties.map(p => p.id === id ? updatedProperty : p));
      
      // Invalidate cache to force refresh
      clearCachedData();
      
      // Fetch fresh data
      await fetchProperties(0, false);
      
      return updatedProperty;
    } catch (err: any) {
      setError(err.message || 'Failed to update property');
      throw err;
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      await propertyOperations.delete(id);
      
      // Update local state
      setProperties(properties.filter(p => p.id !== id));
      
      // Invalidate cache
      clearCachedData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete property');
      throw err;
    }
  };

  const togglePropertyActive = async (id: string, isActive: boolean) => {
    try {
      const updatedProperty = await propertyOperations.toggleActive(id, isActive);
      
      // Update local state
      const newProperties = properties.map(p => p.id === id ? updatedProperty : p);
      setProperties(newProperties);
      
      // Invalidate cache to force refresh
      clearCachedData();
      
      return updatedProperty;
    } catch (err: any) {
      setError(err.message || 'Failed to toggle property status');
      throw err;
    }
  };

  return {
    properties,
    loading,
    error,
    fetchProperties,
    addProperty,
    updateProperty,
    deleteProperty,
    togglePropertyActive
  };
}
