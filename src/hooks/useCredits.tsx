
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
    plansError,
    refetchPlans
  } = useCreditPlans();
  
  const { 
    transactions, 
    isLoadingTransactions, 
    transactionsError,
    refetchTransactions
  } = useTransactions();
  
  const {
    purchaseCredits,
    isCheckoutLoading,
    checkoutError,
    testStripeConnection
  } = usePurchaseCredits();
  
  const { handleCheckoutSuccess } = useCheckoutSuccess();
  
  const refreshAll = () => {
    refetchCredits();
    refetchPlans();
    refetchTransactions();
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
    checkoutError,
    purchaseCredits,
    handleCheckoutSuccess,
    refetchCredits: refreshAll,
    testStripeConnection
  };
};
