'use client';

import { useState, useEffect } from 'react';
import { Property } from '@/lib/supabase';
import { propertyOperations } from '@/lib/supabaseOperations';

// Cache for properties
let cachedProperties: Property[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>(cachedProperties || []);
  const [loading, setLoading] = useState(!cachedProperties);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async (retryCount = 0, useCache = true) => {
    try {
      // Check if we have valid cached data
      if (useCache && cachedProperties && cacheTimestamp) {
        const now = Date.now();
        if (now - cacheTimestamp < CACHE_DURATION) {
          console.log('Using cached properties');
          setProperties(cachedProperties);
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      setError(null);
      console.log('Fetching properties from Supabase...');
      const data = await propertyOperations.getAll();
      console.log('Properties fetched successfully:', data.length);
      
      // Update cache
      cachedProperties = data;
      cacheTimestamp = Date.now();
      
      setProperties(data);
    } catch (err: any) {
      let errorMessage = err.message || 'Failed to fetch properties';
      
      // Handle abort errors with retry
      if ((err.name === 'AbortError' || errorMessage.includes('AbortError')) && retryCount < 2) {
        console.warn(`Properties fetch attempt ${retryCount + 1} timed out. Retrying...`);
        setTimeout(() => fetchProperties(retryCount + 1, false), 1000);
        return;
      }
      
      // Handle abort errors specifically
      if (err.name === 'AbortError' || errorMessage.includes('AbortError')) {
        errorMessage = 'Database connection timed out. Your Supabase project may be paused. Please check your Supabase dashboard and restore the project if needed.';
        console.warn('⚠️ Supabase connection timeout. Check if your project is paused at https://supabase.com/dashboard');
      }
      
      console.error('Error fetching properties:', err);
      console.error('Error details:', {
        message: err.message,
        code: err.code,
        details: err.details,
        hint: err.hint,
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const addProperty = async (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newProperty = await propertyOperations.create(property);
      
      // Update local state
      setProperties([newProperty, ...properties]);
      
      // Invalidate cache to force refresh
      cachedProperties = null;
      cacheTimestamp = null;
      
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
      cachedProperties = null;
      cacheTimestamp = null;
      
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
      cachedProperties = null;
      cacheTimestamp = null;
    } catch (err: any) {
      setError(err.message || 'Failed to delete property');
      throw err;
    }
  };

  const togglePropertyActive = async (id: string, isActive: boolean) => {
    console.log('Hook togglePropertyActive called:', { id, isActive });
    console.log('Current properties:', properties);
    try {
      const updatedProperty = await propertyOperations.toggleActive(id, isActive);
      console.log('Updated property from DB:', updatedProperty);
      
      // Update local state
      const newProperties = properties.map(p => p.id === id ? updatedProperty : p);
      console.log('New properties array:', newProperties);
      setProperties(newProperties);
      
      // Invalidate cache to force refresh
      cachedProperties = null;
      cacheTimestamp = null;
      
      return updatedProperty;
    } catch (err: any) {
      console.error('Hook togglePropertyActive error:', err);
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
