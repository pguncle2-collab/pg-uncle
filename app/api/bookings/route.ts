import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received booking request:', body);
    
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
      console.error('Missing required fields:', { userId, propertyId, roomType, moveInDate, duration, totalAmount });
      return NextResponse.json(
        { error: 'Missing required fields', missingFields: {
          userId: !userId,
          propertyId: !propertyId,
          roomType: !roomType,
          moveInDate: !moveInDate,
          duration: !duration,
          totalAmount: !totalAmount
        }},
        { status: 400 }
      );
    }

    console.log('Inserting booking into database...');
    
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
      console.error('Supabase error creating booking:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      
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
        { error: 'Failed to create booking', details: error.message, code: error.code },
        { status: 500 }
      );
    }

    console.log('Booking created successfully:', data);
    
    return NextResponse.json(
      { success: true, booking: data },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error in booking API:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
