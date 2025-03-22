
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
    console.log('Project leads updated:', projectLeads);
    console.log('Number of leads received:', projectLeads.length);
    
    if (useFiltering) {
      // Filter out completed and hired projects only when filtering is enabled
      const activeLeads = projectLeads.filter(project => {
        // Filter out projects that are completed or already hired for
        const isActive = project.status === 'active';
        const isNotHired = project.hiring_status !== 'hired' && project.hiring_status !== 'completed';
        return isActive && isNotHired;
      });
      
      setFilteredLeads(activeLeads);
    } else {
      // When not filtering, show all active projects regardless of hiring status
      const allActiveLeads = projectLeads.filter(project => project.status === 'active');
      setFilteredLeads(allActiveLeads);
    }
  }, [projectLeads, useFiltering]);
  
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
