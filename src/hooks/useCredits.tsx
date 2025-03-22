
import { useCreditBalance } from './credits/useCreditBalance';
import { useCreditPlans } from './credits/useCreditPlans';
import { useTransactions } from './credits/useTransactions';
import { usePurchaseCredits } from './credits/usePurchaseCredits';
import { useCheckoutSuccess } from './credits/useCheckoutSuccess';
import { useRefreshCredits } from './credits/useRefreshCredits';
import { useAuth } from '@/context/AuthContext';
export { type CreditPlan, type CreditTransaction } from './credits/types';

export const useCredits = () => {
  const { user } = useAuth();
  
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
  
  // Use the extracted refresh function
  const refreshAllCreditData = useRefreshCredits(refetchCredits, refetchTransactions);
  
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
