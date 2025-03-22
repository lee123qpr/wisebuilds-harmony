
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
    staleTime: 30000, // Consider data stale after 30 seconds
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });

  return {
    transactions,
    isLoadingTransactions,
    transactionsError,
    refetchTransactions
  };
};
