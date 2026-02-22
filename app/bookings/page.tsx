'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Footer } from '@/components/Footer';

interface Booking {
  id: string;
  propertyId: string;
  propertyName: string;
  roomType: string;
  checkInDate: string;
  duration: number;
  totalAmount: number;
  status: string;
  paymentId: string;
  createdAt: string;
  specialRequests?: string;
}

export default function BookingsPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (user) {
        try {
          const { bookingOperations } = await import('@/lib/supabaseOperations');
          const data = await bookingOperations.getByUserId(user.id);
          
          // Transform data to match Booking interface
          const transformedBookings = data.map((booking: any) => ({
            id: booking.id,
            propertyId: booking.property_id,
            propertyName: booking.properties?.name || 'Unknown Property',
            roomType: booking.room_type,
            checkInDate: booking.check_in_date,
            duration: booking.duration || 1,
            totalAmount: booking.total_amount,
            status: booking.status,
            paymentId: booking.payment_id || 'N/A',
            createdAt: booking.created_at,
            specialRequests: booking.special_requests,
          }));
          
          setBookings(transformedBookings);
        } catch (error) {
          console.error('Error fetching bookings:', error);
        }
      }
      setLoadingBookings(false);
    };
    
    fetchBookings();
  }, [user]);

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  const handleDownloadReceipt = (booking: Booking) => {
    // Create receipt HTML
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Booking Receipt - ${booking.id}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
          .header { text-align: center; border-bottom: 3px solid #3B82F6; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 32px; font-weight: bold; color: #3B82F6; }
          .receipt-title { font-size: 24px; margin-top: 10px; }
          .section { margin: 20px 0; padding: 15px; background: #F3F4F6; border-radius: 8px; }
          .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #1F2937; }
          .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E5E7EB; }
          .label { font-weight: 600; color: #6B7280; }
          .value { color: #1F2937; }
          .total { font-size: 20px; font-weight: bold; color: #10B981; margin-top: 20px; padding-top: 20px; border-top: 2px solid #3B82F6; }
          .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; color: #6B7280; font-size: 14px; }
          .status { display: inline-block; padding: 6px 12px; border-radius: 20px; font-weight: bold; }
          .status-confirmed { background: #D1FAE5; color: #065F46; }
          .status-pending { background: #FEF3C7; color: #92400E; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">PGUNCLE</div>
          <div class="receipt-title">Booking Receipt</div>
        </div>

        <div class="section">
          <div class="section-title">Booking Information</div>
          <div class="row">
            <span class="label">Booking ID:</span>
            <span class="value">${booking.id}</span>
          </div>
          <div class="row">
            <span class="label">Booking Date:</span>
            <span class="value">${new Date(booking.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div class="row">
            <span class="label">Status:</span>
            <span class="value"><span class="status status-${booking.status}">${booking.status.toUpperCase()}</span></span>
          </div>
          <div class="row">
            <span class="label">Payment ID:</span>
            <span class="value">${booking.paymentId}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Property Details</div>
          <div class="row">
            <span class="label">Property Name:</span>
            <span class="value">${booking.propertyName}</span>
          </div>
          <div class="row">
            <span class="label">Room Type:</span>
            <span class="value">${booking.roomType} Sharing</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Stay Details</div>
          <div class="row">
            <span class="label">Check-in Date:</span>
            <span class="value">${new Date(booking.checkInDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div class="row">
            <span class="label">Duration:</span>
            <span class="value">${booking.duration} ${booking.duration === 1 ? 'Month' : 'Months'}</span>
          </div>
          ${booking.specialRequests ? `
          <div class="row">
            <span class="label">Special Requests:</span>
            <span class="value">${booking.specialRequests}</span>
          </div>
          ` : ''}
        </div>

        <div class="section">
          <div class="section-title">Payment Summary</div>
          <div class="row">
            <span class="label">Total Amount Paid:</span>
            <span class="value">₹${booking.totalAmount.toLocaleString('en-IN')}</span>
          </div>
          <div class="total">
            <div class="row" style="border: none;">
              <span>Grand Total:</span>
              <span>₹${booking.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div class="footer">
          <p><strong>PGUNCLE</strong></p>
          <p>For any queries, contact us at: info@pguncle.com</p>
          <p>Thank you for choosing PGUNCLE!</p>
        </div>
      </body>
      </html>
    `;

    // Create blob and download
    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PGUNCLE-Receipt-${booking.id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
              <p className="text-gray-600">View and manage your property bookings</p>
            </div>
            <Link
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
            >
              Browse PG's
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {loadingBookings ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading your bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Bookings Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't made any bookings yet. Browse our properties and find your perfect PG!
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
            >
              Browse PG's
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{booking.propertyName}</h3>
                    <p className="text-gray-600">{booking.roomType} Room</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    booking.status === 'confirmed' 
                      ? 'bg-green-100 text-green-700'
                      : booking.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Check-in Date</p>
                      <p className="font-semibold text-gray-900">{new Date(booking.checkInDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-semibold text-gray-900">{booking.duration} {booking.duration === 1 ? 'Month' : 'Months'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-semibold text-gray-900">₹{booking.totalAmount.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Payment ID: <span className="font-mono text-gray-900">{booking.paymentId}</span>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleViewDetails(booking)}
                      className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => handleDownloadReceipt(booking)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                    >
                      Download Receipt
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {selectedBooking && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedBooking(null)}
        >
          <div 
            className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold mb-2">Booking Details</h2>
              <p className="text-blue-100">Booking ID: {selectedBooking.id}</p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="font-semibold text-gray-700">Status</span>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  selectedBooking.status === 'confirmed' 
                    ? 'bg-green-100 text-green-700'
                    : selectedBooking.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                </span>
              </div>

              {/* Property Details */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Property Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Property Name</span>
                    <span className="font-semibold text-gray-900">{selectedBooking.propertyName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Room Type</span>
                    <span className="font-semibold text-gray-900">{selectedBooking.roomType} Sharing</span>
                  </div>
                </div>
              </div>

              {/* Stay Details */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Stay Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Check-in Date</span>
                    <span className="font-semibold text-gray-900">{new Date(selectedBooking.checkInDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold text-gray-900">{selectedBooking.duration} {selectedBooking.duration === 1 ? 'Month' : 'Months'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Booking Date</span>
                    <span className="font-semibold text-gray-900">{new Date(selectedBooking.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  {selectedBooking.specialRequests && (
                    <div className="py-2">
                      <span className="text-gray-600 block mb-2">Special Requests</span>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedBooking.specialRequests}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Details */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Payment Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Payment ID</span>
                    <span className="font-mono text-sm text-gray-900">{selectedBooking.paymentId}</span>
                  </div>
                  <div className="flex justify-between py-3 bg-green-50 px-4 rounded-lg">
                    <span className="text-gray-700 font-semibold">Total Amount</span>
                    <span className="text-2xl font-bold text-green-600">₹{selectedBooking.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => handleDownloadReceipt(selectedBooking)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
                >
                  Download Receipt
                </button>
                <Link
                  href={`/properties/${selectedBooking.propertyId}`}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all text-center"
                >
                  View Property
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
