
import { useCreditBalance } from './credits/useCreditBalance';
import { useCreditPlans } from './credits/useCreditPlans';
import { useTransactions } from './credits/useTransactions';
import { usePurchaseCredits } from './credits/usePurchaseCredits';
import { useCheckoutSuccess } from './credits/useCheckoutSuccess';
export { type CreditPlan, type CreditTransaction } from './credits/types';

export const useCredits = () => {
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
    if (refetchCredits) await refetchCredits();
    if (refetchTransactions) await refetchTransactions();
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
