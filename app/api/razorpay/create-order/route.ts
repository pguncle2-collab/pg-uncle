import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Function to get Razorpay instance
function getRazorpayInstance() {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials not configured');
  }

  console.log('🔧 Initializing Razorpay with key:', keyId.substring(0, 15) + '...');

  try {
    return new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  } catch (error: any) {
    console.error('❌ Failed to initialize Razorpay:', error);
    throw new Error(`Razorpay initialization failed: ${error.message}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Razorpay: Creating order...');
    
    // Check if Razorpay is configured
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    console.log('🔑 Razorpay Key ID:', keyId ? `${keyId.substring(0, 10)}...` : 'NOT SET');
    console.log('🔑 Razorpay Key Secret:', keySecret ? 'SET' : 'NOT SET');

    if (!keyId || !keySecret) {
      console.error('❌ Razorpay credentials not configured');
      return NextResponse.json(
        { error: 'Payment gateway not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    console.log('📦 Request body:', body);
    
    const { amount, currency = 'INR', receipt, notes } = body;

    // Validate amount
    if (!amount || amount <= 0) {
      console.error('❌ Invalid amount:', amount);
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    console.log('💰 Creating order for amount:', amount, currency);

    // Get Razorpay instance and create order
    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {},
    });

    console.log('✅ Order created successfully:', order.id);

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error('❌ Error creating Razorpay order:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { 
        error: 'Failed to create order',
        message: error.message,
        details: error.toString()
      },
      { status: 500 }
    );
  }
}
