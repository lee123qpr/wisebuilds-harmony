
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCredits } from '@/hooks/useCredits';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const usePaymentProcessing = (sessionId: string | null) => {
  const { handleCheckoutSuccess, creditBalance, refetchCredits, transactions } = useCredits();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [processingComplete, setProcessingComplete] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [manualUpdateAttempted, setManualUpdateAttempted] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const { toast } = useToast();
  
  // Check if the current transaction is pending - but avoid exposing full session ID
  const isTransactionPending = !!(transactions && sessionId && 
    transactions.find(tx => tx.stripe_payment_id === sessionId)?.status === 'pending');

  // Effect to handle initial session check
  useEffect(() => {
    const checkStripeSession = async () => {
      if (!sessionId || !user) return;
      
      try {
        const { data: transaction } = await supabase
          .from('credit_transactions')
          .select('status')
          .eq('stripe_payment_id', sessionId)
          .maybeSingle();
          
        if (transaction?.status === 'completed') {
          setProcessingComplete(true);
          refetchCredits();
        }
      } catch (error) {
        console.error('Error checking transaction status:', error);
      }
    };
    
    if (sessionId && !isLoading && initialLoad) {
      checkStripeSession();
      setInitialLoad(false);
    }
  }, [sessionId, isLoading, initialLoad, refetchCredits, user]);
  
  const forceUpdateTransaction = async () => {
    if (!sessionId || manualUpdateAttempted) return;
    
    try {
      setManualUpdateAttempted(true);
      setIsRefreshing(true);
      
      await supabase.functions.invoke('webhook-stripe', {
        body: {
          type: 'manual_update',
          data: {
            sessionId
          }
        }
      });
      
      setTimeout(() => {
        refetchCredits();
        setIsRefreshing(false);
      }, 2000);
    } catch (error) {
      console.error('Exception during manual transaction update:', error);
      setIsRefreshing(false);
    }
  };
  
  // Effect to handle the initial processing
  useEffect(() => {
    const processCheckout = async () => {
      if (sessionId && !isLoading && !processingComplete) {
        if (!user) {
          const sessionBackup = localStorage.getItem('sb-session-backup');
          if (sessionBackup) {
            try {
              await supabase.auth.setSession(JSON.parse(sessionBackup));
              await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
              console.error('Error restoring session:', error);
            }
          }
        }
        
        handleCheckoutSuccess(sessionId);
        setProcessingComplete(true);
        
        setTimeout(() => {
          refetchCredits();
        }, 2000);
      } else if (!sessionId && !isLoading) {
        const timer = setTimeout(() => {
          navigate('/dashboard/freelancer/credits');
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    };
    
    processCheckout();
  }, [sessionId, handleCheckoutSuccess, navigate, user, isLoading, processingComplete, refetchCredits]);
  
  // Auto-refresh data but with exponential backoff and limited retries
  useEffect(() => {
    // Only run polling if we have a pending transaction or incomplete processing
    if (isTransactionPending || (processingComplete && creditBalance === 0 && retryCount < 4)) {
      if (isRefreshing) return;
      
      // Use exponential backoff: 2^retryCount * 1000ms, but cap at 15 seconds
      const backoffTime = Math.min(Math.pow(2, retryCount) * 1000, 15000);
      
      const timer = setTimeout(async () => {
        setIsRefreshing(true);
        await refetchCredits();
        setIsRefreshing(false);
        setRetryCount(prev => prev + 1);
        
        // Try a manual update after the second retry
        if (retryCount === 2 && (isTransactionPending || creditBalance === 0) && sessionId && !manualUpdateAttempted) {
          forceUpdateTransaction();
        }
      }, backoffTime);
      
      return () => clearTimeout(timer);
    }
  }, [processingComplete, creditBalance, retryCount, isRefreshing, refetchCredits, sessionId, isTransactionPending, manualUpdateAttempted]);
  
  const handleManualRefresh = useCallback(async () => {
    setIsRefreshing(true);
    
    if (sessionId && !manualUpdateAttempted && isTransactionPending) {
      await forceUpdateTransaction();
      setTimeout(async () => {
        await refetchCredits();
        setIsRefreshing(false);
      }, 2000);
    } else {
      await refetchCredits();
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  }, [sessionId, manualUpdateAttempted, isTransactionPending, refetchCredits]);

  return {
    creditBalance,
    isRefreshing,
    processingComplete,
    isTransactionPending,
    handleManualRefresh
  };
};
