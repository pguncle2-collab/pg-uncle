'use client';

import React from 'react';

interface SupabaseErrorBannerProps {
  show: boolean;
  onRetry?: () => void;
}

export const SupabaseErrorBanner: React.FC<SupabaseErrorBannerProps> = ({ show, onRetry }) => {
  if (!show) return null;

  return (
    <div className="fixed top-20 left-0 right-0 z-40 mx-auto max-w-4xl px-4">
      <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg shadow-lg p-4 animate-slide-down">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900 mb-1">
              Database Connection Issue
            </h3>
            <p className="text-sm text-amber-800 mb-3">
              Unable to connect to the database. Your Supabase project may be paused (common with free tier after inactivity).
            </p>
            
            <div className="flex flex-wrap gap-2">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
                >
                  Retry Connection
                </button>
              )}
              
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white border border-amber-300 text-amber-900 rounded-lg text-sm font-medium hover:bg-amber-50 transition-colors"
              >
                Open Supabase Dashboard
              </a>
            </div>
            
            <details className="mt-3">
              <summary className="text-xs text-amber-700 cursor-pointer hover:text-amber-900">
                How to fix this
              </summary>
              <ol className="mt-2 text-xs text-amber-800 space-y-1 list-decimal list-inside">
                <li>Go to your Supabase Dashboard</li>
                <li>Check if your project shows "Paused"</li>
                <li>Click "Restore Project" if paused</li>
                <li>Wait 1-2 minutes for the project to wake up</li>
                <li>Click "Retry Connection" above</li>
              </ol>
            </details>
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="flex-shrink-0 text-amber-500 hover:text-amber-700"
            title="Reload page"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
