
import React, { useState } from 'react';
import { ProjectLead } from '@/types/projects';
import { LeadSettings } from '@/hooks/useFreelancerDashboard';
import LeadSettingsAlert from '@/components/dashboard/freelancer/leads/LeadSettingsAlert';
import LeadsHeader from '@/components/dashboard/freelancer/leads/LeadsHeader';
import EmptyLeadsMessage from '@/components/dashboard/freelancer/leads/EmptyLeadsMessage';
import ProjectListView from '@/components/dashboard/freelancer/ProjectListView';
import { useLeadFiltering } from '@/components/dashboard/freelancer/leads/useLeadFiltering';
import { Skeleton } from '@/components/ui/skeleton';

interface LeadsTabContentProps {
  isLoadingSettings: boolean;
  isLoadingLeads?: boolean;
  leadSettings: LeadSettings | null;
  projectLeads: ProjectLead[];
}

const LeadsTabContent: React.FC<LeadsTabContentProps> = ({ 
  isLoadingSettings, 
  isLoadingLeads = false,
  leadSettings, 
  projectLeads 
}) => {
  // Use our custom hook for lead filtering
  const { filteredLeads } = useLeadFiltering(leadSettings, projectLeads);
  
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    filteredLeads.length > 0 ? filteredLeads[0].id : null
  );

  // Find the selected project
  const selectedProject = filteredLeads.find(
    project => project.id === selectedProjectId
  ) || null;

  // Handle refresh
  const handleRefresh = () => {
    console.log('Refreshing leads...');
    window.location.reload(); // Simple refresh for now
  };

  // If loading or no settings, show alert
  if (isLoadingSettings || !leadSettings) {
    return <LeadSettingsAlert isLoading={isLoadingSettings} />;
  }

  return (
    <div className="space-y-0">
      <LeadsHeader onRefresh={handleRefresh} isLoading={isLoadingSettings || isLoadingLeads} />
      
      {isLoadingLeads ? (
        <div className="space-y-4 p-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : filteredLeads.length === 0 ? (
        <EmptyLeadsMessage />
      ) : (
        <ProjectListView
          projects={filteredLeads as any}
          isLoading={isLoadingLeads}
          selectedProjectId={selectedProjectId}
          setSelectedProjectId={setSelectedProjectId}
          selectedProject={selectedProject as any}
          showContactInfo={true}
        />
      )}
    </div>
  );
};

export default LeadsTabContent;
