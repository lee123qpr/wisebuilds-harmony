
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
      return data as CreditTransaction[];
    },
    enabled: !!user,
    staleTime: 0, // Always consider data stale to force fresh fetch
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const refetchTransactionsData = async () => {
    if (!user) return null;
    
    console.log('Explicitly refetching transaction history with force refresh');
    try {
      // Force invalidate the query before refetching
      const result = await refetchTransactions({ cancelRefetch: false });
      console.log('Transaction refresh result:', result.data?.length || 0, 'transactions');
      
      // Do a second refetch after a brief delay to ensure we have the latest data
      setTimeout(async () => {
        const secondResult = await refetchTransactions({ cancelRefetch: false });
        console.log('Secondary transaction refresh result:', secondResult.data?.length || 0, 'transactions');
      }, 1000);
      
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
