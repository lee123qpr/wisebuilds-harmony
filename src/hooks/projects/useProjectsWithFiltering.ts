
import { useState, useEffect } from 'react';
import { useLeadSettingsData } from '@/hooks/freelancer/useLeadSettingsData';
import { useProjectLeadsGenerator } from '@/hooks/freelancer/useProjectLeadsGenerator';
import { ProjectLead } from '@/types/projects';

export const useProjectsWithFiltering = (useFiltering = true) => {
  const { leadSettings, isLoading: isSettingsLoading } = useLeadSettingsData();
  const { projectLeads, isLoading: isLeadsLoading } = useProjectLeadsGenerator(
    useFiltering ? leadSettings : null
  );
  
  const [filteredLeads, setFilteredLeads] = useState<ProjectLead[]>([]);
  
  useEffect(() => {
    setFilteredLeads(projectLeads);
  }, [projectLeads]);
  
  const refreshProjects = async () => {
    // Force refetch by reloading the window
    // This is a simple approach; in a production app, you might want to use a more sophisticated approach
    window.location.reload();
  };
  
  return {
    projectLeads: filteredLeads,
    isLoading: isSettingsLoading || isLeadsLoading,
    refreshProjects
  };
};
