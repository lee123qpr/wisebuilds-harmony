import { useState, useEffect } from 'react';
import { useLeadSettingsData } from '@/hooks/freelancer/useLeadSettingsData';
import { useProjectLeadsGenerator } from '@/hooks/freelancer/useProjectLeadsGenerator';
import { ProjectLead } from '@/types/projects';
import { LeadSettings } from '@/hooks/freelancer/types';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export const useProjectsWithFiltering = (useFiltering = true, customLeadSettings?: LeadSettings | null) => {
  const { leadSettings, isLoading: isSettingsLoading } = useLeadSettingsData();
  const queryClient = useQueryClient();
  
  // If useFiltering is false, pass null to useProjectLeadsGenerator to fetch all projects
  // Otherwise use customLeadSettings if provided, or fallback to leadSettings from hook
  const settingsToUse = useFiltering ? (customLeadSettings || leadSettings) : null;
  
  const { projectLeads, isLoading: isLeadsLoading } = useProjectLeadsGenerator(settingsToUse);
  
  const [filteredLeads, setFilteredLeads] = useState<ProjectLead[]>([]);
  
  useEffect(() => {
    console.log('Project leads updated:', projectLeads);
    setFilteredLeads(projectLeads);
  }, [projectLeads]);
  
  const refreshProjects = async () => {
    console.log('Refreshing projects...');
    try {
      // Force a refresh of lead settings if available
      queryClient.invalidateQueries({ queryKey: ['leadSettings'] });
      
      // Force a new fetch of project leads
      toast({
        title: "Refreshing projects",
        description: "Looking for new projects...",
      });
      
      // Since useProjectLeadsGenerator doesn't have a refresh function,
      // we're reloading the window for now, but in a production app
      // you'd want to implement a better refresh mechanism
      window.location.reload();
      
      return true;
    } catch (error) {
      console.error('Error refreshing projects:', error);
      toast({
        variant: 'destructive',
        title: "Error refreshing",
        description: "There was a problem refreshing the projects. Please try again.",
      });
      return false;
    }
  };
  
  return {
    projectLeads: filteredLeads,
    isLoading: isSettingsLoading || isLeadsLoading,
    refreshProjects
  };
};
