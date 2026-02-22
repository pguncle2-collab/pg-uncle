import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import nodemailer from 'nodemailer';

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

    // Get user and property details for email
    const { data: user } = await supabase
      .from('users')
      .select('email, full_name')
      .eq('id', userId)
      .single();

    const { data: property } = await supabase
      .from('properties')
      .select('name, address, city')
      .eq('id', propertyId)
      .single();

    // Send email notifications
    try {
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_PORT === '465',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        // Email to user
        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: user?.email,
          subject: '🎉 Booking Confirmed - PGUNCLE',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #3B82F6;">Booking Confirmed!</h2>
              <p>Dear ${user?.full_name || 'User'},</p>
              <p>Your booking has been confirmed. Here are the details:</p>
              
              <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Booking Details</h3>
                <p><strong>Property:</strong> ${property?.name}</p>
                <p><strong>Location:</strong> ${property?.address}, ${property?.city}</p>
                <p><strong>Room Type:</strong> ${roomType} Sharing</p>
                <p><strong>Move-in Date:</strong> ${new Date(moveInDate).toLocaleDateString()}</p>
                <p><strong>Duration:</strong> ${duration} month(s)</p>
                <p><strong>Total Amount:</strong> ₹${totalAmount.toLocaleString()}</p>
                ${specialRequests ? `<p><strong>Special Requests:</strong> ${specialRequests}</p>` : ''}
              </div>

              <p>We will contact you shortly to finalize the details.</p>
              
              <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
                If you have any questions, please contact us at info@pguncle.com
              </p>
              
              <p>Best regards,<br>Team PGUNCLE</p>
            </div>
          `,
        });

        // Email to admin
        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: process.env.ADMIN_EMAIL || 'info@pguncle.com',
          replyTo: user?.email,
          subject: '🔔 New Booking Received - PGUNCLE',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #10B981;">New Booking Received!</h2>
              
              <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Customer Details</h3>
                <p><strong>Name:</strong> ${user?.full_name}</p>
                <p><strong>Email:</strong> ${user?.email}</p>
                
                <h3>Booking Details</h3>
                <p><strong>Property:</strong> ${property?.name}</p>
                <p><strong>Location:</strong> ${property?.address}, ${property?.city}</p>
                <p><strong>Room Type:</strong> ${roomType} Sharing</p>
                <p><strong>Move-in Date:</strong> ${new Date(moveInDate).toLocaleDateString()}</p>
                <p><strong>Duration:</strong> ${duration} month(s)</p>
                <p><strong>Total Amount:</strong> ₹${totalAmount.toLocaleString()}</p>
                ${specialRequests ? `<p><strong>Special Requests:</strong> ${specialRequests}</p>` : ''}
                
                <p><strong>Booking ID:</strong> ${data.id}</p>
                <p><strong>Status:</strong> Pending</p>
              </div>

              <p style="color: #EF4444; font-weight: bold;">Action Required: Contact the customer to confirm booking details.</p>
            </div>
          `,
        });

        console.log('✅ Booking confirmation emails sent successfully');
      } else {
        console.warn('⚠️ SMTP not configured. Booking created but emails not sent.');
      }
    } catch (emailError: any) {
      console.error('Error sending booking emails:', emailError);
      // Don't fail the booking if email fails
    }
    
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
