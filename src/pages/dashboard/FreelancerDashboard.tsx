
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import DashboardHeader from '@/components/dashboard/freelancer/DashboardHeader';
import FreelancerTabs from '@/pages/dashboard/freelancer/FreelancerTabs';
import DashboardSummary from '@/components/dashboard/freelancer/DashboardSummary';
import VerificationDialog from '@/components/dashboard/freelancer/VerificationDialog';
import { useFreelancerDashboard } from '@/hooks/useFreelancerDashboard';
import { useCredits } from '@/hooks/useCredits';
import { useVerification } from '@/hooks/verification';
import { useQueryClient } from '@tanstack/react-query';

const FreelancerDashboard = () => {
  const { user } = useAuth();
  const { leadSettings, isLoadingSettings, projectLeads } = useFreelancerDashboard();
  const { creditBalance, isLoadingBalance } = useCredits();
  const { verificationStatus } = useVerification();
  const queryClient = useQueryClient();
  
  const fullName = user?.user_metadata?.full_name || 'Freelancer';

  // Ensure we have fresh data when viewing the dashboard
  useEffect(() => {
    if (user) {
      // Refresh applications data when dashboard loads
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    }
  }, [user, queryClient]);

  return (
    <MainLayout>
      <div className="container py-8">
        <DashboardHeader 
          fullName={fullName} 
          hasLeadSettings={!!leadSettings} 
        />
        
        <div className="flex flex-wrap justify-between items-center mb-6">
          <DashboardSummary 
            creditBalance={creditBalance}
            isLoadingBalance={isLoadingBalance}
          />
          
          {verificationStatus !== 'approved' && <VerificationDialog />}
        </div>
        
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
