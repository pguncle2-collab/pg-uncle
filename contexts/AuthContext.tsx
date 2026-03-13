'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-client';

interface User {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          if (session?.user) {
            await handleUserAuth(session.user);
          } else {
            setUser(null);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    fetchSession();

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: any, session: any) => {
        console.log('[Auth] State change event:', event);
        
        if (mounted) {
          if (session?.user) {
            await handleUserAuth(session.user);
          } else {
            setUser(null);
            setLoading(false);
          }
        }
      }
    );

    // Listen for storage events to sync auth state across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'supabase.auth.token' && mounted) {
        console.log('[Auth] Storage change detected, refreshing session');
        fetchSession();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
    }

    return () => {
      mounted = false;
      subscription.unsubscribe();
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
      }
    };
  }, []);

  const handleUserAuth = async (supabaseUser: any) => {
    try {
      // Set user immediately from auth data to show logged-in state faster
      const authUser = {
        id: supabaseUser.id,
        email: supabaseUser.email,
        fullName: supabaseUser.user_metadata?.full_name || '',
        phone: supabaseUser.phone || '',
      };
      
      setUser(authUser);
      setLoading(false);

      // Then try to get additional user data from Postgres in the background
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle() as { data: any; error: any };
      
      if (userData) {
        // Update with database data if available
        setUser({
          id: userData.id,
          email: userData.email,
          fullName: userData.full_name,
          phone: userData.phone,
        });
      }
    } catch (e) {
      console.error('Error fetching user data', e);
      // Keep the auth user data we already set
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Failed to sign in');
    }
  };

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });
      if (error) throw error;
      
      // We manually create in our user table too (though there's a trigger)
      // Actually we'll let handleUserAuth or the trigger do it
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.message || 'Failed to sign up');
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Verify redirect URL is properly configured
      const redirectUrl = `${window.location.origin}/auth/callback`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) {
        // Handle specific OAuth initialization errors
        if (error.message.includes('Invalid API key') || error.message.includes('not configured')) {
          throw new Error('Invalid API key or Supabase URL not configured');
        }
        throw error;
      }
    } catch (error: any) {
      console.error('Google sign in error:', error);
      throw new Error(error.message || 'Failed to sign in with Google');
    }
  };

  const signOut = async () => {
    try {
      // Clear user state immediately for better UX
      setUser(null);
      
      // Then call Supabase signOut
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        // Don't throw - user state is already cleared
        // This prevents sign out button from appearing broken
      }
    } catch (error: any) {
      console.error('Sign out error:', error);
      // Don't throw - user state is already cleared
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw new Error(error.message || 'Failed to send password reset email');
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
