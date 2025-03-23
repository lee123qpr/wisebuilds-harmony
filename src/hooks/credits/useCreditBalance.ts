
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useContext } from 'react';
import { useNotifications } from '@/context/NotificationsContext';

export const useCreditBalance = () => {
  const { user } = useAuth();
  
  // Use the hook that properly handles missing context
  const notificationsContext = useNotifications();
  const addNotification = notificationsContext?.addNotification;

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

  // No longer creating a channel here - this is now handled by the centralized setup

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
