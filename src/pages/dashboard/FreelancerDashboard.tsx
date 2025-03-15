import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import DashboardHeader from '@/components/dashboard/freelancer/DashboardHeader';
import FreelancerTabs from '@/pages/dashboard/freelancer/FreelancerTabs';
import CreditBalanceCard from '@/components/dashboard/freelancer/credits/CreditBalanceCard';
import { useCredits } from '@/hooks/useCredits';
import { ProjectLead } from '@/types/projects';

interface LeadSettings {
  id: string;
  role: string;
  location: string;
  work_type?: string;
  max_budget?: string;
  notifications_enabled: boolean;
  keywords?: string[];
}

const FreelancerDashboard = () => {
  const { user } = useAuth();
  const [projectLeads, setProjectLeads] = useState<ProjectLead[]>([]);
  const { creditBalance, isLoadingBalance } = useCredits();
  
  const fullName = user?.user_metadata?.full_name || 'Freelancer';

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

  useEffect(() => {
    if (leadSettings) {
      console.log('Generating leads based on settings:', leadSettings);
      
      const allLeads: ProjectLead[] = [
        {
          id: '1',
          title: `${leadSettings.role} needed in ${leadSettings.location}`,
          description: `Looking for an experienced professional to handle a project in ${leadSettings.location}.`,
          budget: leadSettings.max_budget || '£2,000-£3,500',
          role: leadSettings.role,
          created_at: new Date().toISOString(),
          location: leadSettings.location,
          work_type: leadSettings.work_type || 'on_site',
          tags: leadSettings.keywords || ['Professional', 'Experienced'],
          duration: '2_weeks',
          hiring_status: 'active',
          requires_equipment: false,
          requires_security_check: false,
          requires_insurance: true,
          requires_qualifications: true,
          published: true,
          client_id: 'client123',
          client_name: 'John Smith',
          client_company: 'Smith Enterprises',
          start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          applications: 0,
          documents: [],
          requires_site_visits: false,
          status: 'active',
          updated_at: new Date().toISOString(),
          user_id: 'client123'
        },
        {
          id: '2',
          title: `Urgent ${leadSettings.role} project`,
          description: 'Client looking for immediate start on a high-priority project.',
          budget: '£3,000-£5,000',
          role: leadSettings.role,
          created_at: new Date().toISOString(),
          location: leadSettings.location,
          work_type: leadSettings.work_type || 'on_site',
          tags: ['Urgent', 'High-Priority'],
          duration: '1_week',
          hiring_status: 'urgent',
          requires_equipment: true,
          requires_security_check: true,
          requires_insurance: true,
          requires_qualifications: false,
          published: true,
          client_id: 'client456',
          client_name: 'Alice Johnson',
          client_company: 'Johnson & Co',
          start_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          applications: 2,
          documents: [],
          requires_site_visits: true,
          status: 'active',
          updated_at: new Date().toISOString(),
          user_id: 'client456'
        },
        {
          id: '3',
          title: 'Website Developer needed',
          description: 'Looking for a web developer to create a new e-commerce site.',
          budget: '£1,500-£3,000',
          role: 'web_developer',
          created_at: new Date().toISOString(),
          location: leadSettings.location,
          tags: ['Web', 'E-commerce'],
          duration: '4_weeks',
          work_type: 'remote',
          hiring_status: 'active',
          requires_equipment: false,
          requires_security_check: false,
          requires_insurance: false,
          requires_qualifications: true,
          published: true,
          client_id: 'client789',
          client_name: 'Robert Brown',
          client_company: 'Brown Digital',
          start_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          applications: 5,
          documents: [],
          requires_site_visits: false,
          status: 'active',
          updated_at: new Date().toISOString(),
          user_id: 'client789'
        },
        {
          id: '4',
          title: `${leadSettings.role} project in Birmingham`,
          description: 'Major renovation project requiring an experienced professional.',
          budget: '£5,000-£10,000',
          role: leadSettings.role,
          created_at: new Date().toISOString(),
          location: 'Birmingham',
          tags: ['Renovation', 'Large-Scale'],
          duration: '6_weeks_plus',
          work_type: 'on_site',
          hiring_status: 'active',
          requires_equipment: true,
          requires_security_check: true,
          requires_insurance: true,
          requires_qualifications: true,
          published: true,
          client_id: 'client101',
          client_name: 'Emma Wilson',
          client_company: 'Wilson Projects',
          start_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
          applications: 3,
          documents: [],
          requires_site_visits: true,
          status: 'active',
          updated_at: new Date().toISOString(),
          user_id: 'client101'
        },
        {
          id: '5',
          title: `Remote ${leadSettings.role} opportunity`,
          description: 'Virtual project that can be completed entirely remotely.',
          budget: '£2,000-£4,000',
          role: leadSettings.role,
          created_at: new Date().toISOString(),
          location: leadSettings.location,
          work_type: leadSettings.work_type === 'remote' ? 'on_site' : 'remote',
          tags: ['Remote', 'Virtual'],
          duration: '3_weeks',
          hiring_status: 'active',
          requires_equipment: false,
          requires_security_check: false,
          requires_insurance: false,
          requires_qualifications: false,
          published: true,
          client_id: 'client202',
          client_name: 'David Green',
          client_company: 'Green Solutions',
          start_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          applications: 1,
          documents: [],
          requires_site_visits: false,
          status: 'active',
          updated_at: new Date().toISOString(),
          user_id: 'client202'
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
