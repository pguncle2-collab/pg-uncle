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
      
      // Add timeout wrapper - 5 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Request timeout'));
        }, 5000);
      });
      
      const queryPromise = propertyOperations.getAll();
      const data = await Promise.race([queryPromise, timeoutPromise]) as Property[];
      
      // Update cache in sessionStorage
      setCachedData(data);
      
      setProperties(data);
      setLoading(false);
      
    } catch (err: any) {
      let errorMessage = err.message || 'Failed to fetch properties';
      
      // Handle timeout - clear stale session and reload page once
      if ((errorMessage.includes('timeout') || errorMessage.includes('timed out') || errorMessage.includes('TIMEOUT')) && retryCount === 0) {
        console.warn('Timeout detected, clearing stale session and reloading...');
        
        // Clear all auth data
        localStorage.removeItem('pguncle-auth');
        
        // Clear any Supabase-related items
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('sb-') || key.includes('supabase') || key.includes('auth'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // Reload page to reinitialize Supabase client
        window.location.reload();
        return;
      }
      
      // Handle abort errors with retry
      if ((err.name === 'AbortError' || errorMessage.includes('AbortError')) && retryCount < 1) {
        console.log('Retrying after abort error...');
        setTimeout(() => {
          fetchProperties(retryCount + 1, false);
        }, 500);
        return;
      }
      
      // After retry or other errors, show user-friendly message
      if (errorMessage.includes('timeout') || errorMessage.includes('timed out') || err.name === 'AbortError' || errorMessage.includes('TIMEOUT')) {
        errorMessage = 'Unable to connect to database. The page will reload automatically.';
        
        // Auto-reload after showing error
        setTimeout(() => {
          window.location.reload();
        }, 2000);
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
      // Import image cleanup function
      const { deletePropertyImages } = await import('@/lib/imageCleanup');
      
      // Delete from database and get property data
      const propertyData = await propertyOperations.delete(id);
      
      // Delete associated images in background
      if (propertyData) {
        deletePropertyImages(propertyData).then(result => {
          console.log(`Image cleanup completed: ${result.success} deleted, ${result.failed} failed`);
        }).catch(err => {
          console.error('Error during image cleanup:', err);
        });
      }
      
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
