
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';

type WalletAddress = Database['public']['Tables']['wallet_addresses']['Row'];
type TransferRequest = Database['public']['Tables']['transfer_requests']['Row'];

export const useWalletAddresses = () => {
  const { user } = useAuth();
  const [walletAddresses, setWalletAddresses] = useState<WalletAddress[]>([]);
  const [transferRequests, setTransferRequests] = useState<TransferRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWalletAddresses = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wallet_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setWalletAddresses(data || []);
    } catch (err: any) {
      console.error('Error fetching wallet addresses:', err);
      setError(err.message);
    }
  };

  const fetchTransferRequests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transfer_requests')
        .select('*')
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransferRequests(data || []);
    } catch (err: any) {
      console.error('Error fetching transfer requests:', err);
      setError(err.message);
    }
  };

  const createTransferRequest = async (toUserUid: string, amount: number, currency: string, message?: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      // First, find the recipient by user_uid
      const { data: recipientData, error: recipientError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_uid', toUserUid)
        .single();

      if (recipientError || !recipientData) {
        return { error: 'Recipient not found. Please check the Account ID.' };
      }

      // Check sender's balance
      const { data: senderWallet, error: walletError } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user.id)
        .eq('currency', currency)
        .single();

      if (walletError || !senderWallet) {
        return { error: 'Unable to verify balance. Please try again.' };
      }

      if ((senderWallet.balance || 0) < amount) {
        return { error: 'Insufficient balance for this transfer.' };
      }

      // Start a transaction to ensure atomicity
      const { data: transferData, error: transferError } = await supabase.rpc('process_internal_transfer', {
        p_from_user_id: user.id,
        p_to_user_id: recipientData.id,
        p_amount: amount,
        p_currency: currency,
        p_message: message || ''
      });

      if (transferError) {
        console.error('Transfer error:', transferError);
        return { error: transferError.message || 'Transfer failed. Please try again.' };
      }

      // Refresh data
      await Promise.all([
        fetchTransferRequests()
      ]);
      
      return { data: transferData, error: null };
    } catch (err: any) {
      console.error('Error creating transfer request:', err);
      return { error: err.message };
    }
  };

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      Promise.all([
        fetchWalletAddresses(),
        fetchTransferRequests()
      ]).finally(() => {
        setIsLoading(false);
      });
    } else {
      setWalletAddresses([]);
      setTransferRequests([]);
    }
  }, [user]);

  return {
    walletAddresses,
    transferRequests,
    isLoading,
    error,
    refetchData: () => {
      if (user) {
        setIsLoading(true);
        Promise.all([
          fetchWalletAddresses(),
          fetchTransferRequests()
        ]).finally(() => {
          setIsLoading(false);
        });
      }
    },
    createTransferRequest
  };
};
