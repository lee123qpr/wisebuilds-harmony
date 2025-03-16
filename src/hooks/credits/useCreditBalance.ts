
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
      
      const { data, error } = await supabase
        .from('freelancer_credits')
        .select('credit_balance')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching credit balance:', error);
        throw error;
      }
      
      return data?.credit_balance || 0;
    },
    enabled: !!user,
  });

  const refetchCredits = async () => {
    if (refetchCreditBalance) {
      return refetchCreditBalance();
    }
  };

  return {
    creditBalance,
    isLoadingBalance,
    balanceError,
    refetchCredits
  };
};
