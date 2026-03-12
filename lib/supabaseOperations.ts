import { createClient } from '@supabase/supabase-js';
import type { Property, User, Booking, Payment } from '@/types';

// Admin client to bypass RLS for server-side operations, similar to how supabase was acting with open rules
const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error(
      'Supabase configuration error: NEXT_PUBLIC_SUPABASE_URL is not set. ' +
      'Please add it to your .env.local file.'
    )
  }

  if (!serviceRoleKey) {
    throw new Error(
      'Supabase configuration error: SUPABASE_SERVICE_ROLE_KEY is not set. ' +
      'Please add it to your .env.local file. This is required for admin operations.'
    )
  }

  return createClient(supabaseUrl, serviceRoleKey)
}

// Helper to handle casing formats between camelCase (app) and snake_case (db)
// Only needed for mapping the db rows to the Types
const mapPropertyFields = (data: any): Property => ({
  id: data.id,
  name: data.name,
  location: data.location,
  address: data.address,
  city: data.city,
  rating: data.rating,
  reviews: data.reviews,
  type: data.type,
  availability: data.availability,
  image: data.image,
  images: data.images,
  price: data.price,
  gender: data.gender,
  description: data.description,
  amenities: data.amenities,
  houseRules: data.house_rules,
  nearbyPlaces: data.nearby_places,
  coordinates: data.coordinates,
  roomTypes: data.room_types,
  isActive: data.is_active,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
});

const mapUserFields = (data: any): User => ({
  id: data.id,
  email: data.email,
  fullName: data.full_name,
  phone: data.phone,
  role: data.role,
  image: data.image,
  createdAt: data.created_at,
});

const mapBookingFields = (data: any): Booking => ({
  id: data.id,
  userId: data.user_id,
  propertyId: data.property_id,
  roomType: data.room_type,
  checkInDate: data.check_in_date,
  duration: data.duration,
  totalAmount: data.total_amount,
  specialRequests: data.special_requests,
  status: data.status,
  paymentId: data.payment_id,
  paymentType: data.payment_type,
  monthlyRent: data.monthly_rent,
  depositAmount: data.deposit_amount,
  paidMonths: data.paid_months,
  nextPaymentDue: data.next_payment_due,
  monthlyPayments: data.monthly_payments,
  createdAt: data.created_at,
});

const mapPaymentFields = (data: any): Payment => ({
  id: data.id,
  userId: data.user_id,
  bookingId: data.booking_id,
  orderId: data.order_id,
  paymentId: data.payment_id,
  signature: data.signature,
  amount: data.amount,
  currency: data.currency,
  status: data.status,
  failureReason: data.failure_reason,
  createdAt: data.created_at,
});


// ============================================
// PROPERTY OPERATIONS
// ============================================

