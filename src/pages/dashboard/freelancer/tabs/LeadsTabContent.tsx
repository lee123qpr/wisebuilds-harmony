
import React, { useState } from 'react';
import { ProjectLead } from '@/types/projects';
import { LeadSettings } from '@/hooks/useFreelancerDashboard';
import LeadSettingsAlert from '@/components/dashboard/freelancer/leads/LeadSettingsAlert';
import LeadsHeader from '@/components/dashboard/freelancer/leads/LeadsHeader';
import EmptyLeadsMessage from '@/components/dashboard/freelancer/leads/EmptyLeadsMessage';
import ProjectListView from '@/components/dashboard/freelancer/ProjectListView';
import { useLeadFiltering } from '@/components/dashboard/freelancer/leads/useLeadFiltering';

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
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    projectLeads.length > 0 ? projectLeads[0].id : null
  );

  // Use our custom hook for lead filtering
  const { filteredLeads } = useLeadFiltering(leadSettings, projectLeads);
  
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
    <div className="space-y-4">
      <LeadsHeader onRefresh={handleRefresh} isLoading={isLoadingSettings || isLoadingLeads} />
      
      {isLoadingLeads ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      ) : filteredLeads.length === 0 ? (
        <EmptyLeadsMessage />
      ) : (
        <ProjectListView
          projects={filteredLeads as any} // Fixed: Use type assertion for now
          isLoading={isLoadingLeads || false}
          selectedProjectId={selectedProjectId}
          setSelectedProjectId={setSelectedProjectId}
          selectedProject={selectedProject as any} // Fixed: Use type assertion for now
          showContactInfo={true}
        />
      )}
    </div>
  );
};

export default LeadsTabContent;
