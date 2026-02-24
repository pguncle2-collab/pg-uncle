import { supabase, Property, User } from './supabase';
import { withCache, serverCache } from './serverCache';
import { fetchPropertiesDirect } from './supabaseDirect';

// Helper function to convert database row to Property object
function mapDbToProperty(dbRow: any): Property {
  return {
    id: dbRow.id,
    name: dbRow.name,
    location: dbRow.location || '',
    address: dbRow.address,
    city: dbRow.city,
    rating: dbRow.rating,
    reviews: dbRow.reviews,
    type: dbRow.type,
    availability: dbRow.availability,
    image: dbRow.image,
    images: dbRow.images || [],
    price: dbRow.price,
    description: dbRow.description || '',
    amenities: dbRow.amenities || [],
    houseRules: dbRow.house_rules || [],
    nearbyPlaces: dbRow.nearby_places || [],
    coordinates: dbRow.coordinates || { lat: 30.7333, lng: 76.7794 },
    roomTypes: dbRow.room_types || [],
    isActive: dbRow.is_active ?? true,
    createdAt: dbRow.created_at,
    updatedAt: dbRow.updated_at,
  };
}

// Properties Operations
export const propertyOperations = {
  // Get all properties (optimized for list view with caching)
  async getAll() {
    try {
      console.log('🔍 Fetching properties from Supabase...');
      
      // Try direct REST API first (faster and more reliable)
      try {
        console.log('📡 Attempting direct REST API call...');
        const directData = await fetchPropertiesDirect();
        console.log(`✅ Direct fetch successful: ${directData.length} properties`);
        return directData.map((row: any) => mapDbToProperty(row));
      } catch (directError: any) {
        console.warn('⚠️ Direct fetch failed:', directError.message);
        // Fall through to Supabase client
      }
      
      // Fallback to Supabase client
      console.log('🔄 Trying Supabase client...');
      const { data, error } = await supabase
        .from('properties')
        .select(`
          id,
          name,
          location,
          address,
          city,
          description,
          rating,
          reviews,
          type,
          availability,
          image,
          images,
          price,
          amenities,
          house_rules,
          nearby_places,
          coordinates,
          room_types,
          is_active,
          created_at,
          updated_at
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error('❌ Supabase client error:', error);
        throw error;
      }
      
      if (!data) {
        console.warn('⚠️ No data returned from Supabase');
        return [];
      }
      
      console.log(`✅ Supabase client successful: ${data.length} properties`);
      return data.map(mapDbToProperty);
      
    } catch (err: any) {
      console.error('❌ Error fetching properties:', err);
      throw err;
    }
  },

  // Get properties by city (with caching)
  async getByCity(city: string) {
    return withCache(`properties:city:${city}`, async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('city', city)
        .eq('is_active', true);
      
      if (error) throw error;
      return (data || []).map(mapDbToProperty);
    }, 3 * 60 * 1000); // 3 minutes cache
  },

  // Get property by ID (with caching)
  async getById(id: string) {
    // Disable caching to always get fresh data with latest images
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return mapDbToProperty(data);
  },

  // Add new property (invalidate cache)
  async create(property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const insertData: any = {
        name: property.name,
        location: property.location || '',
        address: property.address,
        city: property.city,
        description: property.description || '',
        rating: property.rating || 0,
        reviews: property.reviews || 0,
        type: property.type,
        availability: property.availability || 'Available',
        image: property.image,
        images: property.images || [],
        price: property.price,
        amenities: property.amenities || [],
        house_rules: property.houseRules || [],
        nearby_places: property.nearbyPlaces || [],
        coordinates: property.coordinates,
        room_types: property.roomTypes || [],
        is_active: property.isActive !== undefined ? property.isActive : true,
      };

      console.log('Creating property with data:', insertData);

      const { data, error } = await supabase
        .from('properties')
        .insert([insertData])
        .select()
        .single();
      
      if (error) {
        console.error('Supabase insert error:', error);
        throw new Error(`Database error: ${error.message} (${error.code})`);
      }
      
      // Invalidate cache
      serverCache.delete('properties:all');
      serverCache.delete(`properties:city:${property.city}`);
      
      return mapDbToProperty(data);
    } catch (error: any) {
      console.error('Error in create operation:', error);
      throw error;
    }
  },

  // Update property (invalidate cache)
  async update(id: string, property: Partial<Property>) {
    try {
      const updateData: any = {};
      
      if (property.name) updateData.name = property.name;
      if (property.location !== undefined) updateData.location = property.location;
      if (property.address) updateData.address = property.address;
      if (property.city) updateData.city = property.city;
      if (property.description !== undefined) updateData.description = property.description;
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

      console.log('Updating property', id, 'with data:', updateData);

      const { data, error } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Supabase update error:', error);
        throw new Error(`Database error: ${error.message} (${error.code})`);
      }
      
      // Invalidate cache
      serverCache.delete('properties:all');
      serverCache.delete(`property:${id}`);
      if (property.city) {
        serverCache.delete(`properties:city:${property.city}`);
      }
      
      return mapDbToProperty(data);
    } catch (error: any) {
      console.error('Error in update operation:', error);
      throw error;
    }
  },

  // Delete property (invalidate cache)
  async delete(id: string) {
    // First, get the property to access its images
    const { data: property, error: fetchError } = await supabase
      .from('properties')
      .select('images, room_types')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching property for deletion:', fetchError);
    }

    // Delete the property from database
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    // Invalidate cache
    serverCache.delete('properties:all');
    serverCache.delete(`property:${id}`);
    
    // Return property data for image cleanup
    return property;
  },

  // Toggle active status (invalidate cache)
  async toggleActive(id: string, isActive: boolean) {
    const { data, error } = await supabase
      .from('properties')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Invalidate cache
    serverCache.delete('properties:all');
    serverCache.delete(`property:${id}`);
    
    const mappedData = mapDbToProperty(data);
    return mappedData;
  },

  // Search properties
  async search(query: string) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .or(`name.ilike.%${query}%,location.ilike.%${query}%,address.ilike.%${query}%,city.ilike.%${query}%`)
      .eq('is_active', true);
    
    if (error) throw error;
    return (data || []).map(mapDbToProperty);
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
    duration?: number;
  }) {
    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        user_id: booking.userId,
        property_id: booking.propertyId,
        room_type: booking.roomType,
        check_in_date: booking.checkInDate,
        total_amount: booking.totalAmount,
        duration: booking.duration || 1,
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

// Payment Operations
export const paymentOperations = {
  // Create payment record
  async create(payment: {
    bookingId?: string;
    userId?: string;
    propertyId: string;
    razorpayOrderId: string;
    amount: number;
    currency?: string;
    notes?: any;
  }) {
    const { data, error } = await supabase
      .from('payments')
      .insert([{
        booking_id: payment.bookingId,
        user_id: payment.userId,
        property_id: payment.propertyId,
        razorpay_order_id: payment.razorpayOrderId,
        amount: payment.amount,
        currency: payment.currency || 'INR',
        status: 'pending',
        notes: payment.notes,
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update payment after successful payment
  async updateSuccess(orderId: string, paymentDetails: {
    razorpayPaymentId: string;
    razorpaySignature: string;
    paymentMethod?: string;
  }) {
    const { data, error } = await supabase
      .from('payments')
      .update({
        razorpay_payment_id: paymentDetails.razorpayPaymentId,
        razorpay_signature: paymentDetails.razorpaySignature,
        payment_method: paymentDetails.paymentMethod,
        status: 'success',
      })
      .eq('razorpay_order_id', orderId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Mark payment as failed
  async updateFailed(orderId: string) {
    const { data, error } = await supabase
      .from('payments')
      .update({ status: 'failed' })
      .eq('razorpay_order_id', orderId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get payment by order ID
  async getByOrderId(orderId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('razorpay_order_id', orderId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get all payments for a user
  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        properties (name, location, address, city),
        bookings (check_in_date, room_type)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get all payments (admin)
  async getAll() {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        properties (name, location, address, city),
        bookings (check_in_date, room_type)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
};
