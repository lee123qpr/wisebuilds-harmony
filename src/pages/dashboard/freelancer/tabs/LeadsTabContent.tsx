
import React, { useEffect } from 'react';
import { LeadSettings } from '@/hooks/freelancer/types';
import ProjectListView from '@/components/dashboard/freelancer/ProjectListView';
import LeadSettingsAlert from '@/components/dashboard/freelancer/leads/LeadSettingsAlert';
import LeadsHeader from '@/components/dashboard/freelancer/leads/LeadsHeader';
import EmptyLeadsMessage from '@/components/dashboard/freelancer/leads/EmptyLeadsMessage';
import { useLeadProjects } from '@/hooks/dashboard/useLeadProjects';

interface LeadsTabContentProps {
  isLoadingSettings: boolean;
  leadSettings: LeadSettings | null;
}

const LeadsTabContent: React.FC<LeadsTabContentProps> = ({ 
  isLoadingSettings, 
  leadSettings 
}) => {
  console.log('LeadsTabContent render:', { isLoadingSettings, leadSettings });
  
  const {
    filteredProjects,
    isLoadingLeads,
    isRefreshing,
    selectedProjectId,
    setSelectedProjectId,
    selectedProject,
    handleRefresh
  } = useLeadProjects(isLoadingSettings, leadSettings);
  
  useEffect(() => {
    console.log('Filtered projects in LeadsTabContent:', filteredProjects.length);
    console.log('Projects data:', filteredProjects);
  }, [filteredProjects]);
  
  // Set the first project as selected by default when projects load
  useEffect(() => {
    if (filteredProjects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(filteredProjects[0].id);
    }
  }, [filteredProjects, selectedProjectId, setSelectedProjectId]);
  
  // If loading or no settings, show alert
  if (isLoadingSettings) {
    console.log('Lead settings still loading');
    return <LeadSettingsAlert isLoading={true} />;
  }
  
  if (!leadSettings) {
    console.log('No lead settings found');
    return <LeadSettingsAlert isLoading={false} />;
  }
  
  return (
    <div className="space-y-4">
      <LeadsHeader 
        onRefresh={handleRefresh} 
        isLoading={isLoadingSettings || isLoadingLeads || isRefreshing}
        location={leadSettings.location}
        leadsCount={filteredProjects.length}
      />
      
      {filteredProjects.length === 0 && !isLoadingLeads && !isRefreshing ? (
        <EmptyLeadsMessage />
      ) : (
        <ProjectListView 
          projects={filteredProjects as any}
          isLoading={isLoadingLeads || isRefreshing}
          selectedProjectId={selectedProjectId}
          setSelectedProjectId={setSelectedProjectId}
          selectedProject={selectedProject as any}
        />
      )}
    </div>
  );
};

export default LeadsTabContent;
