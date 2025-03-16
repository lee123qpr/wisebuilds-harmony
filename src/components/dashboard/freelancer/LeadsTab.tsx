
import React from 'react';
import { ProjectLead } from '@/types/projects';
import LeadSettingsAlert from './leads/LeadSettingsAlert';
import { useLeadFiltering } from './leads/useLeadFiltering';
import { LeadSettings } from '@/hooks/useFreelancerDashboard';
import EmptyLeadsMessage from './leads/EmptyLeadsMessage';
import LeadsHeader from './leads/LeadsHeader';
import { Skeleton } from '@/components/ui/skeleton';
import ProjectListView from './ProjectListView';

interface LeadsTabProps {
  isLoadingSettings: boolean;
  isLoadingLeads?: boolean;
  leadSettings: LeadSettings | null;
  projectLeads: ProjectLead[];
}

const LeadsTab: React.FC<LeadsTabProps> = ({ 
  isLoadingSettings, 
  isLoadingLeads = false,
  leadSettings, 
  projectLeads 
}) => {
  // Use our custom hook for lead filtering
  const { 
    filteredLeads
  } = useLeadFiltering(leadSettings, projectLeads);
  
  const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(
    filteredLeads.length > 0 ? filteredLeads[0].id : null
  );

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

export default LeadsTab;
