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
    // Check active session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        // If user exists, ensure they have a record in users table
        if (session?.user) {
          await ensureUserRecord(session.user);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      
      // If user exists, ensure they have a record in users table
      if (session?.user) {
        await ensureUserRecord(session.user);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
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
    } catch (error) {
      console.error('Error in ensureUserRecord:', error);
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
