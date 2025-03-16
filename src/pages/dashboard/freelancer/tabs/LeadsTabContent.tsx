
import React from 'react';
import { useProjectsWithFiltering } from '@/hooks/projects/useProjectsWithFiltering';
import { LeadSettings } from '@/hooks/freelancer/types';
import ProjectListView from '@/components/dashboard/freelancer/ProjectListView';
import LeadSettingsAlert from '@/components/dashboard/freelancer/leads/LeadSettingsAlert';
import LeadsHeader from '@/components/dashboard/freelancer/leads/LeadsHeader';
import { useState, useEffect } from 'react';
import EmptyLeadsMessage from '@/components/dashboard/freelancer/leads/EmptyLeadsMessage';
import { ProjectLead } from '@/types/projects';

interface LeadsTabContentProps {
  isLoadingSettings: boolean;
  leadSettings: LeadSettings | null;
}

const LeadsTabContent: React.FC<LeadsTabContentProps> = ({ 
  isLoadingSettings, 
  leadSettings 
}) => {
  // Use our new hook with filtering enabled (true) based on leadSettings
  const { projectLeads: filteredProjects, isLoading: isLoadingLeads } = useProjectsWithFiltering(true, leadSettings);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
  // Find the selected project
  const selectedProject = selectedProjectId 
    ? filteredProjects.find(project => project.id === selectedProjectId)
    : filteredProjects.length > 0 ? filteredProjects[0] : null;
  
  // Set the first project as selected by default when projects load
  useEffect(() => {
    if (filteredProjects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(filteredProjects[0].id);
    }
  }, [filteredProjects, selectedProjectId]);

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
      
      {filteredProjects.length === 0 && !isLoadingLeads ? (
        <EmptyLeadsMessage />
      ) : (
        <ProjectListView 
          projects={filteredProjects as any}
          isLoading={isLoadingLeads}
          selectedProjectId={selectedProjectId}
          setSelectedProjectId={setSelectedProjectId}
          selectedProject={selectedProject as any}
        />
      )}
    </div>
  );
};

export default LeadsTabContent;
