
import { useLeadSettingsData } from './freelancer/useLeadSettingsData';
import { useProjectLeadsGenerator } from './freelancer/useProjectLeadsGenerator';
import { LeadSettings } from './freelancer/types';

export { LeadSettings };

export const useFreelancerDashboard = () => {
  const { leadSettings, isLoading: isLoadingSettings, error } = useLeadSettingsData();
  const { projectLeads } = useProjectLeadsGenerator(leadSettings);

  return {
    leadSettings,
    isLoadingSettings,
    projectLeads,
    error
  };
};
