import { supabase, Property, User } from './supabase';

// Properties Operations
export const propertyOperations = {
  // Get all properties
  async getAll() {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Property[];
  },

  // Get properties by city
  async getByCity(city: string) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('city', city)
      .eq('is_active', true);
    
    if (error) throw error;
    return data as Property[];
  },

  // Get property by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Property;
  },

  // Add new property
  async create(property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('properties')
      .insert([{
        name: property.name,
        address: property.address,
        city: property.city,
        rating: property.rating,
        reviews: property.reviews,
        type: property.type,
        availability: property.availability,
        image: property.image,
        images: property.images || [],
        price: property.price,
        amenities: property.amenities,
        house_rules: property.houseRules,
        nearby_places: property.nearbyPlaces,
        coordinates: property.coordinates,
        room_types: property.roomTypes,
        is_active: property.isActive
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data as Property;
  },

  // Update property
  async update(id: string, property: Partial<Property>) {
    const updateData: any = {};
    
    if (property.name) updateData.name = property.name;
    if (property.address) updateData.address = property.address;
    if (property.city) updateData.city = property.city;
    if (property.rating !== undefined) updateData.rating = property.rating;
    if (property.reviews !== undefined) updateData.reviews = property.reviews;
    if (property.type) updateData.type = property.type;
    if (property.availability) updateData.availability = property.availability;
    if (property.image) updateData.image = property.image;
    if (property.images) updateData.images = property.images;
    if (property.price !== undefined) updateData.price = property.price;
    if (property.amenities) updateData.amenities = property.amenities;
    if (property.houseRules) updateData.house_rules = property.houseRules;
    if (property.nearbyPlaces) updateData.nearby_places = property.nearbyPlaces;
    if (property.coordinates) updateData.coordinates = property.coordinates;
    if (property.roomTypes) updateData.room_types = property.roomTypes;
    if (property.isActive !== undefined) updateData.is_active = property.isActive;

    const { data, error } = await supabase
      .from('properties')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Property;
  },

  // Delete property
  async delete(id: string) {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Toggle active status
  async toggleActive(id: string, isActive: boolean) {
    const { data, error } = await supabase
      .from('properties')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Property;
  },

  // Search properties
  async search(query: string) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .or(`name.ilike.%${query}%,address.ilike.%${query}%,city.ilike.%${query}%`)
      .eq('is_active', true);
    
    if (error) throw error;
    return data as Property[];
  }
};

// User Operations
export const userOperations = {
  // Get all users
  async getAll() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as User[];
  },

  // Get user by email
  async getByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) throw error;
    return data as User;
  },

  // Create user
  async create(user: Omit<User, 'id' | 'createdAt'>) {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        email: user.email,
        full_name: user.fullName,
        phone: user.phone,
        role: user.role || 'user'
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data as User;
  },

  // Update user
  async update(id: string, user: Partial<User>) {
    const updateData: any = {};
    
    if (user.email) updateData.email = user.email;
    if (user.fullName) updateData.full_name = user.fullName;
    if (user.phone) updateData.phone = user.phone;
    if (user.role) updateData.role = user.role;

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as User;
  }
};

// Booking Operations
export const bookingOperations = {
  // Create booking
  async create(booking: {
    userId: string;
    propertyId: string;
    roomType: string;
    checkInDate: string;
    totalAmount: number;
  }) {
    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        user_id: booking.userId,
        property_id: booking.propertyId,
        room_type: booking.roomType,
        check_in_date: booking.checkInDate,
        total_amount: booking.totalAmount,
        status: 'pending'
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get user bookings
  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        properties (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get all bookings (admin)
  async getAll() {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        users (*),
        properties (*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Update booking status
  async updateStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled') {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Helper function to convert snake_case to camelCase
export function convertToCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(convertToCamelCase);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      result[camelKey] = convertToCamelCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}
