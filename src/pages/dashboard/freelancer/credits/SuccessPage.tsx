
import React, { useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useCredits } from '@/hooks/useCredits';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BackButton from '@/components/common/BackButton';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { handleCheckoutSuccess } = useCredits();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (sessionId) {
      handleCheckoutSuccess(sessionId);
    }
  }, [sessionId, handleCheckoutSuccess]);
  
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
              
              <BackButton 
                to="/dashboard/freelancer"
                variant="outline"
                className="w-full justify-center"
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SuccessPage;
