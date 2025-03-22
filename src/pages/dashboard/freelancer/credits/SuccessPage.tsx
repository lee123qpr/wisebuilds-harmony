import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useCredits } from '@/hooks/useCredits';
import { Button } from '@/components/ui/button';
import { CheckCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { handleCheckoutSuccess, creditBalance, refetchCredits, transactions } = useCredits();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [processingComplete, setProcessingComplete] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [manualUpdateAttempted, setManualUpdateAttempted] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const checkStripeSession = async () => {
      if (!sessionId) return;
      
      try {
        const { data: transaction } = await supabase
          .from('credit_transactions')
          .select('status')
          .eq('stripe_payment_id', sessionId)
          .maybeSingle();
          
        console.log('Transaction found with status:', transaction?.status);
        
        if (transaction?.status === 'completed') {
          console.log('Transaction already completed');
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
  }, [sessionId, isLoading, initialLoad, refetchCredits]);
  
  const forceUpdateTransaction = async () => {
    if (!sessionId || manualUpdateAttempted) return;
    
    try {
      console.log(`Attempting to manually update transaction for session: ${sessionId}`);
      setManualUpdateAttempted(true);
      setIsRefreshing(true);
      
      const response = await supabase.functions.invoke('webhook-stripe', {
        body: {
          type: 'manual_update',
          data: {
            sessionId
          }
        }
      });
      
      console.log('Manual transaction update response:', response);
      
      if (response.data?.success) {
        console.log('Manual update successful');
        toast({
          title: 'Update Successful',
          description: 'Your transaction has been processed',
          variant: 'default',
        });
      }
      
      setTimeout(() => {
        refetchCredits();
        setIsRefreshing(false);
      }, 2000);
    } catch (error) {
      console.error('Exception during manual transaction update:', error);
      setIsRefreshing(false);
    }
  };
  
  useEffect(() => {
    const processCheckout = async () => {
      if (sessionId && !isLoading && !processingComplete) {
        console.log('Processing checkout success with session ID:', sessionId);
        
        if (!user) {
          const sessionBackup = localStorage.getItem('sb-session-backup');
          if (sessionBackup) {
            try {
              console.log('Attempting to restore session from backup');
              await supabase.auth.setSession(JSON.parse(sessionBackup));
              await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
              console.error('Error restoring session:', error);
            }
          }
        }
        
        handleCheckoutSuccess(sessionId);
        setProcessingComplete(true);
        
        setTimeout(async () => {
          await refetchCredits();
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
  
  const isTransactionPending = React.useMemo(() => {
    if (!transactions || !sessionId) return false;
    
    const currentTransaction = transactions.find(tx => 
      tx.stripe_payment_id === sessionId
    );
    
    return currentTransaction?.status === 'pending';
  }, [transactions, sessionId]);
  
  useEffect(() => {
    const shouldAutoRefresh = isTransactionPending || (processingComplete && creditBalance === 0 && retryCount < 6);
    
    if (shouldAutoRefresh && !isRefreshing) {
      const timer = setTimeout(async () => {
        console.log(`Auto-refreshing credit data (attempt ${retryCount + 1})`);
        setIsRefreshing(true);
        await refetchCredits();
        setIsRefreshing(false);
        setRetryCount(prev => prev + 1);
        
        if (retryCount === 2 && (isTransactionPending || creditBalance === 0) && sessionId && !manualUpdateAttempted) {
          forceUpdateTransaction();
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [processingComplete, creditBalance, retryCount, isRefreshing, refetchCredits, sessionId, isTransactionPending, manualUpdateAttempted]);
  
  const handleManualRefresh = async () => {
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
  };
  
  return (
    <MainLayout>
      <div className="container py-20">
        <div className="max-w-md mx-auto">
          <div className="text-center">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-gray-500 mb-4">
              Your credits have been added to your account. You can now apply for projects and 
              contact clients directly.
            </p>
            
            {creditBalance !== null && creditBalance > 0 ? (
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="text-gray-700 font-medium">Current Balance</p>
                <p className="text-3xl font-bold text-green-600">{creditBalance} credits</p>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <p className="text-gray-700 font-medium">Refreshing your balance...</p>
                <p className="text-sm text-gray-500 mb-2">
                  If your credits don't appear, please click the refresh button below.
                </p>
                {isTransactionPending && (
                  <p className="text-sm font-medium text-orange-600 mb-2">
                    Your payment is still processing. This may take a moment.
                  </p>
                )}
                <p className="text-xs text-gray-400">
                  (Transaction ID: {sessionId ? sessionId.slice(0, 12) + '...' : 'Not available'})
                </p>
              </div>
            )}
            
            <div className="flex flex-col gap-3">
              <Button 
                onClick={handleManualRefresh}
                className="w-full flex items-center justify-center"
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Credit Balance'}
              </Button>
              
              <Button 
                onClick={() => navigate('/dashboard/freelancer/credits')}
                className="w-full flex items-center justify-center"
                variant="default"
              >
                View My Credits
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              
              <Button 
                onClick={() => navigate('/dashboard/freelancer')}
                variant="outline"
                className="w-full"
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SuccessPage;
