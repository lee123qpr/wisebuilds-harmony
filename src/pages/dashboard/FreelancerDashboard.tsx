
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import DashboardHeader from '@/components/dashboard/freelancer/DashboardHeader';
import FreelancerTabs from '@/pages/dashboard/freelancer/FreelancerTabs';

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
  tags?: string[];
}

const FreelancerDashboard = () => {
  const { user } = useAuth();
  const [projectLeads, setProjectLeads] = useState<ProjectLead[]>([]);
  
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

  // For now, we'll use mock project leads based on the settings
  useEffect(() => {
    if (leadSettings) {
      // Sample project leads matching the settings
      const leads: ProjectLead[] = [
        {
          id: '1',
          title: 'Kitchen Renovation in Manchester',
          description: 'Looking for an experienced contractor to renovate a kitchen in a Victorian home.',
          budget: '£2,000-£3,500',
          role: leadSettings.role,
          created_at: new Date().toISOString(),
          location: leadSettings.location,
          tags: ['Plumbing', 'Tiling', 'Carpentry']
        },
        {
          id: '2',
          title: 'Bathroom Remodel',
          description: 'Complete bathroom renovation needed for a modern apartment.',
          budget: '£3,000-£5,000',
          role: leadSettings.role,
          created_at: new Date().toISOString(),
          location: 'Liverpool',
          tags: ['Plumbing', 'Tiling']
        }
      ];
      
      setProjectLeads(leads);
    }
  }, [leadSettings]);

  return (
    <MainLayout>
      <div className="container py-8">
        <DashboardHeader 
          fullName={fullName} 
          hasLeadSettings={!!leadSettings} 
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
