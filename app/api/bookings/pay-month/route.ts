import { NextRequest, NextResponse } from 'next/server';
import { firebaseBookingOperations } from '@/lib/firebaseOperations';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received monthly payment request:', body);
    
    const {
      bookingId,
      month,
      paymentDetails,
    } = body;

    // Validate required fields
    if (!bookingId || !month || !paymentDetails) {
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
    
    // Find the payment for this month
    const paymentIndex = monthlyPayments.findIndex((p: any) => p.month === month);
    
    if (paymentIndex === -1) {
      return NextResponse.json(
        { error: 'Payment month not found' },
        { status: 404 }
      );
    }

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

    // Update the booking
    await updateDoc(bookingRef, {
      monthlyPayments,
      paidMonths,
      nextPaymentDue,
      updatedAt: new Date().toISOString(),
    });

    console.log('Monthly payment updated successfully');

    return NextResponse.json(
      { success: true, message: 'Payment recorded successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in monthly payment API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
