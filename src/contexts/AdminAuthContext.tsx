
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

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [isAdminLoading, setIsAdminLoading] = useState(true);
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const { toast } = useToast();

  // Helper function to ensure admin user exists and is properly configured
  const ensureAdminUserSetup = async (userId: string, email: string) => {
    try {
      // First, ensure the user profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        await supabase.from('profiles').insert({
          id: userId,
          name: 'Admin User',
          user_uid: 'BRX' + userId.substring(0, 8).toUpperCase(),
        });
      }

      // Ensure admin role exists
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: 'admin'
        }, {
          onConflict: 'user_id,role'
        });

      if (roleError) {
        console.error('Error ensuring admin role:', roleError);
      }

      // Confirm admin user function call
      const { data: confirmResult } = await supabase.rpc('confirm_admin_user', {
        admin_email: email
      });

      console.log('Admin user setup result:', confirmResult);
      return true;
    } catch (error) {
      console.error('Error setting up admin user:', error);
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;

    const checkAdminAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && mounted) {
          console.log('Found user session:', session.user.email);
          
          // For the default admin email, automatically ensure setup
          if (session.user.email === 'brixiumglobalbank@gmail.com') {
            console.log('Setting up admin user...');
            await ensureAdminUserSetup(session.user.id, session.user.email);
          }

          // Check if user has admin role
          const { data: roleData, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .eq('role', 'admin')
            .single();

          if (!error && roleData && mounted) {
            setAdminUser(session.user);
            setIsAuthorizedAdmin(true);
            console.log('Admin session restored:', session.user.email);
          } else if (mounted) {
            console.log('User authenticated but not admin:', session.user.email);
            setAdminUser(null);
            setIsAuthorizedAdmin(false);
          }
        } else if (mounted) {
          setAdminUser(null);
          setIsAuthorizedAdmin(false);
        }
      } catch (error) {
        console.error('Admin auth check error:', error);
        if (mounted) {
          setAdminUser(null);
          setIsAuthorizedAdmin(false);
        }
      } finally {
        if (mounted) {
          setIsAdminLoading(false);
          setHasInitialized(true);
        }
      }
    };

    checkAdminAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const adminSignIn = async (email: string, password: string) => {
    try {
      setIsAdminLoading(true);
      
      if (!email || !password) {
        const error = new Error('Email and password are required');
        toast({
          title: "Access Denied",
          description: "Please enter both email and password.",
          variant: "destructive",
        });
        return { error };
      }

      const sanitizedEmail = email.trim().toLowerCase();
      console.log('Attempting admin sign in for:', sanitizedEmail);

      // Clean up any existing sessions first
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.log('No existing session to sign out');
      }

      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });
      
      if (error) {
        console.error('Admin sign in error:', error);
        let errorMessage = "Invalid admin credentials.";
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Invalid email or password.";
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "Please confirm your email before signing in.";
        }
        
        toast({
          title: "Access Denied",
          description: errorMessage,
          variant: "destructive",
        });
        return { error };
      }

      if (data.user) {
        console.log('User authenticated:', data.user.email);
        
        // For the default admin email, ensure setup
        if (data.user.email === 'brixiumglobalbank@gmail.com') {
          console.log('Setting up admin user after sign in...');
          await ensureAdminUserSetup(data.user.id, data.user.email);
        }

        // Check if user has admin role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .eq('role', 'admin')
          .single();

        if (roleError && roleError.code !== 'PGRST116') {
          console.error('Error checking admin role:', roleError);
        }

        if (!roleData) {
          console.log('User does not have admin role, attempting to assign...');
          
          // Try to assign admin role if this is the default admin email
          if (data.user.email === 'brixiumglobalbank@gmail.com') {
            const { error: insertError } = await supabase
              .from('user_roles')
              .insert({
                user_id: data.user.id,
                role: 'admin'
              });

            if (insertError) {
              console.error('Error assigning admin role:', insertError);
              await supabase.auth.signOut();
              toast({
                title: "Access Denied",
                description: "Unable to assign admin privileges.",
                variant: "destructive",
              });
              return { error: new Error('Unable to assign admin privileges') };
            }
          } else {
            // Not the default admin email and no admin role
            await supabase.auth.signOut();
            toast({
              title: "Access Denied",
              description: "You do not have admin privileges.",
              variant: "destructive",
            });
            return { error: new Error('Insufficient privileges') };
          }
        }

        // Log admin access
        try {
          await supabase.from('activity_logs').insert({
            user_id: data.user.id,
            action: 'admin_login',
            details: { 
              timestamp: new Date().toISOString(),
              ip_address: '0.0.0.0',
              success: true
            },
            ip_address: '0.0.0.0',
            user_agent: navigator.userAgent
          });
        } catch (logError) {
          console.error('Error logging admin access:', logError);
        }

        setAdminUser(data.user);
        setIsAuthorizedAdmin(true);

        toast({
          title: "Welcome back!",
          description: "Successfully signed in to admin panel.",
        });

        console.log('Admin successfully authenticated:', data.user.email);
        
        return { error: null };
      }

      return { error: new Error('Authentication failed') };
    } catch (error: any) {
      console.error('Admin sign in catch error:', error);
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
      if (adminUser) {
        await supabase.from('activity_logs').insert({
          user_id: adminUser.id,
          action: 'admin_logout',
          details: { 
            timestamp: new Date().toISOString(),
            ip_address: '0.0.0.0'
          },
          ip_address: '0.0.0.0',
          user_agent: navigator.userAgent
        });
      }
      
      setAdminUser(null);
      setIsAuthorizedAdmin(false);
      
      await supabase.auth.signOut({ scope: 'global' });
      
      toast({
        title: "Signed Out",
        description: "You have been signed out of the admin panel.",
      });
      
      console.log('Admin signed out successfully');
      
      setTimeout(() => {
        window.location.href = '/admin';
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
    adminUser,
    isAdminLoading: isAdminLoading || !hasInitialized,
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
