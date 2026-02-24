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
      try {
        // Try to get the current session with a timeout
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('timeout')), 3000);
        });

        const sessionPromise = supabase.auth.getSession();

        await Promise.race([sessionPromise, timeoutPromise]);
      } catch (error: any) {
        // If session check fails or times out, clear stale data
        if (error.message === 'timeout' || 
            error.message?.includes('refresh_token_not_found') ||
            error.message?.includes('invalid')) {
          console.warn('Clearing stale session data');
          localStorage.removeItem('pguncle-auth');
          
          // Also clear any other Supabase-related items
          const keysToRemove = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith('sb-') || key?.includes('supabase')) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach(key => localStorage.removeItem(key));
        }
      }
    };

    checkAndRecoverSession();
  }, []);

  return null;
}
