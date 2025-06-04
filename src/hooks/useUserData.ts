
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  id: string;
  name: string;
  phone?: string;
  status: string;
  kyc_status: string;
  risk_level: string;
}

interface Wallet {
  id: string;
  currency: string;
  balance: number;
  symbol: string;
  type: string;
  status: string;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  currency: string;
  destination?: string;
  from_address?: string;
  to_address?: string;
  network_fee: number;
  status: string;
  risk_score: number;
  created_at: string;
}

export const useUserData = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message);
    }
  };

  const fetchWallets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setWallets(data || []);
    } catch (err: any) {
      console.error('Error fetching wallets:', err);
      setError(err.message);
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setTransactions(data || []);
    } catch (err: any) {
      console.error('Error fetching transactions:', err);
      setError(err.message);
    }
  };

  const createTransaction = async (transactionData: Partial<Transaction>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          ...transactionData
        })
        .select()
        .single();

      if (error) throw error;
      
      // Refresh transactions list
      await fetchTransactions();
      
      return { data, error: null };
    } catch (err: any) {
      console.error('Error creating transaction:', err);
      return { error: err.message };
    }
  };

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      Promise.all([
        fetchUserProfile(),
        fetchWallets(),
        fetchTransactions()
      ]).finally(() => {
        setIsLoading(false);
      });
    } else {
      setProfile(null);
      setWallets([]);
      setTransactions([]);
    }
  }, [user]);

  return {
    profile,
    wallets,
    transactions,
    isLoading,
    error,
    refetchData: () => {
      if (user) {
        setIsLoading(true);
        Promise.all([
          fetchUserProfile(),
          fetchWallets(),
          fetchTransactions()
        ]).finally(() => {
          setIsLoading(false);
        });
      }
    },
    createTransaction
  };
};
