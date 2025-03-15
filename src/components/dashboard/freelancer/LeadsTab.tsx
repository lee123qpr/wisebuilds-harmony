
import React from 'react';
import { Project } from '@/components/projects/useProjects';
import { ProjectLead } from '@/types/projects';
import ProjectListView from './ProjectListView';
import LeadSettingsAlert from './leads/LeadSettingsAlert';
import LeadsHeader from './leads/LeadsHeader';
import EmptyLeadsMessage from './leads/EmptyLeadsMessage';
import { useLeadFiltering } from './leads/useLeadFiltering';

interface LeadSettings {
  id: string;
  role: string;
  location: string;
  work_type?: string;
  max_budget?: string;
  notifications_enabled: boolean;
  keywords?: string[];
}

interface LeadsTabProps {
  isLoadingSettings: boolean;
  leadSettings: LeadSettings | null;
  projectLeads: ProjectLead[];
}

const LeadsTab: React.FC<LeadsTabProps> = ({ isLoadingSettings, leadSettings, projectLeads }) => {
  // Handle refresh
  const handleRefresh = () => {
    console.log('Refreshing leads...');
    // This would typically refresh the lead data
    // For now, it just re-filters the existing leads
  };
  
  // Use our custom hook for lead filtering
  const { 
    filteredLeads, 
    selectedProject, 
    selectedProjectId, 
    setSelectedProjectId 
  } = useLeadFiltering(leadSettings, projectLeads);
  
  // If loading or no settings, show alert
  if (isLoadingSettings || !leadSettings) {
    return <LeadSettingsAlert isLoading={isLoadingSettings} />;
  }
  
  return (
    <div className="space-y-4">
      <LeadsHeader 
        onRefresh={handleRefresh} 
        isLoading={isLoadingSettings} 
      />
      
      {filteredLeads.length === 0 ? (
        <EmptyLeadsMessage />
      ) : (
        <ProjectListView 
          projects={filteredLeads as unknown as Project[]}
          isLoading={isLoadingSettings}
          selectedProjectId={selectedProjectId}
          setSelectedProjectId={setSelectedProjectId}
          selectedProject={selectedProject as unknown as Project}
          showContactInfo={true}
        />
      )}
    </div>
  );
};

export default LeadsTab;
