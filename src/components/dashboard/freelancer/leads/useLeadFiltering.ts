
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
        lead.role.toLowerCase().includes(leadSettings.role.toLowerCase()) ||
        leadSettings.role.toLowerCase().includes(lead.role.toLowerCase());
      
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
      
      // Match by insurance requirements (if specified)
      const insuranceMatches = 
        !leadSettings.requires_insurance || 
        leadSettings.requires_insurance === lead.requires_insurance;
      
      // Match by site visit requirements (if specified)
      const siteVisitsMatches = 
        !leadSettings.requires_site_visits || 
        leadSettings.requires_site_visits === lead.requires_site_visits;
      
      const result = roleMatches && locationMatches && workTypeMatches && 
                    insuranceMatches && siteVisitsMatches;
      
      // Log the matching results for debugging
      console.log(`Lead ${lead.id} matching result:`, {
        roleMatches,
        locationMatches,
        workTypeMatches,
        insuranceMatches,
        siteVisitsMatches,
        result
      });
      
      return result;
    });
  }, [leadSettings, projectLeads]);
  
  useEffect(() => {
    console.log('Filtered leads result:', filteredLeads);
    console.log('Number of filtered leads:', filteredLeads.length);
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
