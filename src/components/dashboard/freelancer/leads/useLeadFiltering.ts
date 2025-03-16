
import { useMemo, useState, useEffect } from 'react';
import { ProjectLead } from '@/types/projects';
import { LeadSettings } from '@/hooks/freelancer/types';

export const useLeadFiltering = (leadSettings: LeadSettings | null, projectLeads: ProjectLead[]) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
  // Filter leads based on the user's lead settings
  const filteredLeads = useMemo(() => {
    if (!leadSettings) return [];
    
    return projectLeads.filter(lead => {
      // Match by role (required)
      const roleMatches = lead.role === leadSettings.role;
      
      // Match by location (required) - if Any is set, all locations match
      const locationMatches = 
        leadSettings.location === 'Any' ? true : 
        lead.location === leadSettings.location || 
        lead.location.includes(leadSettings.location) || 
        leadSettings.location.includes(lead.location);
      
      // Match by work type (if specified)
      const workTypeMatches = !leadSettings.work_type || 
                              leadSettings.work_type === 'any' ||
                              lead.work_type === leadSettings.work_type;
      
      // Match by budget (if specified)
      // This is a simplified budget check - assumes budget format is consistent
      const budgetMatches = !leadSettings.budget || leadSettings.budget === '' || 
                            lead.budget.includes(leadSettings.budget);
      
      // Match by duration (if specified)
      const durationMatches = !leadSettings.duration || leadSettings.duration === '' ||
                              lead.duration === leadSettings.duration;
      
      // Match by hiring status (if specified)
      const hiringStatusMatches = !leadSettings.hiring_status || leadSettings.hiring_status === '' ||
                                  lead.hiring_status === leadSettings.hiring_status;
      
      // Match by insurance requirements (if specified)
      const insuranceMatches = !leadSettings.requires_insurance || 
                               lead.requires_insurance === leadSettings.requires_insurance;
      
      // Match by site visit requirements (if specified)
      const siteVisitsMatches = !leadSettings.requires_site_visits || 
                                lead.requires_site_visits === leadSettings.requires_site_visits;
      
      // Match by keywords (if any)
      const keywordsMatch = !leadSettings.keywords || 
                            (typeof leadSettings.keywords === 'string' 
                              ? leadSettings.keywords.length === 0 
                              : leadSettings.keywords.length === 0) || 
                            (lead.tags && lead.tags.some(tag => {
                              if (typeof leadSettings.keywords === 'string') {
                                return tag.toLowerCase().includes(leadSettings.keywords.toLowerCase());
                              } else if (Array.isArray(leadSettings.keywords)) {
                                return leadSettings.keywords.some(keyword => 
                                  tag.toLowerCase().includes(keyword.toLowerCase())
                                );
                              }
                              return false;
                            }));
      
      // Return true if all specified criteria match
      return roleMatches && locationMatches && workTypeMatches && 
             budgetMatches && durationMatches && hiringStatusMatches && 
             insuranceMatches && siteVisitsMatches && keywordsMatch;
    });
  }, [leadSettings, projectLeads]);
  
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