export const supabasePropertyOperations = {
  async getAll(): Promise<Property[]> {
    const { data, error } = await getSupabaseAdmin().from('properties').select('*');
    if (error) throw error;
    return (data || []).map(mapPropertyFields);
  },

  async getById(id: string): Promise<Property | null> {
    const { data, error } = await getSupabaseAdmin().from('properties').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is no rows
    if (!data) return null;
    return mapPropertyFields(data);
  },

  async getByCity(city: string): Promise<Property[]> {
    const { data, error } = await getSupabaseAdmin().from('properties').select('*').eq('city', city);
    if (error) throw error;
    return (data || []).map(mapPropertyFields);
  },

  async create(propertyData: Omit<Property, 'id'>): Promise<Property> {
    const dbData = {
      name: propertyData.name,
      location: propertyData.location,
      address: propertyData.address,
      city: propertyData.city,
      rating: propertyData.rating,
      reviews: propertyData.reviews,
      type: propertyData.type,
      availability: propertyData.availability,
      image: propertyData.image,
      images: propertyData.images,
      price: propertyData.price,
      gender: propertyData.gender,
      description: propertyData.description,
      amenities: propertyData.amenities,
      house_rules: propertyData.houseRules,
      nearby_places: propertyData.nearbyPlaces,
      coordinates: propertyData.coordinates,
      room_types: propertyData.roomTypes,
      is_active: propertyData.isActive !== false,
    };
    const { data, error } = await getSupabaseAdmin().from('properties').insert(dbData).select().single();
    if (error) throw error;
    return mapPropertyFields(data);
  },

  async update(id: string, updates: Partial<Property>): Promise<Property> {
    const dbData: any = {};
    if (updates.name !== undefined) dbData.name = updates.name;
    if (updates.location !== undefined) dbData.location = updates.location;
    if (updates.address !== undefined) dbData.address = updates.address;
    if (updates.city !== undefined) dbData.city = updates.city;
    if (updates.rating !== undefined) dbData.rating = updates.rating;
    if (updates.reviews !== undefined) dbData.reviews = updates.reviews;
    if (updates.type !== undefined) dbData.type = updates.type;
    if (updates.availability !== undefined) dbData.availability = updates.availability;
    if (updates.image !== undefined) dbData.image = updates.image;
    if (updates.images !== undefined) dbData.images = updates.images;
    if (updates.price !== undefined) dbData.price = updates.price;
    if (updates.gender !== undefined) dbData.gender = updates.gender;
    if (updates.description !== undefined) dbData.description = updates.description;
    if (updates.amenities !== undefined) dbData.amenities = updates.amenities;
    if (updates.houseRules !== undefined) dbData.house_rules = updates.houseRules;
    if (updates.nearbyPlaces !== undefined) dbData.nearby_places = updates.nearbyPlaces;
    if (updates.coordinates !== undefined) dbData.coordinates = updates.coordinates;
    if (updates.roomTypes !== undefined) dbData.room_types = updates.roomTypes;
    if (updates.isActive !== undefined) dbData.is_active = updates.isActive;
    dbData.updated_at = new Date().toISOString();

    const { data, error } = await getSupabaseAdmin().from('properties').update(dbData).eq('id', id).select().single();
    if (error) throw error;
    return mapPropertyFields(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await getSupabaseAdmin().from('properties').delete().eq('id', id);
    if (error) throw error;
  },

  async toggleActive(id: string, isActive: boolean): Promise<Property> {
    return this.update(id, { isActive });
  },
};

// ============================================
// USER OPERATIONS
// ============================================

export const supabaseUserOperations = {
  async getAll(): Promise<User[]> {
    const { data, error } = await getSupabaseAdmin().from('users').select('*');
    if (error) throw error;
    return (data || []).map(mapUserFields);
  },

  async getByEmail(email: string): Promise<User | null> {
    const { data, error } = await getSupabaseAdmin().from('users').select('*').eq('email', email).limit(1);
    if (error) throw error;
    if (!data || data.length === 0) return null;
    return mapUserFields(data[0]);
  },

  async getById(id: string): Promise<User | null> {
    const { data, error } = await getSupabaseAdmin().from('users').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    return mapUserFields(data);
  },

  async create(userData: Omit<User, 'id'>): Promise<User> {
    const dbData = {
      email: userData.email,
      full_name: userData.fullName || userData.name || '',
      phone: userData.phone,
      role: userData.role || 'user',
      image: userData.image,
    };
    const { data, error } = await getSupabaseAdmin().from('users').insert(dbData).select().single();
    if (error) throw error;
    return mapUserFields(data);
  },

  async update(id: string, updates: Partial<User>): Promise<User> {
    const dbData: any = {};
    if (updates.email !== undefined) dbData.email = updates.email;
    if (updates.fullName !== undefined) dbData.full_name = updates.fullName;
    if (updates.name !== undefined) dbData.full_name = updates.name;
    if (updates.phone !== undefined) dbData.phone = updates.phone;
    if (updates.role !== undefined) dbData.role = updates.role;
    if (updates.image !== undefined) dbData.image = updates.image;
    dbData.updated_at = new Date().toISOString();

    const { data, error } = await getSupabaseAdmin().from('users').update(dbData).eq('id', id).select().single();
    if (error) throw error;
    return mapUserFields(data);
  },
};

// ============================================
// BOOKING OPERATIONS
// ============================================

export const supabaseBookingOperations = {
  async create(bookingData: Omit<Booking, 'id'>): Promise<Booking> {
    const dbData = {
      user_id: bookingData.userId,
      property_id: bookingData.propertyId,
      room_type: bookingData.roomType,
      check_in_date: bookingData.checkInDate,
      duration: bookingData.duration,
      total_amount: bookingData.totalAmount,
      special_requests: bookingData.specialRequests,
      status: bookingData.status,
      payment_id: bookingData.paymentId,
      payment_type: bookingData.paymentType,
      monthly_rent: bookingData.monthlyRent,
      deposit_amount: bookingData.depositAmount,
      paid_months: bookingData.paidMonths,
      next_payment_due: bookingData.nextPaymentDue,
      monthly_payments: bookingData.monthlyPayments,
    };
    const { data, error } = await getSupabaseAdmin().from('bookings').insert(dbData).select().single();
    if (error) throw error;
    return mapBookingFields(data);
  },

  async getByUserId(userId: string): Promise<Booking[]> {
    const { data, error } = await getSupabaseAdmin().from('bookings').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapBookingFields);
  },

  async getAll(): Promise<Booking[]> {
    const { data, error } = await getSupabaseAdmin().from('bookings').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapBookingFields);
  },

  async updateStatus(id: string, status: string): Promise<Booking> {
    const { data, error } = await getSupabaseAdmin().from('bookings').update({ status, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (error) throw error;
    return mapBookingFields(data);
  },
};

// ============================================
// PAYMENT OPERATIONS
// ============================================

export const supabasePaymentOperations = {
  async create(paymentData: Omit<Payment, 'id'>): Promise<Payment> {
    const dbData = {
      user_id: paymentData.userId,
      booking_id: paymentData.bookingId,
      order_id: paymentData.orderId,
      payment_id: paymentData.paymentId,
      signature: paymentData.signature,
      amount: paymentData.amount,
      currency: paymentData.currency || 'INR',
      status: paymentData.status || 'pending',
      failure_reason: paymentData.failureReason,
    };
    const { data, error } = await getSupabaseAdmin().from('payments').insert(dbData).select().single();
    if (error) throw error;
    return mapPaymentFields(data);
  },

  async updateSuccess(orderId: string, paymentId: string, signature: string): Promise<Payment> {
    const { data, error } = await getSupabaseAdmin().from('payments')
      .update({ payment_id: paymentId, signature: signature, status: 'success', updated_at: new Date().toISOString() })
      .eq('order_id', orderId)
      .select().single();
    if (error) throw error;
    return mapPaymentFields(data);
  },

  async updateFailed(orderId: string, reason: string): Promise<Payment> {
    const { data, error } = await getSupabaseAdmin().from('payments')
      .update({ status: 'failed', failure_reason: reason, updated_at: new Date().toISOString() })
      .eq('order_id', orderId)
      .select().single();
    if (error) throw error;
    return mapPaymentFields(data);
  },

  async getByOrderId(orderId: string): Promise<Payment | null> {
    const { data, error } = await getSupabaseAdmin().from('payments').select('*').eq('order_id', orderId).limit(1);
    if (error) throw error;
    if (!data || data.length === 0) return null;
    return mapPaymentFields(data[0]);
  },

  async getByUserId(userId: string): Promise<Payment[]> {
    const { data, error } = await getSupabaseAdmin().from('payments').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapPaymentFields);
  },

  async getAll(): Promise<Payment[]> {
    const { data, error } = await getSupabaseAdmin().from('payments').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapPaymentFields);
  },
};

