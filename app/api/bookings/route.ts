import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getDatabaseErrorMessage } from '@/lib/dbHealthCheck';
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
      paymentDetails,
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
    
    // Determine booking status based on payment
    const bookingStatus = paymentDetails ? 'confirmed' : 'pending';
    const paymentId = paymentDetails?.razorpay_payment_id || `PAY${Date.now()}`;
    
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
          status: bookingStatus,
          payment_id: paymentId,
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
      
      // Use better error messaging
      const errorMessage = getDatabaseErrorMessage(error);
      
      return NextResponse.json(
        { error: errorMessage, details: error.message, code: error.code },
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
        const emailSubject = paymentDetails 
          ? '✅ Payment Successful - Booking Confirmed - PGUNCLE'
          : '🎉 Booking Confirmed - PGUNCLE';
        
        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: user?.email,
          subject: emailSubject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                <h2 style="color: white; margin: 0;">🎉 Booking Confirmed!</h2>
                ${paymentDetails ? '<p style="color: white; margin: 10px 0 0 0;">Payment Successful</p>' : ''}
              </div>
              
              <div style="background: white; padding: 30px; border: 1px solid #E5E7EB; border-top: none;">
                <p style="font-size: 16px; color: #374151;">Dear ${user?.full_name || 'User'},</p>
                <p style="font-size: 16px; color: #374151;">
                  ${paymentDetails 
                    ? 'Your payment has been successfully processed and your booking is confirmed!' 
                    : 'Your booking has been confirmed. Here are the details:'}
                </p>
                
                ${paymentDetails ? `
                <div style="background: #ECFDF5; border-left: 4px solid #10B981; padding: 15px; margin: 20px 0; border-radius: 4px;">
                  <h3 style="margin: 0 0 10px 0; color: #065F46; font-size: 16px;">Payment Receipt</h3>
                  <p style="margin: 5px 0; color: #065F46;"><strong>Payment ID:</strong> ${paymentDetails.razorpay_payment_id}</p>
                  <p style="margin: 5px 0; color: #065F46;"><strong>Order ID:</strong> ${paymentDetails.razorpay_order_id}</p>
                  <p style="margin: 5px 0; color: #065F46;"><strong>Amount Paid:</strong> ₹${totalAmount.toLocaleString()}</p>
                  <p style="margin: 5px 0; color: #065F46;"><strong>Payment Date:</strong> ${new Date().toLocaleString()}</p>
                  <p style="margin: 5px 0; color: #065F46;"><strong>Status:</strong> <span style="color: #10B981; font-weight: bold;">SUCCESS</span></p>
                </div>
                ` : ''}
                
                <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #1F2937;">Booking Details</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #6B7280;">Booking ID:</td>
                      <td style="padding: 8px 0; color: #1F2937; font-weight: 600;">${data.id}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6B7280;">Property:</td>
                      <td style="padding: 8px 0; color: #1F2937; font-weight: 600;">${property?.name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6B7280;">Location:</td>
                      <td style="padding: 8px 0; color: #1F2937;">${property?.address}, ${property?.city}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6B7280;">Room Type:</td>
                      <td style="padding: 8px 0; color: #1F2937;">${roomType} Sharing</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6B7280;">Move-in Date:</td>
                      <td style="padding: 8px 0; color: #1F2937;">${new Date(moveInDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6B7280;">Duration:</td>
                      <td style="padding: 8px 0; color: #1F2937;">${duration} month(s)</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6B7280; border-top: 2px solid #D1D5DB; padding-top: 12px;">Total Amount:</td>
                      <td style="padding: 8px 0; color: #1F2937; font-weight: bold; font-size: 18px; border-top: 2px solid #D1D5DB; padding-top: 12px;">₹${totalAmount.toLocaleString()}</td>
                    </tr>
                    ${specialRequests ? `
                    <tr>
                      <td style="padding: 8px 0; color: #6B7280; vertical-align: top;">Special Requests:</td>
                      <td style="padding: 8px 0; color: #1F2937;">${specialRequests}</td>
                    </tr>
                    ` : ''}
                  </table>
                </div>

                <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0; border-radius: 4px;">
                  <p style="margin: 0; color: #92400E; font-size: 14px;">
                    <strong>Next Steps:</strong> Our team will contact you within 24 hours to coordinate your move-in and provide property access details.
                  </p>
                </div>
                
                <p style="color: #6B7280; font-size: 14px; margin-top: 30px; border-top: 1px solid #E5E7EB; padding-top: 20px;">
                  If you have any questions, please contact us at <a href="mailto:info@pguncle.com" style="color: #3B82F6;">info@pguncle.com</a>
                </p>
                
                <p style="color: #1F2937; margin-top: 20px;">Best regards,<br><strong>Team PGUNCLE</strong></p>
              </div>
              
              <div style="background: #F9FAFB; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
                <p style="color: #6B7280; font-size: 12px; margin: 0;">
                  This is an automated email. Please do not reply to this email.
                </p>
              </div>
            </div>
          `,
        });

        console.log('✅ Booking confirmation email sent to user successfully');
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
