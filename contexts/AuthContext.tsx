'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, phone: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let sessionCheckTimeout: NodeJS.Timeout;
    
    // Check active session with retry logic and timeout
    const checkSession = async (retryCount = 0) => {
      try {
        // Set a timeout for the session check
        const timeoutPromise = new Promise((_, reject) => {
          sessionCheckTimeout = setTimeout(() => reject(new Error('Session check timeout')), 5000);
        });

        const sessionPromise = supabase.auth.getSession();
        
        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;
        
        clearTimeout(sessionCheckTimeout);
        
        if (!mounted) return;
        
        if (error) {
          console.error('Session error:', error);
          
          // If it's an auth error, clear the stale session
          if (error.message?.includes('refresh_token_not_found') || 
              error.message?.includes('invalid') ||
              error.status === 401) {
            console.warn('Clearing stale session due to auth error');
            await supabase.auth.signOut();
            localStorage.removeItem('pguncle-auth');
          }
          
          setUser(null);
          setLoading(false);
          return;
        }
        
        setUser(session?.user ?? null);
        
        // If user exists, ensure they have a record in users table
        if (session?.user) {
          await ensureUserRecord(session.user);
        }
        
        setLoading(false);
      } catch (error: any) {
        clearTimeout(sessionCheckTimeout);
        
        if (!mounted) return;
        
        // Handle timeout or abort errors with retry
        if ((error.message === 'Session check timeout' || error.name === 'AbortError') && retryCount < 2) {
          console.warn(`Session check attempt ${retryCount + 1} failed. Retrying...`);
          setTimeout(() => checkSession(retryCount + 1), 1000);
          return;
        }
        
        // After retries exhausted, clear stale session
        if (error.message === 'Session check timeout' || error.name === 'AbortError') {
          console.warn('⚠️ Session check failed after retries. Clearing stale session.');
          localStorage.removeItem('pguncle-auth');
        } else {
          console.error('Error checking session:', error);
        }
        
        setUser(null);
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      if (!mounted) return;
      
      console.log('Auth state changed:', event);
      
      // Handle token refresh failures
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        localStorage.removeItem('pguncle-auth');
      } else if (event === 'USER_UPDATED') {
        console.log('User updated');
      }
      
      setUser(session?.user ?? null);
      
      // If user exists, ensure they have a record in users table
      if (session?.user) {
        await ensureUserRecord(session.user).catch(err => {
          console.warn('Failed to ensure user record:', err);
        });
      }
      
      setLoading(false);
    });

    return () => {
      mounted = false;
      clearTimeout(sessionCheckTimeout);
      subscription.unsubscribe();
    };
  }, []);

  // Helper function to ensure user record exists in users table
  const ensureUserRecord = async (authUser: User) => {
    try {
      // Check if user exists in users table
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('id', authUser.id)
        .single();

      // If user doesn't exist, create them
      if (fetchError && fetchError.code === 'PGRST116') {
        console.log('Creating user record for:', authUser.email);
        
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            {
              id: authUser.id,
              email: authUser.email,
              full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
              phone: authUser.user_metadata?.phone || authUser.phone || null,
              role: 'user',
            },
          ]);

        if (insertError) {
          console.error('Error creating user record:', insertError);
        } else {
          console.log('User record created successfully');
        }
      } else if (fetchError) {
        console.error('Error checking user existence:', fetchError);
      }
    } catch (error: any) {
      // Handle abort errors gracefully
      if (error.name === 'AbortError') {
        console.warn('Request aborted while ensuring user record. This is usually temporary.');
      } else {
        console.error('Error in ensureUserRecord:', error);
      }
    }
  };

  const signUp = async (email: string, password: string, fullName: string, phone: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          },
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        return { error };
      }

      // Create user record in users table
      if (data.user) {
        const { error: dbError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: email,
              full_name: fullName,
              phone: phone,
              role: 'user',
            },
          ]);

        if (dbError) {
          console.error('Error creating user record:', dbError);
        }
      }

      return { error: null };
    } catch (error: any) {
      console.error('Sign up exception:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      console.error('Sign in exception:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
