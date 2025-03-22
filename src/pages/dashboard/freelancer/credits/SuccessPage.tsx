
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import CreditBalanceBadge from './components/CreditBalanceBadge';
import TransactionStatusBadge from './components/TransactionStatusBadge';
import ActionButtons from './components/ActionButtons';
import { usePaymentProcessing } from './hooks/usePaymentProcessing';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { 
    creditBalance, 
    isRefreshing, 
    processingComplete,
    isTransactionPending,
    handleManualRefresh
  } = usePaymentProcessing(sessionId);
  
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
              <CreditBalanceBadge creditBalance={creditBalance} />
            ) : (
              <TransactionStatusBadge 
                isTransactionPending={isTransactionPending} 
                sessionId={sessionId} 
              />
            )}
            
            <ActionButtons 
              isRefreshing={isRefreshing}
              handleManualRefresh={handleManualRefresh}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SuccessPage;
