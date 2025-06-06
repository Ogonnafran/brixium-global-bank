
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';

type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
type TransactionRow = Database['public']['Tables']['transactions']['Row'];

interface UserProfile {
  id: string;
  name: string;
  phone?: string;
  status: string;
  kyc_status: string;
  risk_level: string;
  user_uid?: string;
}

interface Wallet {
  id: string;
  currency: string;
  balance: number;
  symbol: string;
  type: 'fiat' | 'crypto';
  status: string;
}

export const useUserData = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
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
      
      // Transform the data to match our Wallet interface
      const transformedWallets: Wallet[] = (data || []).map(wallet => ({
        id: wallet.id,
        currency: wallet.currency,
        balance: wallet.balance || 0,
        symbol: wallet.symbol,
        type: wallet.type as 'fiat' | 'crypto',
        status: wallet.status || 'active'
      }));
      
      setWallets(transformedWallets);
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

  const createTransaction = async (transactionData: Omit<TransactionInsert, 'user_id'>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const insertData: TransactionInsert = {
        user_id: user.id,
        amount: transactionData.amount,
        currency: transactionData.currency,
        type: transactionData.type,
        ...transactionData
      };

      const { data, error } = await supabase
        .from('transactions')
        .insert(insertData)
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
