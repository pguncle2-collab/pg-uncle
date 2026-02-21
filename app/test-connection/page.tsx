'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestConnection() {
  const [status, setStatus] = useState<string>('Testing...');
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Check environment variables
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        console.log('Environment check:');
        console.log('URL:', url ? 'Set' : 'Missing');
        console.log('Key:', key ? 'Set (length: ' + key?.length + ')' : 'Missing');

        setDetails({
          url: url || 'Missing',
          keyLength: key?.length || 0,
          keyPrefix: key?.substring(0, 20) + '...' || 'Missing',
        });

        // Try to fetch from Supabase
        console.log('Attempting to connect to Supabase...');
        const { data, error } = await supabase
          .from('properties')
          .select('count')
          .limit(1);

        if (error) {
          console.error('Supabase error:', error);
          setStatus('Error: ' + error.message);
          setDetails((prev: any) => ({ ...prev, error: error }));
        } else {
          console.log('Connection successful!');
          setStatus('✅ Connection Successful!');
          setDetails((prev: any) => ({ ...prev, success: true, data }));
        }
      } catch (err: any) {
        console.error('Connection test failed:', err);
        setStatus('❌ Connection Failed: ' + err.message);
        setDetails((prev: any) => ({ ...prev, exception: err.message }));
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Supabase Connection Test</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Status:</h2>
          <p className="text-lg">{status}</p>
        </div>

        {details && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Details:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(details, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
