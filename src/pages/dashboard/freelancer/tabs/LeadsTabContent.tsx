
import React from 'react';
import LeadsTab from '@/components/dashboard/freelancer/LeadsTab';
import { ProjectLead } from '@/types/projects';
import { LeadSettings } from '@/hooks/useFreelancerDashboard';

interface LeadsTabContentProps {
  isLoadingSettings: boolean;
  isLoadingLeads?: boolean;
  leadSettings: LeadSettings | null;
  projectLeads: ProjectLead[];
}

const LeadsTabContent: React.FC<LeadsTabContentProps> = ({ 
  isLoadingSettings, 
  isLoadingLeads,
  leadSettings, 
  projectLeads 
}) => {
  return (
    <LeadsTab 
      isLoadingSettings={isLoadingSettings}
      isLoadingLeads={isLoadingLeads}
      leadSettings={leadSettings} 
      projectLeads={projectLeads} 
    />
  );
};

export default LeadsTabContent;
