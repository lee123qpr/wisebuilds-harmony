
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
  
  // Log which settings we're using
  useEffect(() => {
    console.log('UseProjectsWithFiltering using settings:', settingsToUse);
  }, [settingsToUse]);
  
  const { projectLeads, isLoading: isLeadsLoading } = useProjectLeadsGenerator(settingsToUse);
  
  const [filteredLeads, setFilteredLeads] = useState<ProjectLead[]>([]);
  
  useEffect(() => {
    console.log('Project leads updated in useProjectsWithFiltering:', projectLeads);
    console.log('Number of leads received:', projectLeads.length);
    
    if (useFiltering) {
      // For My Leads tab with filtering enabled, ensure we only show active projects
      // that are neither hired nor completed
      const activeLeads = projectLeads.filter(project => {
        const isActive = project.status === 'active';
        const isAvailable = project.hiring_status === 'enquiring' || project.hiring_status === 'hiring';
        const result = isActive && isAvailable;
        
        if (!result) {
          console.log(`Filtering out project ${project.id}: status=${project.status}, hiring_status=${project.hiring_status}`);
        }
        
        return result;
      });
      
      console.log('Filtered leads for My Leads tab:', activeLeads.length);
      setFilteredLeads(activeLeads);
    } else {
      // For Available Projects tab, show all active projects regardless of hiring status
      const allActiveLeads = projectLeads.filter(project => project.status === 'active');
      console.log('All active leads for Available Projects tab:', allActiveLeads.length);
      setFilteredLeads(allActiveLeads);
    }
  }, [projectLeads, useFiltering]);
  
  const refreshProjects = async () => {
    console.log('Refreshing projects...');
    try {
      // Force a refresh of lead settings if available
      await queryClient.invalidateQueries({ queryKey: ['leadSettings'] });
      
      // Force a new fetch of project leads
      toast({
        title: "Refreshing projects",
        description: "Looking for new projects...",
      });
      
      // Force reloading the window to ensure a clean refresh
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
