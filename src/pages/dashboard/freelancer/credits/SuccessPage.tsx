
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useCredits } from '@/hooks/useCredits';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { handleCheckoutSuccess } = useCredits();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [processingComplete, setProcessingComplete] = useState(false);
  
  useEffect(() => {
    // Only process once when we have sessionId and auth is loaded
    if (sessionId && !isLoading && !processingComplete) {
      console.log('Processing checkout success with session ID:', sessionId);
      handleCheckoutSuccess(sessionId);
      setProcessingComplete(true);
    } else if (!sessionId && !isLoading) {
      // If no session ID, redirect back to credits page after a short delay
      const timer = setTimeout(() => {
        navigate('/dashboard/freelancer/credits');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [sessionId, handleCheckoutSuccess, navigate, user, isLoading, processingComplete]);
  
  return (
    <MainLayout>
      <div className="container py-20">
        <div className="max-w-md mx-auto">
          <div className="text-center">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-gray-500 mb-8">
              Your credits have been added to your account. You can now apply for projects and 
              contact clients directly.
            </p>
            
            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => navigate('/dashboard/freelancer/credits')}
                className="w-full"
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
