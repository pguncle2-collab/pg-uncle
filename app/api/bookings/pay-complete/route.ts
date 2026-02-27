import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received complete payment request:', body);
    
    const {
      bookingId,
      paymentDetails,
    } = body;

    // Validate required fields
    if (!bookingId || !paymentDetails) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the booking
    const bookingRef = doc(db, 'bookings', bookingId);
    const bookingSnap = await getDoc(bookingRef);
    
    if (!bookingSnap.exists()) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    const bookingData = bookingSnap.data();
    const monthlyPayments = bookingData.monthlyPayments || [];
    
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

    // All months are now paid
    const paidMonths = bookingData.duration;

    // Update the booking
    await updateDoc(bookingRef, {
      monthlyPayments: updatedPayments,
      paidMonths,
      nextPaymentDue: null, // No more payments due
      updatedAt: new Date().toISOString(),
    });

    console.log('Complete payment updated successfully');

    return NextResponse.json(
      { success: true, message: 'All remaining months paid successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in complete payment API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
