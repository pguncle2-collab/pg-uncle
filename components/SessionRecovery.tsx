'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const MAX_RELOAD_ATTEMPTS = 2;
const RELOAD_COUNTER_KEY = 'session_recovery_reload_count';
const RELOAD_TIMESTAMP_KEY = 'session_recovery_reload_time';
const RELOAD_RESET_TIME = 5 * 60 * 1000; // 5 minutes

/**
 * SessionRecovery component handles stale session cleanup
 * This prevents the "project paused" error on returning visits
 */
export function SessionRecovery() {
  useEffect(() => {
    const checkAndRecoverSession = async () => {
      // Check reload attempts
      const reloadCount = parseInt(sessionStorage.getItem(RELOAD_COUNTER_KEY) || '0');
      const lastReloadTime = parseInt(sessionStorage.getItem(RELOAD_TIMESTAMP_KEY) || '0');
      const now = Date.now();
      
      // Reset counter if it's been more than 5 minutes
      if (now - lastReloadTime > RELOAD_RESET_TIME) {
        sessionStorage.setItem(RELOAD_COUNTER_KEY, '0');
        sessionStorage.setItem(RELOAD_TIMESTAMP_KEY, now.toString());
      }
      
      // If we've already reloaded too many times, stop trying
      if (reloadCount >= MAX_RELOAD_ATTEMPTS) {
        console.warn('Max reload attempts reached. Stopping auto-reload.');
        return;
      }
      
      // Check if this is a fresh page load (not a navigation)
      const navigationEntries = performance.getEntriesByType('navigation');
      const isPageLoad = navigationEntries.length > 0 && 
                         (navigationEntries[0] as PerformanceNavigationTiming).type === 'reload' || 
                         !sessionStorage.getItem('session_checked');
      
      if (!isPageLoad) {
        sessionStorage.setItem('session_checked', 'true');
        return;
      }
      
      sessionStorage.setItem('session_checked', 'true');
      
      try {
        // Try to get the current session with a very short timeout
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('timeout')), 1500); // 1.5 seconds
        });

        const sessionPromise = supabase.auth.getSession();

        const result = await Promise.race([sessionPromise, timeoutPromise]) as any;
        
        // If we got a result, check if there's an error
        if (result?.error) {
          console.warn('Session error detected:', result.error.message);
          // Don't reload for session errors, just clear the data
          clearAllAuthData();
        }
      } catch (error: any) {
        // If session check times out, clear data but DON'T reload
        console.warn('Session check timed out, clearing auth data');
        clearAllAuthData();
      }
    };

    const clearAllAuthData = () => {
      // Clear Supabase auth storage
      localStorage.removeItem('pguncle-auth');
      
      // Clear any other Supabase-related items
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('sb-') || key.includes('supabase') || key.includes('auth'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.warn('Failed to remove key:', key);
        }
      });
      
      console.log('Cleared stale auth data');
    };

    checkAndRecoverSession();
  }, []);

  return null;
}
