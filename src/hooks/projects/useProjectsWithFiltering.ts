
import { useState, useEffect } from 'react';
import { useLeadSettingsData } from '@/hooks/freelancer/useLeadSettingsData';
import { useProjectLeadsGenerator } from '@/hooks/freelancer/useProjectLeadsGenerator';
import { ProjectLead } from '@/types/projects';
import { LeadSettings } from '@/hooks/freelancer/types';

export const useProjectsWithFiltering = (useFiltering = true, customLeadSettings?: LeadSettings | null) => {
  const { leadSettings, isLoading: isSettingsLoading } = useLeadSettingsData();
  
  // If useFiltering is false, pass null to useProjectLeadsGenerator to fetch all projects
  const settingsToUse = useFiltering ? (customLeadSettings || leadSettings) : null;
  
  const { projectLeads, isLoading: isLeadsLoading } = useProjectLeadsGenerator(settingsToUse);
  
  const [filteredLeads, setFilteredLeads] = useState<ProjectLead[]>([]);
  
  useEffect(() => {
    console.log('Project leads updated:', projectLeads);
    setFilteredLeads(projectLeads);
  }, [projectLeads]);
  
  const refreshProjects = async () => {
    console.log('Refreshing projects...');
    // Force refetch by reloading the window
    window.location.reload();
  };
  
  return {
    projectLeads: filteredLeads,
    isLoading: isSettingsLoading || isLeadsLoading,
    refreshProjects
  };
};
