
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import DashboardHeader from '@/components/dashboard/freelancer/DashboardHeader';
import FreelancerTabs from '@/pages/dashboard/freelancer/FreelancerTabs';
import CreditBalanceCard from '@/components/dashboard/freelancer/credits/CreditBalanceCard';
import { useCredits } from '@/hooks/useCredits';

interface LeadSettings {
  id: string;
  role: string;
  location: string;
  work_type?: string;
  max_budget?: string;
  notifications_enabled: boolean;
  keywords?: string[];
}

interface ProjectLead {
  id: string;
  title: string;
  description: string;
  budget: string;
  role: string;
  created_at: string;
  location: string;
  work_type?: string;
  tags?: string[];
}

const FreelancerDashboard = () => {
  const { user } = useAuth();
  const [projectLeads, setProjectLeads] = useState<ProjectLead[]>([]);
  const { creditBalance, isLoadingBalance } = useCredits();
  
  // Extract user information
  const fullName = user?.user_metadata?.full_name || 'Freelancer';

  // Fetch lead settings from database
  const { data: leadSettings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['leadSettings', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('lead_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching lead settings:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!user
  });

  // Generate sample project leads based on the settings
  useEffect(() => {
    if (leadSettings) {
      console.log('Generating leads based on settings:', leadSettings);
      
      // Create sample project leads
      const allLeads: ProjectLead[] = [
        // Matching leads based on settings
        {
          id: '1',
          title: `${leadSettings.role} needed in ${leadSettings.location}`,
          description: `Looking for an experienced professional to handle a project in ${leadSettings.location}.`,
          budget: leadSettings.max_budget || '£2,000-£3,500',
          role: leadSettings.role,
          created_at: new Date().toISOString(),
          location: leadSettings.location,
          work_type: leadSettings.work_type,
          tags: leadSettings.keywords || ['Professional', 'Experienced']
        },
        {
          id: '2',
          title: `Urgent ${leadSettings.role} project`,
          description: 'Client looking for immediate start on a high-priority project.',
          budget: '£3,000-£5,000',
          role: leadSettings.role,
          created_at: new Date().toISOString(),
          location: leadSettings.location,
          work_type: leadSettings.work_type,
          tags: ['Urgent', 'High-Priority']
        },
        // Non-matching leads by role
        {
          id: '3',
          title: 'Website Developer needed',
          description: 'Looking for a web developer to create a new e-commerce site.',
          budget: '£1,500-£3,000',
          role: 'web_developer',
          created_at: new Date().toISOString(),
          location: leadSettings.location,
          tags: ['Web', 'E-commerce']
        },
        // Non-matching leads by location
        {
          id: '4',
          title: `${leadSettings.role} project in Birmingham`,
          description: 'Major renovation project requiring an experienced professional.',
          budget: '£5,000-£10,000',
          role: leadSettings.role,
          created_at: new Date().toISOString(),
          location: 'Birmingham',
          tags: ['Renovation', 'Large-Scale']
        },
        // Non-matching work type
        {
          id: '5',
          title: `Remote ${leadSettings.role} opportunity`,
          description: 'Virtual project that can be completed entirely remotely.',
          budget: '£2,000-£4,000',
          role: leadSettings.role,
          created_at: new Date().toISOString(),
          location: leadSettings.location,
          work_type: leadSettings.work_type === 'remote' ? 'on_site' : 'remote',
          tags: ['Remote', 'Virtual']
        }
      ];
      
      setProjectLeads(allLeads);
    }
  }, [leadSettings]);

  return (
    <MainLayout>
      <div className="container py-8">
        <DashboardHeader 
          fullName={fullName} 
          hasLeadSettings={!!leadSettings} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-1">
            <CreditBalanceCard 
              creditBalance={creditBalance} 
              isLoading={isLoadingBalance} 
            />
          </div>
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
