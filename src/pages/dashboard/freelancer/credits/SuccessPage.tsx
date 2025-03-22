
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useCredits } from '@/hooks/useCredits';
import { Button } from '@/components/ui/button';
import { CheckCircle, RefreshCw } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { handleCheckoutSuccess, creditBalance, refetchCredits } = useCredits();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [processingComplete, setProcessingComplete] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Effect to handle the initial processing
  useEffect(() => {
    const processCheckout = async () => {
      if (sessionId && !isLoading && !processingComplete) {
        console.log('Processing checkout success with session ID:', sessionId);
        
        // Attempt to restore the session from backup if needed
        if (!user) {
          const sessionBackup = localStorage.getItem('sb-session-backup');
          if (sessionBackup) {
            try {
              console.log('Attempting to restore session from backup');
              // This will trigger an auth state change if successful
              await supabase.auth.setSession(JSON.parse(sessionBackup));
              // Wait for auth to process
              await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
              console.error('Error restoring session:', error);
            }
          }
        }
        
        // Process the checkout success
        handleCheckoutSuccess(sessionId);
        setProcessingComplete(true);
        
        // After processing, automatically refresh data
        setTimeout(async () => {
          await refetchCredits();
        }, 1500);
      } else if (!sessionId && !isLoading) {
        // If no session ID, redirect back to credits page after a short delay
        const timer = setTimeout(() => {
          navigate('/dashboard/freelancer/credits');
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    };
    
    processCheckout();
  }, [sessionId, handleCheckoutSuccess, navigate, user, isLoading, processingComplete, refetchCredits]);
  
  // Effect to automatically try refreshing data if credit balance is 0
  useEffect(() => {
    if (processingComplete && creditBalance === 0 && retryCount < 3 && !isRefreshing) {
      const timer = setTimeout(async () => {
        console.log(`Auto-refreshing credit data (attempt ${retryCount + 1})`);
        setIsRefreshing(true);
        await refetchCredits();
        setIsRefreshing(false);
        setRetryCount(prev => prev + 1);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [processingComplete, creditBalance, retryCount, isRefreshing, refetchCredits]);
  
  // Manual refresh function for users to force refresh credit balance
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refetchCredits();
    setTimeout(() => setIsRefreshing(false), 1000);
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
                <p className="text-sm text-gray-500">If your credits don't appear, please click the refresh button below.</p>
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
                className="w-full"
                variant="secondary"
              >
                View My Credits
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
