
import { useState, useEffect } from 'react';
import { LeadSettings } from './types';
import { ProjectLead } from '@/types/projects';
import { generateProjectLeads } from './utils/projectLeadGenerator';

export const useProjectLeadsGenerator = (leadSettings: LeadSettings | null) => {
  const [projectLeads, setProjectLeads] = useState<ProjectLead[]>([]);

  useEffect(() => {
    if (leadSettings) {
      console.log('Generating leads based on settings:', leadSettings);
      const leads = generateProjectLeads(leadSettings);
      setProjectLeads(leads);
    }
  }, [leadSettings]);

  return { projectLeads };
};
