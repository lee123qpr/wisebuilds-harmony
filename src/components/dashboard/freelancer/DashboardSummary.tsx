
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
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
      <div className="md:col-span-1">
        <CreditBalanceCard 
          creditBalance={creditBalance} 
          isLoading={isLoadingBalance} 
        />
      </div>
      {/* Additional summary cards can be added here in the future */}
    </div>
  );
};

export default DashboardSummary;
