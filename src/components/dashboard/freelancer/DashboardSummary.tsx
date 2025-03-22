
import React from 'react';
import CreditBalanceCard from '@/components/dashboard/freelancer/credits/CreditBalanceCard';

interface DashboardSummaryProps {
  creditBalance: number | null;
  isLoadingBalance: boolean;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ 
  creditBalance, 
  isLoadingBalance 
}) => {
  return (
    <div className="mb-8">
      <CreditBalanceCard 
        creditBalance={creditBalance} 
        isLoading={isLoadingBalance} 
      />
    </div>
  );
};

export default DashboardSummary;
