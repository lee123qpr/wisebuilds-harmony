
import { useMemo, useState, useEffect } from 'react';
import { ProjectLead } from '@/types/projects';

interface LeadSettings {
  id: string;
  role: string;
  location: string;
  work_type?: string;
  max_budget?: string;
  notifications_enabled: boolean;
  keywords?: string[];
}

export const useLeadFiltering = (leadSettings: LeadSettings | null, projectLeads: ProjectLead[]) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
  // Filter leads based on the user's lead settings
  const filteredLeads = useMemo(() => {
    if (!leadSettings) return [];
    
    return projectLeads.filter(lead => {
      // Match by role (required)
      const roleMatches = lead.role === leadSettings.role;
      
      // Match by location (required)
      const locationMatches = lead.location === leadSettings.location || 
                              lead.location.includes(leadSettings.location) || 
                              leadSettings.location.includes(lead.location);
      
      // Match by work type (if specified)
      const workTypeMatches = !leadSettings.work_type || 
                              lead.work_type === leadSettings.work_type;
      
      // Match by keywords (if any)
      const keywordsMatch = !leadSettings.keywords || 
                            leadSettings.keywords.length === 0 || 
                            (lead.tags && lead.tags.some(tag => 
                              leadSettings.keywords?.some(keyword => 
                                tag.toLowerCase().includes(keyword.toLowerCase())
                              )
                            ));
      
      // Return true if all specified criteria match
      return roleMatches && locationMatches && workTypeMatches && keywordsMatch;
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
