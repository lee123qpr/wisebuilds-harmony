
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export const useCreditBalance = () => {
  const { user } = useAuth();

  const {
    data: creditBalance,
    isLoading: isLoadingBalance,
    error: balanceError,
    refetch: refetchCreditBalance
  } = useQuery({
    queryKey: ['creditBalance', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      console.log(`Fetching credit balance for user ${user.id}...`);
      
      const { data, error } = await supabase
        .from('freelancer_credits')
        .select('credit_balance')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching credit balance:', error);
        throw error;
      }
      
      console.log(`Retrieved credit balance for user ${user.id}: ${data?.credit_balance || 0}`);
      return data?.credit_balance || 0;
    },
    enabled: !!user,
    staleTime: 0, // Always consider data stale to force fresh fetch
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  const refetchCredits = async () => {
    if (!user) return null;
    
    console.log('Explicitly refetching credit balance with force refresh');
    try {
      // Invalidate the query before refetching
      await refetchCreditBalance({ cancelRefetch: false });
      
      // Do a second refetch after a brief delay to ensure we have the latest data
      setTimeout(async () => {
        const result = await refetchCreditBalance({ cancelRefetch: false });
        console.log('Secondary credit balance refresh result:', result.data);
        return result;
      }, 1000);
    } catch (error) {
      console.error('Error refetching credit balance:', error);
      throw error;
    }
  };

  return {
    creditBalance,
    isLoadingBalance,
    balanceError,
    refetchCredits
  };
};
