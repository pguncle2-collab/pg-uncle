'use client';

import React, { useState } from 'react';
import { analytics } from '@/lib/analytics';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [focused, setFocused] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      analytics.submitContactForm(formData.subject);
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      } else {
        setError(data.error || 'Failed to send message. Please try again.');
        analytics.error('contact_form', data.error || 'Failed to send message');
      }
    } catch (err: any) {
      setError('Failed to send message. Please check your connection and try again.');
      analytics.error('contact_form', err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: '📧', label: 'Email', value: 'info@pguncle.com' },
    // { icon: '📞', label: 'Phone', value: '+91 9350573166' },
    { icon: '📍', label: 'Location', value: 'IT City, Mohali, India' },
  ];

  return (
    <section id="contact" className="py-16 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-5 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 rounded-full">
            <span className="text-blue-700 text-sm font-semibold">GET IN TOUCH</span>
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Contact Us for <span className="text-blue-600">PG Details</span>
          </h2>
          <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto">
            Reach out to PGUNCLE for booking inquiries and amenities information
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 max-w-6xl mx-auto">
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-8 rounded-2xl text-white shadow-xl">
              <h3 className="text-xl md:text-2xl font-bold mb-4">Let's Connect</h3>
              <p className="text-blue-50 mb-6">
                Have questions? We're here to help you.
              </p>
              
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                      {info.icon}
                    </div>
                    <div>
                      <div className="text-sm text-blue-100">{info.label}</div>
                      <div className="font-semibold">{info.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2">
            {/* Success Alert */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-start gap-3 animate-fade-in">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-green-900">Message Sent Successfully!</p>
                  <p className="text-sm text-green-700">We've received your message and will get back to you soon.</p>
                </div>
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-red-900">Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    focused === 'name' || formData.name ? '-top-2 text-xs bg-white px-2 text-blue-600' : 'top-4 text-gray-500'
                  }`}>
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused(null)}
                    className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-blue-500 focus:outline-none transition-colors"
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="relative">
                  <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    focused === 'email' || formData.email ? '-top-2 text-xs bg-white px-2 text-blue-600' : 'top-4 text-gray-500'
                  }`}>
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-blue-500 focus:outline-none transition-colors"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    focused === 'phone' || formData.phone ? '-top-2 text-xs bg-white px-2 text-blue-600' : 'top-4 text-gray-500'
                  }`}>
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    onFocus={() => setFocused('phone')}
                    onBlur={() => setFocused(null)}
                    className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-blue-500 focus:outline-none transition-colors"
                    disabled={loading}
                  />
                </div>
                
                <div className="relative">
                  <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    focused === 'subject' || formData.subject ? '-top-2 text-xs bg-white px-2 text-blue-600' : 'top-4 text-gray-500'
                  }`}>
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    onFocus={() => setFocused('subject')}
                    onBlur={() => setFocused(null)}
                    className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-blue-500 focus:outline-none transition-colors"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="relative">
                <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                  focused === 'message' || formData.message ? '-top-2 text-xs bg-white px-2 text-blue-600' : 'top-4 text-gray-500'
                }`}>
                  Message *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  onFocus={() => setFocused('message')}
                  onBlur={() => setFocused(null)}
                  rows={6}
                  className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-blue-500 focus:outline-none transition-colors resize-none"
                  required
                  disabled={loading}
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="group w-full py-4 px-8 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 54" fill="none">
        <path d="M0 54H1440" stroke="#AAAA55" strokeWidth="2" />
      </svg>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};
