
import { useState, useEffect, useCallback } from 'react';
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
  
  const { projectLeads, isLoading: isLeadsLoading, refetch: refetchLeads } = useProjectLeadsGenerator(settingsToUse);
  
  const [filteredLeads, setFilteredLeads] = useState<ProjectLead[]>([]);
  
  useEffect(() => {
    console.log('Project leads updated:', projectLeads);
    console.log('Number of leads received:', projectLeads.length);
    
    // Sort leads by newest first (latest created_at date)
    const sortedLeads = [...projectLeads].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    setFilteredLeads(sortedLeads);
    
    // Update the leads cache when we get new data
    queryClient.setQueryData(['leads'], sortedLeads);
  }, [projectLeads, queryClient]);
  
  const refreshProjects = useCallback(async () => {
    console.log('Refreshing projects...');
    try {
      // Force a refresh of lead settings if available
      queryClient.invalidateQueries({ queryKey: ['leadSettings'] });
      
      // Force a new fetch of project leads and cache with the 'leads' key
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      
      toast({
        title: "Refreshing projects",
        description: "Looking for new projects...",
      });
      
      // Explicitly refetch leads using the function from useProjectLeadsGenerator
      if (refetchLeads) {
        await refetchLeads();
      }
      
      // Ensure all queries are refetched from the server
      await queryClient.refetchQueries({ queryKey: ['leads'] });
      
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
  }, [queryClient, refetchLeads]);
  
  return {
    projectLeads: filteredLeads,
    isLoading: isSettingsLoading || isLeadsLoading,
    refreshProjects
  };
};
