import { NextRequest, NextResponse } from 'next/server';
import { firebaseBookingOperations, firebaseUserOperations, firebasePropertyOperations } from '@/lib/firebaseOperations';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📥 Received booking request');
    console.log('📋 User ID:', body.userId);
    console.log('📋 Property ID:', body.propertyId);
    console.log('📋 Payment Type:', body.paymentType);
    console.log('📋 Duration:', body.duration);
    
    const {
      userId,
      propertyId,
      roomType,
      moveInDate,
      duration,
      totalAmount,
      specialRequests,
      paymentDetails,
      paymentType,
      monthlyRent,
      depositAmount,
      paidMonths,
    } = body;

    // Validate required fields
    if (!userId || !propertyId || !roomType || !moveInDate || !duration || !totalAmount) {
      console.error('❌ Missing required fields:', { userId, propertyId, roomType, moveInDate, duration, totalAmount });
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

    console.log('✅ All required fields present');
    console.log('🔥 Creating booking in Firebase...');
    
    // Determine booking status based on payment
    const bookingStatus = paymentDetails ? 'confirmed' : 'pending';
    const paymentId = paymentDetails?.razorpay_payment_id || `PAY${Date.now()}`;
    
    // Calculate next payment due date for monthly payments
    let nextPaymentDue = null;
    const monthlyPayments = [];
    
    if (paymentType === 'monthly' && paidMonths && duration) {
      const checkInDate = new Date(moveInDate);
      // Next payment due is one month after check-in
      const nextDue = new Date(checkInDate);
      nextDue.setMonth(nextDue.getMonth() + 1);
      nextPaymentDue = nextDue.toISOString();
      
      // Create monthly payment schedule
      for (let i = 1; i <= duration; i++) {
        const dueDate = new Date(checkInDate);
        dueDate.setMonth(dueDate.getMonth() + i - 1);
        
        monthlyPayments.push({
          month: i,
          amount: monthlyRent || 0,
          status: (i <= paidMonths ? 'paid' : 'pending') as 'paid' | 'pending',
          dueDate: dueDate.toISOString(),
          paymentId: i === 1 ? paymentId : undefined,
          paidAt: i === 1 ? new Date().toISOString() : undefined,
        });
      }
    }
    
    // Create booking
    const booking = await firebaseBookingOperations.create({
      userId,
      propertyId,
      roomType,
      checkInDate: moveInDate,
      duration,
      totalAmount,
      specialRequests: specialRequests || null,
      status: bookingStatus,
      paymentId,
      paymentType: paymentType || 'full',
      monthlyRent: monthlyRent || undefined,
      depositAmount: depositAmount || undefined,
      paidMonths: paidMonths || duration,
      nextPaymentDue: nextPaymentDue || undefined,
      monthlyPayments: monthlyPayments.length > 0 ? monthlyPayments : undefined,
    });

    console.log('✅ Booking created successfully in Firebase');
    console.log('📋 Booking ID:', booking.id);
    console.log('📋 Payment ID:', paymentId);
    console.log('📋 Status:', bookingStatus);

    // Get user and property details for email
    const user = await firebaseUserOperations.getById(userId);
    const property = await firebasePropertyOperations.getById(propertyId);

    console.log('📧 Preparing to send confirmation email...');
    console.log('User email:', user?.email);
    console.log('Property:', property?.name);

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
                <p style="font-size: 16px; color: #374151;">Dear ${user?.fullName || 'User'},</p>
                <p style="font-size: 16px; color: #374151;">
                  ${paymentDetails 
                    ? 'Your payment has been successfully processed and your booking is confirmed!' 
                    : 'Your booking has been confirmed. Here are the details:'}
                </p>
                
                <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #1F2937;">Booking Details</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #6B7280;">Booking ID:</td>
                      <td style="padding: 8px 0; color: #1F2937; font-weight: 600;">${booking.id}</td>
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
                      <td style="padding: 8px 0; color: #1F2937;">${roomType} Sharing${roomType !== 'Single' ? ' (Price per bed)' : ''}</td>
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
                  </table>
                </div>
                
                <p style="color: #1F2937; margin-top: 20px;">Best regards,<br><strong>Team PGUNCLE</strong></p>
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
      { success: true, booking },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ ERROR in booking API:', error);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error stack:', error.stack);
    
    // Check for specific Firebase errors
    if (error.code === 'permission-denied') {
      return NextResponse.json(
        { 
          error: 'Permission denied',
          details: 'Firebase security rules are blocking this operation. Please check Firestore rules.',
          message: error.message
        },
        { status: 403 }
      );
    }
    
    if (error.code === 'unavailable') {
      return NextResponse.json(
        { 
          error: 'Firebase unavailable',
          details: 'Cannot connect to Firebase. Please check your internet connection and Firebase configuration.',
          message: error.message
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error.message,
        code: error.code,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
