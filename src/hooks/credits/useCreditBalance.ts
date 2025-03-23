
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useNotifications } from '@/context/NotificationsContext';
import { createCreditBalanceListener, cleanupCreditListeners } from '@/services/notifications/listeners/creditListeners';

export const useCreditBalance = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

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
    staleTime: 60000, // Consider data stale after 1 minute, reducing polling frequency
    gcTime: 30000, // Cache time increased to 30 seconds
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  // Set up single real-time listener for credit balance updates
  useEffect(() => {
    if (!user) return;

    let previousBalance = creditBalance;
    
    // Set up listener for credit balance updates
    const channel = createCreditBalanceListener(user.id, (payload) => {
      // Refetch the balance
      refetchCreditBalance();
      
      // Only show notification if balance has increased
      const newBalance = payload.new?.credit_balance || 0;
      if (previousBalance !== null && newBalance > previousBalance) {
        const difference = newBalance - previousBalance;
        addNotification({
          type: 'credit_update',
          title: 'Credits Added',
          description: `${difference} credits have been added to your account.`
        });
      }
      
      // Update previous balance
      previousBalance = newBalance;
    });

    // Cleanup subscription on unmount
    return () => {
      cleanupCreditListeners(user.id);
    };
  }, [user, creditBalance, refetchCreditBalance, addNotification]);

  const refetchCredits = async () => {
    if (!user) return null;
    
    try {
      const result = await refetchCreditBalance({ cancelRefetch: false });
      return result;
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
