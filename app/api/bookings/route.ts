import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      propertyId,
      roomType,
      moveInDate,
      duration,
      totalAmount,
      specialRequests,
    } = body;

    // Validate required fields
    if (!userId || !propertyId || !roomType || !moveInDate || !duration || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert booking into database
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          user_id: userId,
          property_id: propertyId,
          room_type: roomType,
          check_in_date: moveInDate,
          duration: duration,
          total_amount: totalAmount,
          special_requests: specialRequests || null,
          status: 'pending',
          payment_id: `PAY${Date.now()}`, // Generate a temporary payment ID
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      
      // Check if it's a column missing error
      if (error.message.includes('column') && error.message.includes('does not exist')) {
        return NextResponse.json(
          { 
            error: 'Database setup incomplete. Please run UPDATE_BOOKINGS_TABLE.sql in Supabase SQL Editor.',
            details: error.message 
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to create booking', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, booking: data },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error in booking API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
