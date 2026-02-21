'use client';

import React, { useState } from 'react';
import { loadRazorpayScript, initializeRazorpay, RAZORPAY_KEY_ID, formatAmountForRazorpay } from '@/lib/razorpay';

interface PaymentButtonProps {
  amount: number;
  propertyName: string;
  roomType: string;
  userDetails: {
    name: string;
    email: string;
    phone: string;
  };
  onSuccess: (paymentDetails: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  amount,
  propertyName,
  roomType,
  userDetails,
  onSuccess,
  onError,
  disabled = false,
  className = '',
}) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Validate Razorpay key
      if (!RAZORPAY_KEY_ID) {
        throw new Error('Razorpay key not configured. Please add NEXT_PUBLIC_RAZORPAY_KEY_ID to .env.local');
      }

      // Create order on backend
      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          notes: {
            propertyName,
            roomType,
            userName: userDetails.name,
          },
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      const { order } = await orderResponse.json();

      // Initialize Razorpay payment
      await initializeRazorpay({
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'PGUNCLE',
        description: `Booking for ${roomType} at ${propertyName}`,
        order_id: order.id,
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.phone,
        },
        theme: {
          color: '#3B82F6',
        },
        handler: async (response) => {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(response),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              onSuccess(response);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error: any) {
            console.error('Payment verification error:', error);
            if (onError) {
              onError(error.message || 'Payment verification failed');
            }
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            if (onError) {
              onError('Payment cancelled by user');
            }
          },
        },
      });
    } catch (error: any) {
      console.error('Payment error:', error);
      setLoading(false);
      if (onError) {
        onError(error.message || 'Payment failed');
      }
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={disabled || loading}
      className={`
        px-6 py-3 rounded-xl font-semibold transition-all duration-300
        ${disabled || loading
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl'
        }
        ${className}
      `}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Processing...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <span>💳</span>
          Pay ₹{amount.toLocaleString('en-IN')}
        </span>
      )}
    </button>
  );
};
