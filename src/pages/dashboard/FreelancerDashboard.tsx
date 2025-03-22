
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import DashboardHeader from '@/components/dashboard/freelancer/DashboardHeader';
import FreelancerTabs from '@/pages/dashboard/freelancer/FreelancerTabs';
import DashboardSummary from '@/components/dashboard/freelancer/DashboardSummary';
import { useFreelancerDashboard } from '@/hooks/useFreelancerDashboard';
import { useCredits } from '@/hooks/useCredits';
import { useQueryClient } from '@tanstack/react-query';

const FreelancerDashboard = () => {
  const { user } = useAuth();
  const { leadSettings, isLoadingSettings, refetchLeadSettings } = useFreelancerDashboard();
  const { creditBalance, isLoadingBalance } = useCredits();
  const queryClient = useQueryClient();
  
  const fullName = user?.user_metadata?.full_name || 'Freelancer';

  // Ensure we have fresh data when viewing the dashboard
  useEffect(() => {
    if (user) {
      console.log('Dashboard loaded, refreshing data for user:', user.id);
      
      // Refresh applications data when dashboard loads
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      
      // Explicitly refetch lead settings to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ['leadSettings'] });
      if (refetchLeadSettings) {
        console.log('Refetching lead settings...');
        refetchLeadSettings();
      }
      
      // Also refresh projects data
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  }, [user, queryClient, refetchLeadSettings]);

  console.log('FreelancerDashboard render state:', { 
    hasUser: !!user, 
    leadSettings, 
    isLoadingSettings
  });

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
        />
      </div>
    </MainLayout>
  );
};

export default FreelancerDashboard;
