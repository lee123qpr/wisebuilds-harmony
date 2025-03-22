
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';

export const useRefreshCredits = (
  refetchCreditsBalance?: () => Promise<any>,
  refetchTransactionsHistory?: () => Promise<any>
) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Enhanced refetch function that refreshes all credit-related data
  const refreshAllCreditData = async () => {
    console.log('Refreshing all credit data');
    
    if (!user) {
      console.log('No user logged in, cannot refresh credit data');
      return;
    }
    
    try {
      // First, invalidate all the queries to ensure fresh data
      if (user?.id) {
        await queryClient.invalidateQueries({ 
          queryKey: ['creditBalance', user.id]
        });
        
        await queryClient.invalidateQueries({ 
          queryKey: ['creditTransactions', user.id]
        });
      }
      
      // Then trigger the refetches
      const promises = [];
      
      if (refetchCreditsBalance) {
        promises.push(refetchCreditsBalance());
      }
      
      if (refetchTransactionsHistory) {
        promises.push(refetchTransactionsHistory());
      }
      
      // Wait for all refetch operations to complete
      const results = await Promise.all(promises);
      console.log('All credit data refreshed successfully:', results);
      
      // Try a second refresh after a short delay to ensure we have the latest data
      setTimeout(async () => {
        try {
          if (refetchCreditsBalance) await refetchCreditsBalance();
          if (refetchTransactionsHistory) await refetchTransactionsHistory();
          console.log('Second credit data refresh completed');
        } catch (err) {
          console.error('Error in delayed credit refresh:', err);
        }
      }, 2000);
      
      return results;
    } catch (error) {
      console.error('Error refreshing credit data:', error);
    }
  };
  
  return refreshAllCreditData;
};
