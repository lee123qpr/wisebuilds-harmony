
import { useCreditBalance } from './credits/useCreditBalance';
import { useCreditPlans } from './credits/useCreditPlans';
import { useTransactions } from './credits/useTransactions';
import { usePurchaseCredits } from './credits/usePurchaseCredits';
import { useCheckoutSuccess } from './credits/useCheckoutSuccess';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
export { type CreditPlan, type CreditTransaction } from './credits/types';

export const useCredits = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const { 
    creditBalance, 
    isLoadingBalance, 
    balanceError,
    refetchCredits
  } = useCreditBalance();
  
  const { 
    creditPlans, 
    isLoadingPlans, 
    plansError 
  } = useCreditPlans();
  
  const { 
    transactions, 
    isLoadingTransactions, 
    transactionsError,
    refetchTransactions
  } = useTransactions();
  
  const {
    purchaseCredits,
    isCheckoutLoading
  } = usePurchaseCredits();
  
  const { handleCheckoutSuccess } = useCheckoutSuccess();
  
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
      
      if (refetchCredits) {
        promises.push(refetchCredits());
      }
      
      if (refetchTransactions) {
        promises.push(refetchTransactions());
      }
      
      // Wait for all refetch operations to complete
      const results = await Promise.all(promises);
      console.log('All credit data refreshed successfully:', results);
      
      // Try a second refresh after a short delay to ensure we have the latest data
      setTimeout(async () => {
        try {
          if (refetchCredits) await refetchCredits();
          if (refetchTransactions) await refetchTransactions();
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
  
  return {
    creditBalance,
    creditPlans,
    transactions,
    isLoadingBalance,
    isLoadingPlans,
    isLoadingTransactions,
    isCheckoutLoading,
    balanceError,
    plansError,
    transactionsError,
    purchaseCredits,
    handleCheckoutSuccess,
    refetchCredits: refreshAllCreditData,
  };
};
