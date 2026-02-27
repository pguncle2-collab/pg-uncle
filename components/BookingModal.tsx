'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { analytics } from '@/lib/analytics';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyName: string;
  roomType: string;
  price: number;
  depositAmount: number;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  propertyId,
  propertyName,
  roomType,
  price,
  depositAmount,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    moveInDate: '',
    duration: 6,
    specialRequests: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [reserveNow, setReserveNow] = useState(false);
  const [payMonthly, setPayMonthly] = useState(false);

  // Token amount for reservation (e.g., ₹2000)
  const TOKEN_AMOUNT = 2000;

  // Track modal open
  useEffect(() => {
    if (isOpen) {
      analytics.openBookingModal(propertyId, roomType, price);
    }
  }, [isOpen, propertyId, roomType, price]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const incrementDuration = () => {
    setFormData(prev => ({
      ...prev,
      duration: Math.min(prev.duration + 1, 24),
    }));
  };

  const decrementDuration = () => {
    setFormData(prev => ({
      ...prev,
      duration: Math.max(prev.duration - 1, 1),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('🚀 Starting payment flow...');
      console.log('📋 User:', user?.email);
      console.log('📋 Property:', propertyId);
      console.log('📋 Room Type:', roomType);
      
      // Determine payment amount based on options
      let paymentAmount = totalAmount;
      let paymentType: 'full' | 'monthly' = 'full';
      
      if (payMonthly && formData.duration >= 2) {
        // For monthly payment, pay first month rent + deposit
        paymentAmount = price + depositAmount;
        paymentType = 'monthly';
        console.log('💳 Payment Type: Monthly');
        console.log('💰 First Month + Deposit:', paymentAmount);
      } else {
        console.log('💳 Payment Type: Full');
        console.log('💰 Total Amount:', paymentAmount);
      }
      
      analytics.initiateBooking(propertyId, roomType, paymentAmount);

      // Load Razorpay script
      console.log('📦 Loading Razorpay script...');
      const { loadRazorpayScript, initializeRazorpay, RAZORPAY_KEY_ID } = await import('@/lib/razorpay');
      
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        console.error('❌ Failed to load Razorpay script');
        throw new Error('Failed to load Razorpay. Please try again.');
      }
      console.log('✅ Razorpay script loaded');

      // Create Razorpay order
      console.log('📝 Creating Razorpay order...');
      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: paymentAmount,
          currency: 'INR',
          receipt: `booking_${Date.now()}`,
          notes: {
            propertyId,
            roomType,
            duration: formData.duration.toString(),
            paymentType,
          },
        }),
      });

      console.log('📡 Order response status:', orderResponse.status);
      const orderData = await orderResponse.json();
      console.log('📡 Order response data:', orderData);
      
      if (!orderResponse.ok) {
        console.error('❌ Order creation failed:', orderData);
        // Check if it's a configuration error
        if (orderResponse.status === 503 && orderData.error === 'Payment gateway not configured') {
          throw new Error('Payment gateway is not configured. Please contact the administrator to set up Razorpay credentials.');
        }
        throw new Error(orderData.error || 'Failed to create payment order');
      }

      console.log('✅ Razorpay order created:', orderData.order.id);
      console.log('🎯 Opening Razorpay payment modal...');

      // Initialize Razorpay payment
      await initializeRazorpay({
        key: RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'PGUNCLE',
        description: paymentType === 'monthly' 
          ? `First Month Rent + Deposit - ${roomType} Room`
          : `${roomType} Room Booking`,
        order_id: orderData.order.id,
        prefill: {
          name: user?.fullName || 'User',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: '#3B82F6',
        },
        handler: async (response: any) => {
          console.log('🎉 Payment successful:', response);
          console.log('📝 Payment ID:', response.razorpay_payment_id);
          console.log('📝 Order ID:', response.razorpay_order_id);
          
          try {
            // Step 1: Verify payment signature
            console.log('🔐 Step 1: Verifying payment signature...');
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            console.log('📡 Verify response status:', verifyResponse.status);
            const verifyData = await verifyResponse.json();
            console.log('📡 Verify response data:', verifyData);

            if (!verifyData.success) {
              console.error('❌ Payment verification failed:', verifyData);
              throw new Error('Payment verification failed');
            }

            console.log('✅ Payment verified successfully');

            // Step 2: Create booking with payment details
            console.log('📦 Step 2: Creating booking...');
            console.log('📦 Booking data:', {
              userId: user?.id,
              propertyId,
              roomType,
              moveInDate: formData.moveInDate,
              duration: formData.duration,
              paymentType,
            });
            
            const bookingResponse = await fetch('/api/bookings', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId: user?.id,
                propertyId,
                roomType,
                moveInDate: formData.moveInDate,
                duration: formData.duration,
                totalAmount,
                specialRequests: formData.specialRequests,
                paymentType,
                monthlyRent: price,
                depositAmount,
                paidMonths: paymentType === 'monthly' ? 1 : formData.duration,
                paymentDetails: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
              }),
            });

            console.log('📡 Booking response status:', bookingResponse.status);
            
            let bookingData;
            try {
              bookingData = await bookingResponse.json();
              console.log('📡 Booking response data:', bookingData);
            } catch (parseError) {
              console.error('❌ Failed to parse booking response:', parseError);
              throw new Error('Server returned invalid response. Please contact support.');
            }

            if (!bookingResponse.ok) {
              console.error('❌ Booking creation failed:', bookingData);
              console.error('❌ Status:', bookingResponse.status);
              console.error('❌ Error:', bookingData.error);
              console.error('❌ Details:', bookingData.details);
              throw new Error(bookingData.error || bookingData.details || 'Failed to create booking');
            }

            console.log('✅ Booking created successfully:', bookingData);
            console.log('✅ Payment ID:', response.razorpay_payment_id);
            console.log('✅ Booking ID:', bookingData.booking?.id);
            
            analytics.completeBooking(propertyId, roomType, paymentAmount, response.razorpay_payment_id);
            analytics.paymentSuccess(paymentAmount, response.razorpay_payment_id);
            setIsSubmitting(false);
            setSubmitSuccess(true);

            console.log('⏱️ Waiting 2 seconds before reload...');
            setTimeout(() => {
              setSubmitSuccess(false);
              setFormData({ moveInDate: '', duration: 6, specialRequests: '' });
              onClose();
              console.log('🔄 Reloading page to show updated bookings...');
              // Refresh the page to show updated bookings
              window.location.reload();
            }, 2000);
          } catch (bookingError: any) {
            console.error('❌ ERROR in booking creation:', bookingError);
            console.error('❌ Error message:', bookingError.message);
            console.error('❌ Error stack:', bookingError.stack);
            setIsSubmitting(false);
            alert(`Payment successful but booking failed: ${bookingError.message}\n\nPlease contact support with payment ID: ${response.razorpay_payment_id}`);
          }
        },
        modal: {
          ondismiss: () => {
            console.log('⚠️ Payment modal dismissed by user');
            analytics.cancelBooking(propertyId, roomType);
            setIsSubmitting(false);
          },
        },
      });

      console.log('✅ Razorpay initialized successfully');

    } catch (error: any) {
      console.error('❌ ERROR in payment flow:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      analytics.paymentFailed(totalAmount, error.message);
      analytics.error('payment_flow', error.message);
      setIsSubmitting(false);
      alert(`Failed to initiate payment: ${error.message}\n\nPlease check the console for more details.`);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  const GST_RATE = 0.18; // 18% GST
  
  // Calculate discount based on duration
  const getDiscount = () => {
    if (formData.duration >= 12) {
      return { amount: 0, freeMonths: 1, label: '1 Month Free' };
    } else if (formData.duration >= 6) {
      return { amount: 3000, freeMonths: 0, label: '₹3,000 Off' };
    } else if (formData.duration >= 3) {
      return { amount: 1000, freeMonths: 0, label: '₹1,000 Off' };
    }
    return { amount: 0, freeMonths: 0, label: null };
  };

  const discount = getDiscount();
  
  // Calculate rent with discount
  let totalRentForDuration = price * formData.duration;
  let discountAmount = 0;
  
  if (discount.freeMonths > 0) {
    // For 12+ months: Pay for (duration - 1) months
    totalRentForDuration = price * (formData.duration - discount.freeMonths);
    discountAmount = price * discount.freeMonths;
  } else if (discount.amount > 0) {
    // For 3-6 months: Apply fixed discount amount
    discountAmount = discount.amount;
    totalRentForDuration = totalRentForDuration - discountAmount;
  }
  
  // Calculate base amounts (price already includes GST)
  const baseRent = Math.round(price / (1 + GST_RATE));
  const gstOnRent = price - baseRent;
  const fullTotalAmount = totalRentForDuration + depositAmount;
  
  // Determine amount to pay based on options
  let totalAmount = fullTotalAmount;
  let remainingAmount = 0;
  let paymentDescription = 'Full Amount';
  
  if (payMonthly && formData.duration >= 2) {
    // Pay first month + deposit
    totalAmount = price + depositAmount;
    remainingAmount = totalRentForDuration - price;
    paymentDescription = 'First Month + Deposit';
  } else if (reserveNow) {
    // Pay token amount
    totalAmount = TOKEN_AMOUNT;
    remainingAmount = fullTotalAmount - TOKEN_AMOUNT;
    paymentDescription = 'Token Amount';
  }
  
  // Disable dates before March 1, 2026
  const marchFirst2026 = '2026-03-01';
  const today = new Date().toISOString().split('T')[0];
  const minDate = today > marchFirst2026 ? today : marchFirst2026;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
        style={{ animation: 'slideUp 0.3s ease-out' }}
      >
        {submitSuccess ? (
          <div className="p-12 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-3xl font-bold text-gray-900 mb-3">Payment Successful!</h4>
            <p className="text-gray-600 text-lg mb-2">
              Your booking has been confirmed.
            </p>
            <p className="text-gray-500 text-sm">
              A confirmation email with receipt has been sent to your email address.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="relative px-8 py-8 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 flex-shrink-0">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-all disabled:opacity-50"
                aria-label="Close"
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="text-white">
                <h3 className="text-3xl font-bold mb-2">Book Your Bed</h3>
                <p className="text-blue-100 text-lg">{propertyName}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <form onSubmit={handleSubmit} className="p-8">
                {/* Room Summary */}
                <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Room Type</p>
                      <p className="text-xl font-bold text-gray-900">
                        {roomType} Sharing {roomType !== 'Single' && '(Price per bed)'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">
                        {roomType === 'Single' ? 'Monthly Rent' : 'Monthly Rent (per bed)'}
                      </p>
                      <p className="text-2xl font-bold text-blue-600">₹{price.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">(incl. GST)</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Base Rent</span>
                      <span className="font-medium text-gray-900">₹{baseRent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">GST (18%)</span>
                      <span className="font-medium text-gray-900">₹{gstOnRent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200">
                      <span className="font-semibold text-gray-900">Total Monthly Rent</span>
                      <span className="font-bold text-blue-600">₹{price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm pt-3 mt-3 border-t border-gray-200">
                      <span className="font-semibold text-gray-900">Security Deposit</span>
                      <span className="font-bold text-gray-900">₹{depositAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-6 mb-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Move-in Date
                    </label>
                    <input
                      type="date"
                      name="moveInDate"
                      value={formData.moveInDate}
                      onChange={handleChange}
                      min={minDate}
                      required
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Stay Duration (Months)
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={decrementDuration}
                        disabled={formData.duration <= 1}
                        className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-300 rounded-xl transition-all disabled:cursor-not-allowed"
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                        </svg>
                      </button>
                      <div className="flex-1 text-center">
                        <div className="text-4xl font-bold text-gray-900">{formData.duration}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {formData.duration === 1 ? 'Month' : 'Months'}
                        </div>
                        {discount.label && (
                          <div className="mt-2">
                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold animate-pulse">
                              🎉 {discount.label}
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={incrementDuration}
                        disabled={formData.duration >= 24}
                        className="w-12 h-12 flex items-center justify-center bg-blue-500 hover:bg-blue-600 disabled:bg-gray-50 disabled:text-gray-300 text-white rounded-xl transition-all disabled:cursor-not-allowed"
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Minimum 1 month, Maximum 24 months
                    </p>
                    {formData.duration >= 3 && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                        <p className="text-sm text-green-800 text-center font-medium">
                          {discount.freeMonths > 0 
                            ? `🎊 Book for ${formData.duration} months, pay for only ${formData.duration - discount.freeMonths}!`
                            : `💰 Get flat ₹${discount.amount.toLocaleString()} off on your booking!`
                          }
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Any specific requirements..."
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none text-gray-900"
                    />
                  </div>
                </div>

                {/* Pay Monthly Option - Only for 2+ months */}
                {formData.duration >= 2 && (
                  <div className="mb-6 p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="payMonthly"
                        checked={payMonthly}
                        onChange={(e) => {
                          setPayMonthly(e.target.checked);
                          if (e.target.checked) {
                            setReserveNow(false); // Can't use both options
                          }
                        }}
                        className="mt-1 w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer"
                      />
                      <label htmlFor="payMonthly" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">💳</span>
                          <span className="text-base font-bold text-gray-900">Pay Monthly – Flexible Payments!</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed mb-2">
                          Pay only the first month's rent + deposit now (<span className="font-semibold text-purple-600">₹{(price + depositAmount).toLocaleString()}</span>). 
                          Pay remaining months from your bookings page when due.
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex items-start gap-2 p-3 bg-white/60 rounded-lg border border-purple-200">
                            <svg className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="text-xs text-gray-700 leading-relaxed">
                              <span className="font-semibold text-purple-700">Payment Schedule:</span> First month paid now. Subsequent months can be paid from "My Bookings" section before the due date.
                            </div>
                          </div>
                          
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Reserve Now Option */}
                <div className="mb-6 p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="reserveNow"
                      checked={reserveNow}
                      onChange={(e) => {
                        setReserveNow(e.target.checked);
                        if (e.target.checked) {
                          setPayMonthly(false); // Can't use both options
                        }
                      }}
                      className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="reserveNow" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">🔐</span>
                        <span className="text-base font-bold text-gray-900">Reserve Your Bed – Pay Later!</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed mb-2">
                        Just pay a small token amount of <span className="font-semibold text-blue-600">₹{TOKEN_AMOUNT.toLocaleString()}</span> now to lock your room and pay the remaining amount when you move in.
                      </p>
                      
                      {/* Refund Policy */}
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 p-3 bg-white/60 rounded-lg border border-blue-200">
                          <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-xs text-gray-700 leading-relaxed">
                            <span className="font-semibold text-blue-700">Refund Policy:</span> Token amount is fully refundable within 7 days of payment. After 7 days, the token is non-refundable.
                          </p>
                        </div>
                        
                        {/* Cancellation Process */}
                        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="text-xs text-gray-700 leading-relaxed">
                            <span className="font-semibold text-blue-700">Cancellation Policy:</span> View our{' '}
                            <a 
                              href="/cancellation-policy" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="font-semibold text-blue-600 hover:text-blue-700 underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              complete cancellation and refund policy
                            </a>
                            {' '}for detailed terms and conditions.
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="mb-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Rent for {formData.duration} {formData.duration === 1 ? 'Month' : 'Months'}
                      </span>
                      <span className="font-medium text-gray-900">
                        ₹{price.toLocaleString()} × {formData.duration} = ₹{(price * formData.duration).toLocaleString()}
                      </span>
                    </div>
                    
                    {discountAmount > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-600 font-medium flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Discount ({discount.label})
                        </span>
                        <span className="font-medium text-green-600">
                          - ₹{discountAmount.toLocaleString()}
                        </span>
                      </div>
                    )}
                    
                    {discountAmount > 0 && (
                      <div className="flex items-center justify-between text-sm pt-2 border-t border-green-200">
                        <span className="text-gray-600">Discounted Rent</span>
                        <span className="font-semibold text-gray-900">
                          ₹{totalRentForDuration.toLocaleString()}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Security Deposit</span>
                      <span className="font-medium text-gray-900">₹{depositAmount.toLocaleString()}</span>
                    </div>
                    
                    {!payMonthly && !reserveNow && (
                      <div className="flex items-center justify-between text-sm pt-2 border-t border-green-200 font-semibold">
                        <span className="text-gray-900">Full Amount</span>
                        <span className="text-gray-900">₹{fullTotalAmount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="pt-3 border-t-2 border-green-300">
                    {payMonthly && formData.duration >= 2 ? (
                      <>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Pay Now (First Month + Deposit)</p>
                            <p className="text-xs text-gray-500">Month 1 of {formData.duration}</p>
                          </div>
                          <p className="text-4xl font-bold text-purple-600">₹{totalAmount.toLocaleString()}</p>
                        </div>
                        <div className="pt-3 border-t border-green-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Remaining Rent</p>
                              <p className="text-xs text-gray-500">Pay monthly from bookings page</p>
                              {discountAmount > 0 && (
                                <p className="text-xs text-green-600 font-medium mt-1">
                                  You save ₹{discountAmount.toLocaleString()}!
                                </p>
                              )}
                            </div>
                            <p className="text-2xl font-bold text-gray-900">₹{remainingAmount.toLocaleString()}</p>
                          </div>
                        </div>
                      </>
                    ) : reserveNow ? (
                      <>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Token Amount (Pay Now)</p>
                            <p className="text-xs text-gray-500">To reserve your bed</p>
                          </div>
                          <p className="text-4xl font-bold text-blue-600">₹{TOKEN_AMOUNT.toLocaleString()}</p>
                        </div>
                        <div className="pt-3 border-t border-green-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Remaining Amount</p>
                              <p className="text-xs text-gray-500">Pay at move-in</p>
                              {discountAmount > 0 && (
                                <p className="text-xs text-green-600 font-medium mt-1">
                                  You save ₹{discountAmount.toLocaleString()}!
                                </p>
                              )}
                            </div>
                            <p className="text-2xl font-bold text-gray-900">₹{remainingAmount.toLocaleString()}</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Total Amount to Pay</p>
                          <p className="text-xs text-gray-500">GST included</p>
                          {discountAmount > 0 && (
                            <p className="text-xs text-green-600 font-medium mt-1">
                              You save ₹{discountAmount.toLocaleString()}!
                            </p>
                          )}
                        </div>
                        <p className="text-4xl font-bold text-gray-900">₹{Math.round(totalAmount).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 text-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing Payment...
                      </>
                    ) : payMonthly && formData.duration >= 2 ? (
                      `Pay First Month ₹${totalAmount.toLocaleString()}`
                    ) : reserveNow ? (
                      `Pay Token ₹${TOKEN_AMOUNT.toLocaleString()}`
                    ) : (
                      'Proceed to Payment'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
        /* Hide scrollbar for Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #e5e7eb transparent;
        }
      `}</style>
    </div>
  );
};
