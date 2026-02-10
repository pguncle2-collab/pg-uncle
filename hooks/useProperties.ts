'use client';

import { useState, useEffect } from 'react';
import { Property } from '@/lib/supabase';
import { propertyOperations } from '@/lib/supabaseOperations';

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyOperations.getAll();
      setProperties(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch properties');
      console.error('Error fetching properties:', err);
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
      setProperties([newProperty, ...properties]);
      return newProperty;
    } catch (err: any) {
      setError(err.message || 'Failed to add property');
      throw err;
    }
  };

  const updateProperty = async (id: string, property: Partial<Property>) => {
    try {
      const updatedProperty = await propertyOperations.update(id, property);
      setProperties(properties.map(p => p.id === id ? updatedProperty : p));
      return updatedProperty;
    } catch (err: any) {
      setError(err.message || 'Failed to update property');
      throw err;
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      await propertyOperations.delete(id);
      setProperties(properties.filter(p => p.id !== id));
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
      const newProperties = properties.map(p => p.id === id ? updatedProperty : p);
      console.log('New properties array:', newProperties);
      setProperties(newProperties);
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
