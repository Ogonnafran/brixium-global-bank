
import { useState, useEffect, useRef } from 'react';
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
  created_at?: string;
  updated_at?: string;
}

interface Wallet {
  id: string;
  currency: string;
  balance: number;
  symbol: string;
  type: 'fiat' | 'crypto';
  status: string;
  created_at?: string;
  updated_at?: string;
}

export const useUserData = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use refs to track subscriptions
  const subscriptionsRef = useRef<any[]>([]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw error;
      }
      
      if (data) {
        setProfile(data);
      } else {
        // Profile doesn't exist, this might happen in edge cases
        console.warn('User profile not found, user might need to re-register');
      }
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
        status: wallet.status || 'active',
        created_at: wallet.created_at || undefined,
        updated_at: wallet.updated_at || undefined
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
      // Input validation
      if (!transactionData.amount || transactionData.amount <= 0) {
        return { error: 'Amount must be greater than zero' };
      }

      if (!transactionData.currency || !transactionData.currency.trim()) {
        return { error: 'Currency is required' };
      }

      if (!transactionData.type) {
        return { error: 'Transaction type is required' };
      }

      const insertData: TransactionInsert = {
        user_id: user.id,
        amount: transactionData.amount,
        currency: transactionData.currency.trim().toUpperCase(),
        type: transactionData.type,
        status: transactionData.status || 'pending',
        from_address: transactionData.from_address?.trim() || null,
        to_address: transactionData.to_address?.trim() || null,
        destination: transactionData.destination?.trim() || null,
        network_fee: transactionData.network_fee || 0,
        risk_score: transactionData.risk_score || 0
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

  const setupSubscriptions = () => {
    if (!user) return;

    // Clean up existing subscriptions first
    subscriptionsRef.current.forEach(subscription => {
      try {
        supabase.removeChannel(subscription);
      } catch (err) {
        console.warn('Error removing channel:', err);
      }
    });
    subscriptionsRef.current = [];

    try {
      // Create new subscriptions with unique channel names
      const profileChannel = supabase
        .channel(`profile_changes_${user.id}_${Date.now()}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`
          },
          () => {
            fetchUserProfile();
          }
        )
        .subscribe();

      const walletsChannel = supabase
        .channel(`wallets_changes_${user.id}_${Date.now()}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'wallets',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            fetchWallets();
          }
        )
        .subscribe();

      const transactionsChannel = supabase
        .channel(`transactions_changes_${user.id}_${Date.now()}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'transactions',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            fetchTransactions();
          }
        )
        .subscribe();

      // Store references for cleanup
      subscriptionsRef.current = [profileChannel, walletsChannel, transactionsChannel];
    } catch (err) {
      console.error('Error setting up subscriptions:', err);
    }
  };

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      setError(null);
      
      Promise.all([
        fetchUserProfile(),
        fetchWallets(),
        fetchTransactions()
      ]).finally(() => {
        setIsLoading(false);
      });

      // Set up subscriptions after initial data load
      setTimeout(() => {
        setupSubscriptions();
      }, 100);
    } else {
      setProfile(null);
      setWallets([]);
      setTransactions([]);
      setError(null);
      
      // Clean up subscriptions when user logs out
      subscriptionsRef.current.forEach(subscription => {
        try {
          supabase.removeChannel(subscription);
        } catch (err) {
          console.warn('Error removing channel:', err);
        }
      });
      subscriptionsRef.current = [];
    }

    // Cleanup function
    return () => {
      subscriptionsRef.current.forEach(subscription => {
        try {
          supabase.removeChannel(subscription);
        } catch (err) {
          console.warn('Error removing channel:', err);
        }
      });
      subscriptionsRef.current = [];
    };
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
        setError(null);
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
