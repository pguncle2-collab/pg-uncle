import { NextRequest, NextResponse } from 'next/server';
import { supabaseBookingOperations } from '@/lib/supabaseOperations';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('💰 Complete Payment: Starting...');
    const body = await request.json();
    console.log('📦 Complete Payment: Request body:', body);
    
    const {
      bookingId,
      paymentDetails,
    } = body;

    // Validate required fields
    if (!bookingId) {
      console.error('❌ Complete Payment: Missing bookingId');
      return NextResponse.json(
        { error: 'Missing booking ID' },
        { status: 400 }
      );
    }

    if (!paymentDetails) {
      console.error('❌ Complete Payment: Missing paymentDetails');
      return NextResponse.json(
        { error: 'Missing payment details' },
        { status: 400 }
      );
    }

    console.log('🔍 Complete Payment: Fetching booking:', bookingId);
    
    // Get the booking
    const bookings = await supabaseBookingOperations.getAll();
    const bookingData = bookings.find(b => b.id === bookingId);
    
    if (!bookingData) {
      console.error('❌ Complete Payment: Booking not found:', bookingId);
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    console.log('📋 Complete Payment: Current booking data:', {
      id: bookingId,
      duration: bookingData.duration,
      paidMonths: bookingData.paidMonths,
      monthlyPayments: bookingData.monthlyPayments?.length || 0
    });

    const monthlyPayments = bookingData.monthlyPayments || [];
    
    if (monthlyPayments.length === 0) {
      console.error('❌ Complete Payment: No monthly payments found');
      return NextResponse.json(
        { error: 'No monthly payment schedule found' },
        { status: 400 }
      );
    }

    // Count pending payments
    const pendingCount = monthlyPayments.filter((p: any) => p.status === 'pending').length;
    console.log('📊 Complete Payment: Pending payments:', pendingCount);

    if (pendingCount === 0) {
      console.log('✅ Complete Payment: All payments already completed');
      return NextResponse.json(
        { success: true, message: 'All months already paid' },
        { status: 200 }
      );
    }
    
    // Update all pending payments to paid
    const updatedPayments = monthlyPayments.map((payment: any) => {
      if (payment.status === 'pending') {
        return {
          ...payment,
          status: 'paid',
          paymentId: paymentDetails.razorpay_payment_id,
          paidAt: new Date().toISOString(),
        };
      }
      return payment;
    });

    console.log('📝 Complete Payment: Updated payments:', updatedPayments.length);

    // Update the booking - using our created supabaseBookingOperations method or updating directly
    // Since supabaseBookingOperations doesn't have an update method natively, I'll update using admin client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('❌ Complete Payment: Missing Supabase environment variables');
      return NextResponse.json(
        { error: 'Configuration error: Missing Supabase credentials' },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
    
    // All months are now paid
    const paidMonths = bookingData.duration;

    const updateData: any = {
      monthly_payments: updatedPayments,
      paid_months: paidMonths,
      updated_at: new Date().toISOString(),
    };
    
    if (bookingData.nextPaymentDue !== undefined && bookingData.nextPaymentDue !== null) {
      updateData.next_payment_due = null;
    }

    await supabaseAdmin.from('bookings').update(updateData).eq('id', bookingId);

    console.log('✅ Complete Payment: Successfully updated booking');

    return NextResponse.json(
      { success: true, message: 'All remaining months paid successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Complete Payment Error:', error);
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
