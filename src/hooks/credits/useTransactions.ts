
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { CreditTransaction } from './types';
import { useEffect } from 'react';

export const useTransactions = () => {
  const { user } = useAuth();

  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    error: transactionsError,
    refetch: refetchTransactions
  } = useQuery({
    queryKey: ['creditTransactions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }
      
      // Only attempt to update pending transactions that haven't been updated recently
      const pendingTransactions = data?.filter(tx => {
        // Make sure we have a valid transaction with a status
        if (!tx || tx.status !== 'pending') return false;
        
        // Get the timestamp to use for checking staleness
        // Using created_at as default if updated_at doesn't exist
        let lastUpdateTime = tx.created_at;
        
        // Check if the last update was more than 5 minutes ago
        return new Date(lastUpdateTime).getTime() + 5 * 60 * 1000 < Date.now();
      }) || [];
      
      if (pendingTransactions.length > 0) {
        console.log(`Found ${pendingTransactions.length} pending transactions. Will attempt to update them.`);
        
        // Update at most 3 pending transactions per load to avoid excessive API calls
        const transactionsToUpdate = pendingTransactions.slice(0, 3);
        
        for (const tx of transactionsToUpdate) {
          try {
            if (tx.stripe_payment_id) {
              await supabase.functions.invoke('webhook-stripe', {
                body: {
                  type: 'manual_update',
                  data: {
                    sessionId: tx.stripe_payment_id
                  }
                }
              });
            }
          } catch (err) {
            console.error(`Error updating pending transaction ${tx.id}:`, err);
          }
        }
      }
      
      return data as CreditTransaction[];
    },
    enabled: !!user,
    staleTime: 60000, // Consider data stale after 1 minute
    gcTime: 1000, // Very short cache time
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  // Set up real-time subscription for transactions
  useEffect(() => {
    if (!user) return;

    // Subscribe to changes in the credit_transactions table
    const channel = supabase
      .channel('credit_transactions_channel')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'credit_transactions',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          // Refetch transactions when any change occurs
          refetchTransactions();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refetchTransactions]);

  const refetchTransactionsData = async () => {
    if (!user) return null;
    
    try {
      const result = await refetchTransactions({ cancelRefetch: false });
      return result;
    } catch (error) {
      console.error('Error refetching transactions:', error);
      throw error;
    }
  };

  return {
    transactions,
    isLoadingTransactions,
    transactionsError,
    refetchTransactions: refetchTransactionsData
  };
};
