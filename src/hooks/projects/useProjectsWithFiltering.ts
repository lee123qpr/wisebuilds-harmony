
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
    
    if (useFiltering && settingsToUse) {
      // Apply additional filtering based on lead settings
      const filterLeadsBySettings = (leads: ProjectLead[]) => {
        return leads.filter(project => {
          // First check if project is active and available for hiring
          const isActive = project.status === 'active';
          const isAvailable = project.hiring_status === 'enquiring' || project.hiring_status === 'hiring' || 
                             project.hiring_status === 'ready' || project.hiring_status === 'urgent';
          
          if (!isActive || !isAvailable) {
            console.log(`Filtering out project ${project.id}: status=${project.status}, hiring_status=${project.hiring_status}`);
            return false;
          }
          
          // Match by role - more flexible matching
          const roleMatches = 
            !settingsToUse.role || 
            settingsToUse.role === 'any' || 
            settingsToUse.role === 'Any' ||
            // Compare normalized strings (lowercase, trim whitespace)
            project.role.toLowerCase().trim() === settingsToUse.role.toLowerCase().trim() ||
            // Also check if role contains the search term or vice versa
            project.role.toLowerCase().includes(settingsToUse.role.toLowerCase()) ||
            settingsToUse.role.toLowerCase().includes(project.role.toLowerCase());
          
          // Match by location - more flexible matching
          const locationMatches = 
            !settingsToUse.location || 
            settingsToUse.location === 'any' || 
            settingsToUse.location === 'Any' || 
            (project.location && settingsToUse.location && (
              // Compare city part only (before comma)
              project.location.toLowerCase().includes(settingsToUse.location.toLowerCase().split(',')[0].trim()) || 
              settingsToUse.location.toLowerCase().split(',')[0].trim().includes(project.location.toLowerCase())
            ));
          
          // Match by work type
          const workTypeMatches = 
            !settingsToUse.work_type || 
            settingsToUse.work_type === 'any' ||
            settingsToUse.work_type === 'Any' ||
            project.work_type === settingsToUse.work_type;
          
          // Match by budget if specified
          const budgetMatches = 
            !settingsToUse.budget || 
            settingsToUse.budget === 'any' ||
            settingsToUse.budget === 'Any';
            
          // Match by duration if specified
          const durationMatches = 
            !settingsToUse.duration || 
            settingsToUse.duration === 'any' ||
            settingsToUse.duration === 'Any' ||
            project.duration === settingsToUse.duration;
            
          // Match by hiring status if specified
          const hiringStatusMatches = 
            !settingsToUse.hiring_status || 
            settingsToUse.hiring_status === 'any' ||
            settingsToUse.hiring_status === 'Any' ||
            project.hiring_status === settingsToUse.hiring_status;
          
          // Match by insurance requirements
          const insuranceMatches = 
            settingsToUse.requires_insurance === undefined ||
            settingsToUse.requires_insurance === null ||
            !settingsToUse.requires_insurance || 
            settingsToUse.requires_insurance === project.requires_insurance;
          
          // Match by site visit requirements
          const siteVisitsMatches = 
            settingsToUse.requires_site_visits === undefined ||
            settingsToUse.requires_site_visits === null ||
            !settingsToUse.requires_site_visits || 
            settingsToUse.requires_site_visits === project.requires_site_visits;
          
          // Log the matching results for debugging
          const result = roleMatches && locationMatches && workTypeMatches && budgetMatches &&
                         durationMatches && hiringStatusMatches && insuranceMatches && siteVisitsMatches;
          
          console.log(`Project ${project.id} matching:`, {
            role: `${project.role} vs ${settingsToUse.role}`,
            roleMatches,
            location: `${project.location} vs ${settingsToUse.location}`,
            locationMatches,
            workType: `${project.work_type} vs ${settingsToUse.work_type}`,
            workTypeMatches,
            budget: `${project.budget} vs ${settingsToUse.budget}`,
            budgetMatches,
            duration: `${project.duration} vs ${settingsToUse.duration}`,
            durationMatches,
            hiringStatus: `${project.hiring_status} vs ${settingsToUse.hiring_status}`,
            hiringStatusMatches,
            insurance: `${project.requires_insurance} vs ${settingsToUse.requires_insurance}`,
            insuranceMatches,
            siteVisits: `${project.requires_site_visits} vs ${settingsToUse.requires_site_visits}`,
            siteVisitsMatches,
            result
          });
          
          return result;
        });
      };
      
      const filteredResults = filterLeadsBySettings(projectLeads);
      console.log('Filtered leads for My Leads tab:', filteredResults.length);
      setFilteredLeads(filteredResults);
    } else {
      // For Available Projects tab, show all active projects regardless of hiring status
      const allActiveLeads = projectLeads.filter(project => project.status === 'active');
      console.log('All active leads for Available Projects tab:', allActiveLeads.length);
      setFilteredLeads(allActiveLeads);
    }
  }, [projectLeads, useFiltering, settingsToUse]);
  
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
