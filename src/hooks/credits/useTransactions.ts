
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
        // Use created_at if updated_at is not available
        const lastUpdateTime = tx.updated_at || tx.created_at;
        return tx.status === 'pending' && 
               new Date(lastUpdateTime).getTime() + 5 * 60 * 1000 < Date.now();
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
