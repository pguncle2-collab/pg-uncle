import { NextRequest, NextResponse } from 'next/server';
import { supabaseBookingOperations } from '@/lib/supabaseOperations';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('💰 Monthly Payment: Starting...');
    const body = await request.json();
    console.log('📦 Monthly Payment: Request body:', body);
    
    const {
      bookingId,
      month,
      paymentDetails,
    } = body;

    // Validate required fields
    if (!bookingId) {
      console.error('❌ Monthly Payment: Missing bookingId');
      return NextResponse.json(
        { error: 'Missing booking ID' },
        { status: 400 }
      );
    }

    if (!month) {
      console.error('❌ Monthly Payment: Missing month');
      return NextResponse.json(
        { error: 'Missing month number' },
        { status: 400 }
      );
    }

    if (!paymentDetails) {
      console.error('❌ Monthly Payment: Missing paymentDetails');
      return NextResponse.json(
        { error: 'Missing payment details' },
        { status: 400 }
      );
    }

    console.log('🔍 Monthly Payment: Fetching booking:', bookingId);

    // Get the booking
    const bookings = await supabaseBookingOperations.getAll();
    const bookingData = bookings.find(b => b.id === bookingId);
    
    if (!bookingData) {
      console.error('❌ Monthly Payment: Booking not found:', bookingId);
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    console.log('📋 Monthly Payment: Current booking data:', {
      id: bookingId,
      month,
      duration: bookingData.duration,
      paidMonths: bookingData.paidMonths,
      monthlyPayments: bookingData.monthlyPayments?.length || 0
    });

    const monthlyPayments = bookingData.monthlyPayments || [];
    
    if (monthlyPayments.length === 0) {
      console.error('❌ Monthly Payment: No monthly payments found');
      return NextResponse.json(
        { error: 'No monthly payment schedule found' },
        { status: 400 }
      );
    }
    
    // Find the payment for this month
    const paymentIndex = monthlyPayments.findIndex((p: any) => p.month === month);
    
    if (paymentIndex === -1) {
      console.error('❌ Monthly Payment: Month not found:', month);
      return NextResponse.json(
        { error: `Payment for month ${month} not found` },
        { status: 404 }
      );
    }

    console.log('📝 Monthly Payment: Found payment at index:', paymentIndex);
    console.log('📝 Monthly Payment: Current status:', monthlyPayments[paymentIndex].status);

    // Update the payment status
    monthlyPayments[paymentIndex] = {
      ...monthlyPayments[paymentIndex],
      status: 'paid',
      paymentId: paymentDetails.razorpay_payment_id,
      paidAt: new Date().toISOString(),
    };

    // Calculate next payment due date
    const paidMonths = monthlyPayments.filter((p: any) => p.status === 'paid').length;
    const nextPendingPayment = monthlyPayments.find((p: any) => p.status === 'pending');
    const nextPaymentDue = nextPendingPayment ? nextPendingPayment.dueDate : null;

    console.log('📊 Monthly Payment: Stats:', {
      paidMonths,
      totalMonths: bookingData.duration,
      nextPaymentDue: nextPaymentDue ? 'Set' : 'None'
    });

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Update the booking - only include defined values
    const updateData: any = {
      monthly_payments: monthlyPayments,
      paid_months: paidMonths,
      updated_at: new Date().toISOString(),
    };
    
    // Only update nextPaymentDue if it's defined
    if (nextPaymentDue !== undefined && nextPaymentDue !== null) {
      updateData.next_payment_due = nextPaymentDue;
    }

    await supabaseAdmin.from('bookings').update(updateData).eq('id', bookingId);

    console.log('✅ Monthly Payment: Successfully updated booking');

    return NextResponse.json(
      { success: true, message: 'Payment recorded successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Monthly Payment Error:', error);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error.message,
        code: error.code 
      },
      { status: 500 }
    );
  }
}
