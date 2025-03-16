
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
      
      // Improved budget matching - extract numeric values for comparison
      let budgetMatches = true;
      if (leadSettings.budget && leadSettings.budget !== '' && leadSettings.budget !== 'any') {
        // Extract budget numbers from settings and lead
        const settingsBudgetMatch = leadSettings.budget.match(/[\d,]+/g);
        const leadBudgetMatch = lead.budget.match(/[\d,]+/g);
        
        if (settingsBudgetMatch && leadBudgetMatch) {
          // Compare budget ranges (simplified - assuming format £X,XXX-£Y,YYY)
          // For budget matching, we'll consider it a match if there's any overlap in the ranges
          const settingsMin = parseInt(settingsBudgetMatch[0].replace(/,/g, ''), 10);
          const settingsMax = settingsBudgetMatch.length > 1 ? 
            parseInt(settingsBudgetMatch[1].replace(/,/g, ''), 10) : settingsMin;
          
          const leadMin = parseInt(leadBudgetMatch[0].replace(/,/g, ''), 10);
          const leadMax = leadBudgetMatch.length > 1 ? 
            parseInt(leadBudgetMatch[1].replace(/,/g, ''), 10) : leadMin;
          
          // If ranges overlap, consider it a match
          budgetMatches = !(leadMax < settingsMin || leadMin > settingsMax);
          
          console.log('Budget comparison:', {
            settingsBudget: leadSettings.budget,
            leadBudget: lead.budget,
            settingsRange: [settingsMin, settingsMax],
            leadRange: [leadMin, leadMax],
            matches: budgetMatches
          });
        }
      }
      
      // Improved duration matching - map duration codes to priorities
      let durationMatches = true;
      if (leadSettings.duration && leadSettings.duration !== '' && leadSettings.duration !== 'any') {
        // Map durations to numeric values for comparison
        const durationPriorities: Record<string, number> = {
          'less_than_1_week': 1,
          '1_week': 2,
          '2_weeks': 3,
          '3_weeks': 4,
          '4_weeks': 5,
          '6_weeks_plus': 6
        };
        
        const leadDurationValue = durationPriorities[lead.duration] || 0;
        const settingsDurationValue = durationPriorities[leadSettings.duration] || 0;
        
        // For now, require the project duration to match or exceed the requested duration
        durationMatches = leadDurationValue >= settingsDurationValue;
        
        console.log('Duration comparison:', {
          settingsDuration: leadSettings.duration,
          leadDuration: lead.duration,
          settingsValue: settingsDurationValue,
          leadValue: leadDurationValue,
          matches: durationMatches
        });
      }
      
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
