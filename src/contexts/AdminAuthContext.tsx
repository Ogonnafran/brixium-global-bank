
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

  useEffect(() => {
    let mounted = true;

    const checkAdminAuth = async () => {
      try {
        // Check if user is authenticated and has admin role
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && mounted) {
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
            // User is logged in but not an admin
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
      
      // Validate inputs
      if (!email || !password) {
        const error = new Error('Email and password are required');
        toast({
          title: "Access Denied",
          description: "Please enter both email and password.",
          variant: "destructive",
        });
        return { error };
      }

      // Sanitize email
      const sanitizedEmail = email.trim().toLowerCase();

      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });
      
      if (error) {
        console.error('Admin sign in error:', error);
        toast({
          title: "Access Denied",
          description: "Invalid admin credentials.",
          variant: "destructive",
        });
        return { error };
      }

      if (data.user) {
        // Check if user has admin role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .eq('role', 'admin')
          .single();

        if (roleError || !roleData) {
          // User doesn't have admin role
          await supabase.auth.signOut();
          toast({
            title: "Access Denied",
            description: "You do not have admin privileges.",
            variant: "destructive",
          });
          return { error: new Error('Insufficient privileges') };
        }

        // Log admin access
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

        setAdminUser(data.user);
        setIsAuthorizedAdmin(true);

        toast({
          title: "Admin Access Granted",
          description: "Welcome to the Brixium admin panel.",
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
        // Log admin logout
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
      
      // Redirect to admin login
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
