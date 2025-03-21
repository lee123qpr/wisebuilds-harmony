
import { useState } from 'react';
import { useProjectsWithFiltering } from '@/hooks/projects/useProjectsWithFiltering';
import { LeadSettings } from '@/hooks/freelancer/types';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export const useLeadProjects = (
  isLoadingSettings: boolean,
  leadSettings: LeadSettings | null
) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Use our hook with filtering enabled (true) based on leadSettings
  const { 
    projectLeads: filteredProjects, 
    isLoading: isLoadingLeads, 
    refreshProjects 
  } = useProjectsWithFiltering(true, leadSettings);
  
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Find the selected project
  const selectedProject = selectedProjectId 
    ? filteredProjects.find(project => project.id === selectedProjectId)
    : filteredProjects.length > 0 ? filteredProjects[0] : null;

  // Handle refresh - improved to use the refreshProjects function
  const handleRefresh = async () => {
    console.log('Refreshing leads...');
    setIsRefreshing(true);
    
    toast({
      title: "Refreshing leads",
      description: "Looking for new matching leads...",
    });
    
    try {
      // Use the refreshProjects function from useProjectsWithFiltering
      await refreshProjects();
      
      // Force a refresh of the lead settings as well
      await queryClient.invalidateQueries({ queryKey: ['leadSettings'] });
      
      // Sometimes we need a full page refresh to get updated data
      if (filteredProjects.length === 0) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error refreshing leads:', error);
      toast({
        variant: 'destructive',
        title: "Error refreshing leads",
        description: "There was a problem refreshing your leads. Please try again.",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    filteredProjects,
    isLoadingLeads,
    isRefreshing,
    selectedProjectId,
    setSelectedProjectId,
    selectedProject,
    handleRefresh
  };
};
