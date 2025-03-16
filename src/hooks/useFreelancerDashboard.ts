
import { useLeadSettingsData } from './freelancer/useLeadSettingsData';
import { useProjectLeadsGenerator } from './freelancer/useProjectLeadsGenerator';
import { LeadSettings } from './freelancer/types';

export type { LeadSettings };

export const useFreelancerDashboard = () => {
  const { leadSettings, isLoading: isLoadingSettings, error } = useLeadSettingsData();
  const { projectLeads, isLoading: isLoadingLeads } = useProjectLeadsGenerator(leadSettings);

  return {
    leadSettings,
    isLoadingSettings,
    isLoadingLeads,
    projectLeads,
    error
  };
};
