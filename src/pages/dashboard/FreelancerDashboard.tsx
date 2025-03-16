
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import DashboardHeader from '@/components/dashboard/freelancer/DashboardHeader';
import FreelancerTabs from '@/pages/dashboard/freelancer/FreelancerTabs';
import DashboardSummary from '@/components/dashboard/freelancer/DashboardSummary';
import { useFreelancerDashboard } from '@/hooks/useFreelancerDashboard';
import { useCredits } from '@/hooks/useCredits';

const FreelancerDashboard = () => {
  const { user } = useAuth();
  const { leadSettings, isLoadingSettings, projectLeads } = useFreelancerDashboard();
  const { creditBalance, isLoadingBalance } = useCredits();
  
  const fullName = user?.user_metadata?.full_name || 'Freelancer';

  return (
    <MainLayout>
      <div className="container py-8">
        <DashboardHeader 
          fullName={fullName} 
          hasLeadSettings={!!leadSettings} 
        />
        
        <DashboardSummary 
          creditBalance={creditBalance}
          isLoadingBalance={isLoadingBalance}
        />
        
        <FreelancerTabs 
          isLoadingSettings={isLoadingSettings}
          leadSettings={leadSettings}
          projectLeads={projectLeads}
        />
      </div>
    </MainLayout>
  );
};

export default FreelancerDashboard;
