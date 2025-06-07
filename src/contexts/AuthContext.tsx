
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
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth state cleanup utility
const cleanupAuthState = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
  localStorage.removeItem('user_authenticated');
  localStorage.removeItem('user_email');
};

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
        // Set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;

            console.log('Auth state changed:', event, session?.user?.email);
            setSession(session);
            setUser(session?.user ?? null);
            
            if (event === 'SIGNED_IN' && session?.user) {
              localStorage.setItem('user_authenticated', 'true');
              localStorage.setItem('user_email', session.user.email || '');
              
              // Defer activity logging to prevent deadlocks
              setTimeout(() => {
                if (mounted) {
                  logActivity('login', { timestamp: new Date().toISOString() });
                }
              }, 100);
            }
            
            if (event === 'SIGNED_OUT') {
              cleanupAuthState();
            }
            
            if (event === 'PASSWORD_RECOVERY') {
              toast({
                title: "Password Reset",
                description: "Please check your email for password reset instructions.",
              });
            }
          }
        );

        // Then check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          cleanupAuthState();
        } else if (mounted) {
          console.log('Initial session check:', session?.user?.email || 'No session');
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            localStorage.setItem('user_authenticated', 'true');
            localStorage.setItem('user_email', session.user.email || '');
          }
        }

        // Cleanup on unmount
        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Session initialization error:', error);
        if (mounted) {
          cleanupAuthState();
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
          setHasInitialized(true);
        }
      }
    };

    initializeAuth();
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
      
      // Clean up any existing state
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
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
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and confirm your account before signing in.';
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
        
        // Force page reload for clean state
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
        
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
      
      // Clean up any existing state
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            name: name.trim()
          },
          emailRedirectTo: `${window.location.origin}/`
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
          
          // Force page reload for clean state
          setTimeout(() => {
            window.location.href = '/';
          }, 100);
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

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });
      
      if (error) {
        console.error('Password reset error:', error);
        toast({
          title: "Password Reset Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Password Reset Sent",
        description: "Please check your email for password reset instructions.",
      });
      
      return { error: null };
    } catch (error: any) {
      console.error('Password reset catch error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) {
        console.error('Password update error:', error);
        toast({
          title: "Password Update Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
      });
      
      return { error: null };
    } catch (error: any) {
      console.error('Password update catch error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      if (user) {
        await logActivity('logout', { timestamp: new Date().toISOString() });
      }
      
      cleanupAuthState();
      
      await supabase.auth.signOut({ scope: 'global' });
      
      // Force page reload for clean state
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
    resetPassword,
    updatePassword,
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
