
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
      // Apply filtering based on lead settings
      const filterLeadsBySettings = (leads: ProjectLead[]) => {
        return leads.filter(project => {
          // First check if project is active and available for hiring
          const isActive = project.status === 'active';
          const isAvailable = project.hiring_status === 'enquiring' || 
                             project.hiring_status === 'hiring' || 
                             project.hiring_status === 'ready' || 
                             project.hiring_status === 'urgent';
          
          if (!isActive || !isAvailable) {
            console.log(`Filtering out project ${project.id}: status=${project.status}, hiring_status=${project.hiring_status}`);
            return false;
          }
          
          // IMPROVED ROLE MATCHING
          // Check if role is 'any' or if project role matches settings role (case insensitive)
          const roleMatches = 
            !settingsToUse.role || 
            settingsToUse.role === 'any' || 
            settingsToUse.role === 'Any' ||
            // Try exact match first (case insensitive)
            project.role.toLowerCase() === settingsToUse.role.toLowerCase() ||
            // Try partial matches
            project.role.toLowerCase().includes(settingsToUse.role.toLowerCase()) ||
            settingsToUse.role.toLowerCase().includes(project.role.toLowerCase());
          
          // IMPROVED LOCATION MATCHING
          // Check if location is 'any' or if project location contains settings location (case insensitive)
          const locationMatches = 
            !settingsToUse.location || 
            settingsToUse.location === 'any' || 
            settingsToUse.location === 'Any' || 
            // Handle null locations safely
            (project.location && settingsToUse.location && (
              project.location.toLowerCase().includes(settingsToUse.location.toLowerCase()) ||
              settingsToUse.location.toLowerCase().includes(project.location.toLowerCase())
            ));
          
          // IMPROVED WORK TYPE MATCHING
          // Check if work_type is 'any' or if project work_type matches settings work_type (exact match)
          const workTypeMatches = 
            !settingsToUse.work_type || 
            settingsToUse.work_type === 'any' ||
            settingsToUse.work_type === 'Any' ||
            project.work_type === settingsToUse.work_type;
          
          // IMPROVED BUDGET MATCHING
          // Check if budget is 'any' or if project budget matches settings budget
          const budgetMatches = 
            !settingsToUse.budget || 
            settingsToUse.budget === 'any' ||
            settingsToUse.budget === 'Any';
          
          // IMPROVED DURATION MATCHING
          // Check if duration is 'any' or if project duration matches settings duration
          const durationMatches = 
            !settingsToUse.duration || 
            settingsToUse.duration === 'any' ||
            settingsToUse.duration === 'Any' ||
            project.duration === settingsToUse.duration;
          
          // IMPROVED HIRING STATUS MATCHING
          // Check if hiring_status is 'any' or if project hiring_status matches settings hiring_status
          const hiringStatusMatches = 
            !settingsToUse.hiring_status || 
            settingsToUse.hiring_status === 'any' ||
            settingsToUse.hiring_status === 'Any' ||
            project.hiring_status === settingsToUse.hiring_status;
          
          // IMPROVED INSURANCE MATCHING
          // Check if requires_insurance is not set or if project requires_insurance matches settings requires_insurance
          const insuranceMatches = 
            settingsToUse.requires_insurance === undefined ||
            settingsToUse.requires_insurance === null ||
            !settingsToUse.requires_insurance || 
            settingsToUse.requires_insurance === project.requires_insurance;
          
          // IMPROVED SITE VISITS MATCHING
          // Check if requires_site_visits is not set or if project requires_site_visits matches settings requires_site_visits
          const siteVisitsMatches = 
            settingsToUse.requires_site_visits === undefined ||
            settingsToUse.requires_site_visits === null ||
            !settingsToUse.requires_site_visits || 
            settingsToUse.requires_site_visits === project.requires_site_visits;
          
          // Debug the matching results
          const result = roleMatches && locationMatches && workTypeMatches && budgetMatches &&
                         durationMatches && hiringStatusMatches && insuranceMatches && siteVisitsMatches;
          
          console.log(`Project ${project.id} matching:`, {
            project_role: project.role,
            settings_role: settingsToUse.role,
            roleMatches,
            project_location: project.location,
            settings_location: settingsToUse.location,
            locationMatches,
            project_work_type: project.work_type,
            settings_work_type: settingsToUse.work_type,
            workTypeMatches,
            project_budget: project.budget,
            settings_budget: settingsToUse.budget,
            budgetMatches,
            project_duration: project.duration,
            settings_duration: settingsToUse.duration,
            durationMatches,
            project_hiring_status: project.hiring_status,
            settings_hiring_status: settingsToUse.hiring_status,
            hiringStatusMatches,
            project_requires_insurance: project.requires_insurance,
            settings_requires_insurance: settingsToUse.requires_insurance,
            insuranceMatches,
            project_requires_site_visits: project.requires_site_visits,
            settings_requires_site_visits: settingsToUse.requires_site_visits,
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
      
      // Force a new fetch of project leads - use queryClient.invalidateQueries
      // instead of window.location.reload()
      await queryClient.invalidateQueries({ queryKey: ['projectLeads'] });
      
      toast({
        title: "Refreshing projects",
        description: "Looking for new projects...",
      });
      
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
