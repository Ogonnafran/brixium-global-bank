
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminAuthContextType {
  adminUser: User | null;
  isAdminLoading: boolean;
  adminSignIn: (email: string, password: string) => Promise<{ error: any }>;
  adminSignOut: () => Promise<void>;
  isAuthorizedAdmin: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Default admin credentials for development
const DEFAULT_ADMIN_EMAIL = 'admin@globalbank.com';
const DEFAULT_ADMIN_PASSWORD = 'Admin@12345';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [isAdminLoading, setIsAdminLoading] = useState(true);
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Check if user has admin role or is default admin
          if (session.user.email === DEFAULT_ADMIN_EMAIL) {
            setAdminUser(session.user);
            setIsAuthorizedAdmin(true);
          } else {
            // Check if user has admin role in database
            const { data: roles } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .eq('role', 'admin')
              .single();

            if (roles) {
              setAdminUser(session.user);
              setIsAuthorizedAdmin(true);
            }
          }
        }
      } catch (error) {
        console.error('Admin auth check error:', error);
      } finally {
        setIsAdminLoading(false);
      }
    };

    checkAdminAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setAdminUser(null);
          setIsAuthorizedAdmin(false);
        } else if (event === 'SIGNED_IN' && session?.user) {
          // Check admin role on sign in
          setTimeout(async () => {
            try {
              if (session.user.email === DEFAULT_ADMIN_EMAIL) {
                setAdminUser(session.user);
                setIsAuthorizedAdmin(true);
                toast({
                  title: "Admin Access Granted",
                  description: "Welcome to the admin panel.",
                });
              } else {
                // Check database for admin role
                const { data: roles } = await supabase
                  .from('user_roles')
                  .select('role')
                  .eq('user_id', session.user.id)
                  .eq('role', 'admin')
                  .single();

                if (roles) {
                  setAdminUser(session.user);
                  setIsAuthorizedAdmin(true);
                  toast({
                    title: "Admin Access Granted",
                    description: "Welcome to the admin panel.",
                  });
                } else {
                  await supabase.auth.signOut();
                  toast({
                    title: "Access Denied",
                    description: "You don't have admin privileges.",
                    variant: "destructive",
                  });
                }
              }
            } catch (error) {
              console.error('Admin role check error:', error);
              await supabase.auth.signOut();
              toast({
                title: "Authentication Error",
                description: "Unable to verify admin access.",
                variant: "destructive",
              });
            }
          }, 100);
        }
        setIsAdminLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [toast]);

  const adminSignIn = async (email: string, password: string) => {
    try {
      setIsAdminLoading(true);
      
      // Check if using default admin credentials
      if (email === DEFAULT_ADMIN_EMAIL && password === DEFAULT_ADMIN_PASSWORD) {
        // For development: create admin user if it doesn't exist
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError && signInError.message === 'Invalid login credentials') {
          // Create the admin user
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name: 'Global Bank Admin'
              }
            }
          });

          if (signUpError) {
            toast({
              title: "Admin Setup Failed",
              description: signUpError.message,
              variant: "destructive",
            });
            return { error: signUpError };
          }

          toast({
            title: "Admin Account Created",
            description: "Default admin account has been set up.",
          });
        }
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        let errorMessage = error.message;
        if (error.message === 'Invalid login credentials') {
          errorMessage = 'Invalid admin credentials. Please check your email and password.';
        }
        
        toast({
          title: "Admin Sign In Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred during admin authentication",
        variant: "destructive",
      });
      return { error };
    } finally {
      setIsAdminLoading(false);
    }
  };

  const adminSignOut = async () => {
    try {
      await supabase.auth.signOut({ scope: 'global' });
      setAdminUser(null);
      setIsAuthorizedAdmin(false);
      
      // Clean up auth state
      localStorage.removeItem('supabase.auth.token');
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      window.location.href = '/admin';
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
    adminUser,
    isAdminLoading,
    adminSignIn,
    adminSignOut,
    isAuthorizedAdmin,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
