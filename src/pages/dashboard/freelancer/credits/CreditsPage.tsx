
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useCredits } from '@/hooks/useCredits';
import CreditPlans from './CreditPlans';
import TransactionHistory from './TransactionHistory';
import { ArrowLeft, CreditCard, RefreshCw, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';

const CreditsPage = () => {
  const { 
    creditPlans,
    transactions,
    creditBalance,
    isLoadingPlans,
    isLoadingTransactions,
    isLoadingBalance,
    isCheckoutLoading,
    purchaseCredits,
    refetchCredits
  } = useCredits();
  
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate('/dashboard/freelancer')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Credits</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {!isLoadingBalance && (
              <div className="text-lg font-medium flex items-center gap-2">
                Balance: <span className="font-bold">{creditBalance || 0}</span> credits
              </div>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => refetchCredits()}
              disabled={isLoadingBalance}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingBalance ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Purchase Credits
            </h2>
            <p className="text-gray-500 mb-6">
              Credits are required to apply for projects and contact clients directly. 
              The more credits you buy, the bigger the discount.
            </p>
            
            <CreditPlans 
              plans={creditPlans} 
              onPurchase={purchaseCredits}
              isLoading={isLoadingPlans || isCheckoutLoading}
            />
          </div>
          
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <History className="h-5 w-5" />
              Transaction History
            </h2>
            
            <TransactionHistory 
              transactions={transactions}
              isLoading={isLoadingTransactions}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreditsPage;
