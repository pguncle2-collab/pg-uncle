'use client';

import React from 'react';
import Link from 'next/link';
import { Footer } from '@/components/Footer';

export default function CancellationPolicyPage() {
  const whatsappNumber = '919350573166';
  const whatsappMessage = encodeURIComponent('Hi, I want to cancel my booking and request a refund. Here are my booking details:');
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="container mx-auto px-6 py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-3">Cancellation & Refund Policy</h1>
          <p className="text-blue-100 text-lg">Clear and transparent terms for your peace of mind</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Main Policy Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-start gap-4 mb-6 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Important Information</h2>
                <p className="text-gray-700">
                  Please read our cancellation and refund policy carefully before making a booking. 
                  This policy applies to all bookings made through PGUNCLE.
                </p>
              </div>
            </div>

            {/* Token Amount Bookings */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                Token Amount Bookings
              </h3>
              <div className="pl-10 space-y-4">
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-2">✅ Refundable Period (Within 7 Days)</h4>
                  <p className="text-gray-700 mb-2">
                    If you cancel your booking within <span className="font-semibold">7 days of payment</span>, 
                    your token amount is <span className="font-semibold text-green-600">fully refundable</span>.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-2">
                    <li>100% refund of token amount (₹2,000)</li>
                    <li>Refund processed within 5-7 business days</li>
                    <li>Original payment method will be credited</li>
                  </ul>
                </div>

                <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                  <h4 className="font-semibold text-gray-900 mb-2">❌ Non-Refundable Period (After 7 Days)</h4>
                  <p className="text-gray-700 mb-2">
                    If you cancel your booking <span className="font-semibold">after 7 days of payment</span>, 
                    the token amount is <span className="font-semibold text-red-600">non-refundable</span>.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-2">
                    <li>Token amount will be forfeited</li>
                    <li>Remaining balance (if any) will not be charged</li>
                    <li>Booking will be cancelled immediately</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Full Payment Bookings */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                Full Payment & Monthly Payment Bookings
              </h3>
              <div className="pl-10 space-y-4">
                <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <h4 className="font-semibold text-gray-900 mb-2">⏰ Before Move-in Date</h4>
                  <p className="text-gray-700 mb-2">
                    Cancellations made <span className="font-semibold">before your move-in date</span>:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-2">
                    <li>Rent amount: Refundable (minus processing fee of 5%)</li>
                    <li>Security deposit: Fully refundable</li>
                    <li>Refund processed within 7-10 business days</li>
                  </ul>
                </div>

                <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <h4 className="font-semibold text-gray-900 mb-2">🏠 After Move-in Date</h4>
                  <p className="text-gray-700 mb-2">
                    Cancellations made <span className="font-semibold">after your move-in date</span>:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-2">
                    <li>Current month rent: Non-refundable</li>
                    <li>Future months rent: Refundable (for monthly payment plans)</li>
                    <li>Security deposit: Refundable after property inspection</li>
                    <li>30 days notice required for vacating</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Refund Process */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                How to Request a Refund
              </h3>
              <div className="pl-10">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
                  <p className="text-gray-700 mb-4">
                    To cancel your booking and request a refund, please contact us on WhatsApp with the following information:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-2">
                    <li>Your full name and registered email</li>
                    <li>Booking ID (found in "My Bookings" section)</li>
                    <li>Payment proof (screenshot or transaction ID)</li>
                    <li>Reason for cancellation</li>
                    <li>Bank account details for refund</li>
                  </ul>
                  
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span>Contact Us on WhatsApp</span>
                    <span className="text-sm font-normal bg-white/20 px-2 py-1 rounded">+91 9350573166</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">📋 Important Notes</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>All refunds are processed to the original payment method used during booking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Refund processing time may vary depending on your bank (typically 5-10 business days)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Security deposit refunds are subject to property inspection and damage assessment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Any damages to the property will be deducted from the security deposit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>PGUNCLE reserves the right to modify this policy with prior notice</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Card */}
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-3">Need Help?</h3>
            <p className="text-blue-100 mb-6">
              Our support team is here to assist you with any questions about cancellations and refunds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Support
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all border-2 border-white/30"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
