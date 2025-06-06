
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else if (mounted) {
          console.log('Initial session check:', session?.user?.email || 'No session');
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            localStorage.setItem('user_authenticated', 'true');
            localStorage.setItem('user_email', session.user.email || '');
          }
        }
      } catch (error) {
        console.error('Session initialization error:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
          setHasInitialized(true);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Handle different auth events without causing redirects
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User successfully signed in');
          localStorage.setItem('user_authenticated', 'true');
          localStorage.setItem('user_email', session.user.email || '');
          
          // Log activity after a short delay to prevent loops
          setTimeout(() => {
            if (mounted) {
              logActivity('login', { timestamp: new Date().toISOString() });
            }
          }, 500);
        }
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing localStorage');
          localStorage.removeItem('user_authenticated');
          localStorage.removeItem('user_email');
        }
        
        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully');
        }
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const logActivity = async (action: string, details: any) => {
    try {
      if (user?.id) {
        await supabase.from('activity_logs').insert({
          user_id: user.id,
          action,
          details,
          ip_address: '0.0.0.0',
          user_agent: navigator.userAgent
        });
      }
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        
        let errorMessage = error.message;
        if (error.message === 'Invalid login credentials') {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('too many requests')) {
          errorMessage = 'Too many login attempts. Please wait a moment and try again.';
        }
        
        toast({
          title: "Sign In Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return { error };
      }

      if (data.user && data.session) {
        console.log('Sign in successful:', data.user.email);
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        return { error: null };
      }
      
      return { error: new Error('No user data received') };
    } catch (error: any) {
      console.error('Sign in catch error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during sign in",
        variant: "destructive",
      });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            name: name.trim()
          },
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        
        let errorMessage = error.message;
        if (error.message.includes('already registered')) {
          errorMessage = 'This email is already registered. Please try signing in instead.';
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = 'Password must be at least 6 characters long.';
        } else if (error.message.includes('Unable to validate email')) {
          errorMessage = 'Please enter a valid email address.';
        }
        
        toast({
          title: "Sign Up Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return { error };
      }

      if (data.user) {
        console.log('Sign up successful:', data.user.email);
        
        if (data.session) {
          toast({
            title: "Account Created!",
            description: "Welcome to Brixium Global Bank! You're now signed in.",
          });
        } else {
          toast({
            title: "Account Created!",
            description: "Please check your email to confirm your account, then sign in.",
          });
        }
        
        return { error: null };
      }
      
      return { error: new Error('No user data received') };
    } catch (error: any) {
      console.error('Sign up catch error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during registration",
        variant: "destructive",
      });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      if (user) {
        await logActivity('logout', { timestamp: new Date().toISOString() });
      }
      
      localStorage.removeItem('user_authenticated');
      localStorage.removeItem('user_email');
      
      await supabase.auth.signOut({ scope: 'global' });
      
      // Use programmatic navigation instead of window.location
      setTimeout(() => {
        window.location.href = '/auth';
      }, 100);
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out completely",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    session,
    isLoading: isLoading || !hasInitialized,
    signIn,
    signUp,
    signOut,
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
