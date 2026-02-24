'use client';

import { useState, useEffect } from 'react';
import { Property } from '@/types';

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
      
      // Fetch from API route (MongoDB)
      const response = await fetch('/api/properties');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Update cache in sessionStorage
      setCachedData(data);
      
      setProperties(data);
      setLoading(false);
      
    } catch (err: any) {
      console.error('Error fetching properties:', err);
      
      // Retry once on error
      if (retryCount < 1) {
        console.log('Retrying fetch...');
        setTimeout(() => {
          fetchProperties(retryCount + 1, false);
        }, 1000);
        return;
      }
      
      // Show user-friendly error
      const errorMessage = 'Unable to load properties. Please refresh the page.';
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
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(property),
      });
      
      if (!response.ok) throw new Error('Failed to add property');
      
      const newProperty = await response.json();
      
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
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(property),
      });
      
      if (!response.ok) throw new Error('Failed to update property');
      
      const updatedProperty = await response.json();
      
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
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete property');
      
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
      const response = await fetch(`/api/properties/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });
      
      if (!response.ok) throw new Error('Failed to toggle property status');
      
      const updatedProperty = await response.json();
      
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
