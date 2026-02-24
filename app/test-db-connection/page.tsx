'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestDBConnection() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const testResults: any[] = [];

    // Test 1: Check environment variables
    testResults.push({
      test: 'Environment Variables',
      status: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌',
      details: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
      }
    });

    // Test 2: Simple connection test
    try {
      const start = Date.now();
      const { data, error } = await supabase
        .from('properties')
        .select('id')
        .limit(1);
      const duration = Date.now() - start;

      testResults.push({
        test: 'Simple Query (1 row)',
        status: error ? '❌' : '✅',
        details: {
          duration: `${duration}ms`,
          error: error?.message || 'None',
          data: data ? `${data.length} rows` : 'No data'
        }
      });
    } catch (err: any) {
      testResults.push({
        test: 'Simple Query (1 row)',
        status: '❌',
        details: {
          error: err.message,
          name: err.name
        }
      });
    }

    // Test 3: Full properties query
    try {
      const start = Date.now();
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('is_active', true)
        .limit(10);
      const duration = Date.now() - start;

      testResults.push({
        test: 'Full Query (10 rows)',
        status: error ? '❌' : '✅',
        details: {
          duration: `${duration}ms`,
          error: error?.message || 'None',
          data: data ? `${data.length} rows` : 'No data'
        }
      });
    } catch (err: any) {
      testResults.push({
        test: 'Full Query (10 rows)',
        status: '❌',
        details: {
          error: err.message,
          name: err.name
        }
      });
    }

    // Test 4: Auth session check
    try {
      const start = Date.now();
      const { data, error } = await supabase.auth.getSession();
      const duration = Date.now() - start;

      testResults.push({
        test: 'Auth Session Check',
        status: error ? '❌' : '✅',
        details: {
          duration: `${duration}ms`,
          error: error?.message || 'None',
          hasSession: data.session ? 'Yes' : 'No'
        }
      });
    } catch (err: any) {
      testResults.push({
        test: 'Auth Session Check',
        status: '❌',
        details: {
          error: err.message,
          name: err.name
        }
      });
    }

    // Test 5: Check localStorage
    const authData = localStorage.getItem('pguncle-auth');
    testResults.push({
      test: 'LocalStorage Auth',
      status: authData ? '⚠️' : '✅',
      details: {
        hasData: authData ? 'Yes (may be stale)' : 'No',
        size: authData ? `${authData.length} chars` : '0'
      }
    });

    setResults(testResults);
    setLoading(false);
  };

  const clearAuth = () => {
    localStorage.removeItem('pguncle-auth');
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    alert('Auth data cleared! Refresh the page and run tests again.');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Database Connection Test</h1>
        
        <div className="flex gap-4 mb-8">
          <button
            onClick={runTests}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Running Tests...' : 'Run Tests'}
          </button>
          
          <button
            onClick={clearAuth}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Clear Auth Data
          </button>

          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Reload Page
          </button>
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md border-l-4"
                style={{
                  borderLeftColor: 
                    result.status === '✅' ? '#10b981' : 
                    result.status === '⚠️' ? '#f59e0b' : '#ef4444'
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">{result.test}</h3>
                  <span className="text-2xl">{result.status}</span>
                </div>
                
                <div className="bg-gray-50 p-4 rounded text-sm font-mono">
                  <pre>{JSON.stringify(result.details, null, 2)}</pre>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">What to check:</h3>
          <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
            <li>If Environment Variables fail: Check your .env.local file</li>
            <li>If queries timeout: Your Supabase project may be paused</li>
            <li>If auth session fails: Try clearing auth data</li>
            <li>If you see stale auth data: Clear it and test again</li>
          </ul>
        </div>

        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-900 mb-2">Supabase Dashboard:</h3>
          <a 
            href="https://supabase.com/dashboard" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Check if your project is paused →
          </a>
        </div>
      </div>
    </div>
  );
}
