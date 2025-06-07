
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type WalletAddress = Database['public']['Tables']['wallet_addresses']['Row'];
type TransferRequest = Database['public']['Tables']['transfer_requests']['Row'];

export const useWalletAddresses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
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
      // Input validation
      if (!toUserUid || !toUserUid.trim()) {
        return { error: 'Recipient Account ID is required' };
      }

      if (amount <= 0) {
        return { error: 'Amount must be greater than zero' };
      }

      if (!currency || !currency.trim()) {
        return { error: 'Currency is required' };
      }

      // Sanitize inputs
      const sanitizedToUserUid = toUserUid.trim();
      const sanitizedCurrency = currency.trim().toUpperCase();
      const sanitizedMessage = message?.trim() || '';

      // Rate limiting check
      const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
      const { data: recentTransfers, error: rateLimitError } = await supabase
        .from('transfer_requests')
        .select('id')
        .eq('from_user_id', user.id)
        .gte('created_at', oneMinuteAgo);

      if (rateLimitError) {
        console.error('Rate limit check error:', rateLimitError);
      } else if (recentTransfers && recentTransfers.length >= 5) {
        return { error: 'Too many transfer requests. Please wait a moment before trying again.' };
      }

      // Find the recipient by user_uid
      const { data: recipientData, error: recipientError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_uid', sanitizedToUserUid)
        .single();

      if (recipientError || !recipientData) {
        return { error: 'Recipient not found. Please check the Account ID and try again.' };
      }

      // Prevent self-transfer
      if (recipientData.id === user.id) {
        return { error: 'You cannot transfer funds to yourself.' };
      }

      // Check sender's balance
      const { data: senderWallet, error: walletError } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user.id)
        .eq('currency', sanitizedCurrency)
        .single();

      if (walletError || !senderWallet) {
        return { error: 'Unable to verify balance. Please try again.' };
      }

      if ((senderWallet.balance || 0) < amount) {
        return { error: 'Insufficient balance for this transfer.' };
      }

      // Call the process_internal_transfer function
      const { data: transferData, error: transferError } = await supabase
        .rpc('process_internal_transfer' as any, {
          p_from_user_id: user.id,
          p_to_user_id: recipientData.id,
          p_amount: amount,
          p_currency: sanitizedCurrency,
          p_message: sanitizedMessage
        });

      if (transferError) {
        console.error('Transfer error:', transferError);
        return { error: transferError.message || 'Transfer failed. Please try again.' };
      }

      // Check if the function returned an error
      if (transferData && !transferData.success) {
        return { error: transferData.error || 'Transfer failed. Please try again.' };
      }

      // Show success message
      toast({
        title: "Transfer Successful",
        description: `Successfully sent ${amount} ${sanitizedCurrency} to ${sanitizedToUserUid}`,
      });

      // Refresh data
      await Promise.all([
        fetchTransferRequests()
      ]);
      
      return { data: transferData, error: null };
    } catch (err: any) {
      console.error('Error creating transfer request:', err);
      return { error: err.message || 'An unexpected error occurred' };
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

      // Set up real-time subscriptions
      const walletAddressesSubscription = supabase
        .channel('wallet_addresses_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'wallet_addresses',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            fetchWalletAddresses();
          }
        )
        .subscribe();

      const transferRequestsSubscription = supabase
        .channel('transfer_requests_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'transfer_requests'
          },
          () => {
            fetchTransferRequests();
          }
        )
        .subscribe();

      return () => {
        walletAddressesSubscription.unsubscribe();
        transferRequestsSubscription.unsubscribe();
      };
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
