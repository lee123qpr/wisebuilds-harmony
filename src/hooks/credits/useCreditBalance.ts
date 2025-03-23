
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useNotifications } from '@/context/NotificationsContext';

export const useCreditBalance = () => {
  const { user } = useAuth();
  
  // Try to use notifications but don't fail if it's not available
  let addNotification: ((notification: any) => void) | undefined;
  try {
    const notifications = useNotifications();
    addNotification = notifications?.addNotification;
  } catch (error) {
    console.warn('Notifications context not available in useCreditBalance, notifications disabled');
    // Leave addNotification as undefined
  }

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
    gcTime: 1000, // Very short cache time
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  // Set up real-time updates for credit balance - only if notifications is available
  useEffect(() => {
    if (!user || !addNotification) return;

    let previousBalance = creditBalance;

    // Subscribe to changes in the freelancer_credits table
    const channel = supabase
      .channel('credit_balance_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'freelancer_credits',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          // Refetch the balance
          refetchCreditBalance();
          
          // Only show notification if balance has increased and notifications are available
          if (addNotification) {
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
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
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
