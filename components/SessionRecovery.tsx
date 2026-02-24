'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * SessionRecovery component handles stale session cleanup
 * This prevents the "project paused" error on returning visits
 */
export function SessionRecovery() {
  useEffect(() => {
    const checkAndRecoverSession = async () => {
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
          console.warn('Session error detected, clearing and reloading:', result.error.message);
          clearAllAuthData();
          window.location.reload();
        }
      } catch (error: any) {
        // If session check fails or times out, clear and reload
        console.warn('Session check failed, clearing and reloading:', error.message);
        clearAllAuthData();
        window.location.reload();
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
