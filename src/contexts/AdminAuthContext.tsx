
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

// Updated admin credentials
const ADMIN_EMAIL = 'brixiumglobalbank@gmail.com';
const ADMIN_PASSWORD = 'ogonna1@1';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [isAdminLoading, setIsAdminLoading] = useState(true);
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        // Check if admin is already logged in via localStorage
        const storedAdminAuth = localStorage.getItem('admin_authenticated');
        const storedAdminEmail = localStorage.getItem('admin_email');
        
        if (storedAdminAuth === 'true' && storedAdminEmail === ADMIN_EMAIL) {
          // Create a mock admin user object
          const mockAdminUser: User = {
            id: 'admin-user-id',
            email: ADMIN_EMAIL,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            app_metadata: {},
            user_metadata: { name: 'Brixium Admin' },
            aud: 'authenticated',
            confirmation_sent_at: null,
            confirmed_at: new Date().toISOString(),
            email_confirmed_at: new Date().toISOString(),
            identities: [],
            last_sign_in_at: new Date().toISOString(),
            phone: null,
            recovery_sent_at: null,
            role: 'authenticated'
          };
          
          setAdminUser(mockAdminUser);
          setIsAuthorizedAdmin(true);
          console.log('Admin session restored from localStorage');
        }
      } catch (error) {
        console.error('Admin auth check error:', error);
      } finally {
        setIsAdminLoading(false);
      }
    };

    checkAdminAuth();
  }, []);

  const adminSignIn = async (email: string, password: string) => {
    try {
      setIsAdminLoading(true);
      
      // Check hardcoded admin credentials
      if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
        // Create mock admin user
        const mockAdminUser: User = {
          id: 'admin-user-id',
          email: ADMIN_EMAIL,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          app_metadata: {},
          user_metadata: { name: 'Brixium Admin' },
          aud: 'authenticated',
          confirmation_sent_at: null,
          confirmed_at: new Date().toISOString(),
          email_confirmed_at: new Date().toISOString(),
          identities: [],
          last_sign_in_at: new Date().toISOString(),
          phone: null,
          recovery_sent_at: null,
          role: 'authenticated'
        };

        // Store admin auth in localStorage for persistence
        localStorage.setItem('admin_authenticated', 'true');
        localStorage.setItem('admin_email', ADMIN_EMAIL);
        
        setAdminUser(mockAdminUser);
        setIsAuthorizedAdmin(true);

        toast({
          title: "Admin Access Granted",
          description: "Welcome to the Brixium admin panel.",
        });

        console.log('Admin successfully authenticated');
        
        // Redirect to admin dashboard
        setTimeout(() => {
          window.location.href = '/admin/dashboard';
        }, 1000);
        
        return { error: null };
      } else {
        toast({
          title: "Access Denied",
          description: "Invalid admin credentials.",
          variant: "destructive",
        });
        return { error: new Error('Invalid admin credentials') };
      }
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
      // Clear admin auth from localStorage
      localStorage.removeItem('admin_authenticated');
      localStorage.removeItem('admin_email');
      
      setAdminUser(null);
      setIsAuthorizedAdmin(false);
      
      toast({
        title: "Signed Out",
        description: "You have been signed out of the admin panel.",
      });
      
      console.log('Admin signed out successfully');
      
      // Redirect to admin login
      setTimeout(() => {
        window.location.href = '/admin';
      }, 1000);
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
