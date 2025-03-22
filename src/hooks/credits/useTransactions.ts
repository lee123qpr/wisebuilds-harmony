
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { CreditTransaction } from './types';

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
      
      console.log(`Fetching credit transactions for user: ${user.id}`);
      
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }
      
      console.log(`Found ${data?.length || 0} transactions`);
      
      // Check if there are any pending transactions
      const pendingTransactions = data?.filter(tx => tx.status === 'pending') || [];
      if (pendingTransactions.length > 0) {
        console.log(`Found ${pendingTransactions.length} pending transactions. Will attempt to update them.`);
        
        // Attempt to manually update each pending transaction
        for (const tx of pendingTransactions) {
          try {
            if (tx.stripe_payment_id) {
              console.log(`Attempting to update pending transaction: ${tx.stripe_payment_id}`);
              await supabase.functions.invoke('webhook-stripe', {
                body: {
                  type: 'manual_update',
                  data: {
                    sessionId: tx.stripe_payment_id
                  }
                }
              });
              console.log(`Sent update request for transaction: ${tx.stripe_payment_id}`);
            }
          } catch (err) {
            console.error(`Error updating pending transaction ${tx.id}:`, err);
          }
        }
      }
      
      return data as CreditTransaction[];
    },
    enabled: !!user,
    staleTime: 0, // Always consider data stale
    gcTime: 1000, // Very short cache time (changed from cacheTime to gcTime)
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 5000, // Poll every 5 seconds when active
  });

  const refetchTransactionsData = async () => {
    if (!user) return null;
    
    console.log('Explicitly refetching transaction history with force refresh');
    try {
      // Force invalidate the query before refetching
      const result = await refetchTransactions({ cancelRefetch: false });
      console.log('Transaction refresh result:', result.data?.length || 0, 'transactions');
      
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
