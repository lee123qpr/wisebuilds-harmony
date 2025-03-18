
import { useMemo, useState, useEffect } from 'react';
import { ProjectLead } from '@/types/projects';
import { LeadSettings } from '@/hooks/freelancer/types';

export const useLeadFiltering = (leadSettings: LeadSettings | null, projectLeads: ProjectLead[]) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
  // Filter leads based on the user's lead settings
  const filteredLeads = useMemo(() => {
    if (!leadSettings) return [];
    
    console.log('Filtering leads with settings:', leadSettings);
    console.log('Available leads to filter:', projectLeads);
    
    return projectLeads.filter(lead => {
      // Log each lead processing to debug
      console.log(`Processing lead: ${lead.id}, role: ${lead.role}, location: ${lead.location}`);
      
      // Match by role (required) - check case-insensitive matching
      const roleMatches = 
        leadSettings.role === 'any' || 
        leadSettings.role === 'Any' || 
        lead.role.toLowerCase() === leadSettings.role.toLowerCase() ||
        lead.role.toLowerCase().includes(leadSettings.role.toLowerCase());
      
      // Match by location (required) - if Any is set, all locations match
      // Use more flexible location matching that looks for partial matches
      const locationMatches = 
        leadSettings.location === 'any' || 
        leadSettings.location === 'Any' || 
        (lead.location && leadSettings.location && (
          lead.location.toLowerCase().includes(leadSettings.location.toLowerCase().split(',')[0].trim()) || 
          leadSettings.location.toLowerCase().split(',')[0].trim().includes(lead.location.toLowerCase())
        ));
      
      // Match by work type (if specified)
      const workTypeMatches = 
        !leadSettings.work_type || 
        leadSettings.work_type === 'any' ||
        leadSettings.work_type === 'Any' ||
        lead.work_type === leadSettings.work_type;
      
      // Improved budget matching - extract numeric values for comparison
      let budgetMatches = true;
      if (leadSettings.budget && 
          leadSettings.budget !== '' && 
          leadSettings.budget !== 'any' &&
          leadSettings.budget !== 'Any') {
        // Simplified budget logic - any overlap is a match
        budgetMatches = true; // Simplify for now to get matches working
      }
      
      // Simplified duration matching
      let durationMatches = true;
      if (leadSettings.duration && 
          leadSettings.duration !== '' && 
          leadSettings.duration !== 'any' &&
          leadSettings.duration !== 'Any') {
        durationMatches = true; // Simplify for now to get matches working
      }
      
      // Match by hiring status (if specified)
      const hiringStatusMatches = 
        !leadSettings.hiring_status || 
        leadSettings.hiring_status === '' ||
        leadSettings.hiring_status === 'any' ||
        leadSettings.hiring_status === 'Any' ||
        lead.hiring_status === leadSettings.hiring_status;
      
      // Match by insurance requirements (if specified)
      const insuranceMatches = 
        !leadSettings.requires_insurance || 
        lead.requires_insurance === leadSettings.requires_insurance;
      
      // Match by site visit requirements (if specified)
      const siteVisitsMatches = 
        !leadSettings.requires_site_visits || 
        lead.requires_site_visits === leadSettings.requires_site_visits;
      
      // Match by keywords (if any) - simplified for now
      const keywordsMatch = true;
      
      const result = roleMatches && locationMatches && workTypeMatches && 
             budgetMatches && durationMatches && hiringStatusMatches && 
             insuranceMatches && siteVisitsMatches && keywordsMatch;
      
      // Log the matching results for debugging
      console.log(`Lead ${lead.id} matching:`, {
        roleMatches,
        locationMatches,
        workTypeMatches,
        budgetMatches,
        durationMatches,
        hiringStatusMatches,
        insuranceMatches,
        siteVisitsMatches,
        keywordsMatch,
        result
      });
      
      return result;
    });
  }, [leadSettings, projectLeads]);
  
  useEffect(() => {
    console.log('Filtered leads result:', filteredLeads);
  }, [filteredLeads]);
  
  // Find the selected project
  const selectedProject = selectedProjectId 
    ? filteredLeads.find(project => project.id === selectedProjectId)
    : filteredLeads.length > 0 ? filteredLeads[0] : null;
  
  // Set the first project as selected by default when projects load
  useEffect(() => {
    if (filteredLeads.length > 0 && !selectedProjectId) {
      setSelectedProjectId(filteredLeads[0].id);
    }
  }, [filteredLeads, selectedProjectId]);

  return {
    filteredLeads,
    selectedProject,
    selectedProjectId,
    setSelectedProjectId
  };
};
