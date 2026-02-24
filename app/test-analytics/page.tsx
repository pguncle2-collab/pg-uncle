'use client';

import React, { useEffect, useState } from 'react';
import { analytics } from '@/lib/analytics';

export default function TestAnalyticsPage() {
  const [gtagStatus, setGtagStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [events, setEvents] = useState<string[]>([]);

  useEffect(() => {
    // Check if gtag is available
    const checkGtag = () => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        setGtagStatus('available');
        addEvent('✅ gtag is available');
      } else {
        setGtagStatus('unavailable');
        addEvent('❌ gtag is NOT available');
      }
    };

    // Check immediately and after a delay
    checkGtag();
    setTimeout(checkGtag, 1000);
    setTimeout(checkGtag, 2000);
  }, []);

  const addEvent = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setEvents(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const testEvent = (eventName: string, eventFunction: () => void) => {
    addEvent(`🔵 Sending event: ${eventName}`);
    eventFunction();
    addEvent(`✅ Event sent: ${eventName}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Google Analytics Test Page
          </h1>

          {/* Status */}
          <div className="mb-8 p-4 rounded-lg bg-gray-50 border-2 border-gray-200">
            <h2 className="text-lg font-semibold mb-2">Status</h2>
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${
                gtagStatus === 'available' ? 'bg-green-500' : 
                gtagStatus === 'unavailable' ? 'bg-red-500' : 
                'bg-yellow-500 animate-pulse'
              }`} />
              <span className="font-medium">
                {gtagStatus === 'available' ? 'Google Analytics is loaded ✅' : 
                 gtagStatus === 'unavailable' ? 'Google Analytics is NOT loaded ❌' : 
                 'Checking...'}
              </span>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <p><strong>Tracking ID:</strong> G-3TXYLMX47G</p>
              <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
            </div>
          </div>

          {/* Test Buttons */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Test Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => testEvent('view_property', () => 
                  analytics.viewProperty('test-123', 'Test Property')
                )}
                className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
              >
                Test: View Property
              </button>
              
              <button
                onClick={() => testEvent('open_booking_modal', () => 
                  analytics.openBookingModal('test-123', 'Single', 8000)
                )}
                className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
              >
                Test: Open Booking Modal
              </button>
              
              <button
                onClick={() => testEvent('filter_properties', () => 
                  analytics.filterProperties('city', 'Chandigarh')
                )}
                className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-medium"
              >
                Test: Filter Properties
              </button>
              
              <button
                onClick={() => testEvent('click_whatsapp', () => 
                  analytics.clickWhatsApp('test-page')
                )}
                className="px-4 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 font-medium"
              >
                Test: Click WhatsApp
              </button>
              
              <button
                onClick={() => testEvent('search', () => 
                  analytics.search('test query', 5)
                )}
                className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
              >
                Test: Search
              </button>
              
              <button
                onClick={() => testEvent('click_nav_link', () => 
                  analytics.clickNavLink('Test Link')
                )}
                className="px-4 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 font-medium"
              >
                Test: Click Nav Link
              </button>
            </div>
          </div>

          {/* Event Log */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Event Log</h2>
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
              {events.length === 0 ? (
                <p className="text-gray-500">No events yet. Click a test button above.</p>
              ) : (
                events.map((event, index) => (
                  <div key={index} className="mb-1">{event}</div>
                ))
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">📋 How to Verify</h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Open browser DevTools (F12) and go to Console tab</li>
              <li>Look for "[Analytics]" or "[GA]" log messages</li>
              <li>Click test buttons above and watch the console</li>
              <li>Go to Google Analytics Real-Time view to see events</li>
              <li>Check Network tab for requests to google-analytics.com</li>
            </ol>
          </div>

          {/* Troubleshooting */}
          <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Troubleshooting</h3>
            <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
              <li>If gtag is unavailable, check browser console for script loading errors</li>
              <li>Ad blockers may block Google Analytics - try disabling them</li>
              <li>Events may take 24-48 hours to appear in GA reports (but Real-Time is instant)</li>
              <li>Check that G-3TXYLMX47G is the correct tracking ID in GA admin</li>
              <li>Verify the property is not in "Testing" mode in GA</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
