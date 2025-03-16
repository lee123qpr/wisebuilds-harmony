
import { useLeadSettingsData } from './freelancer/useLeadSettingsData';
import { LeadSettings } from './freelancer/types';

export type { LeadSettings };

export const useFreelancerDashboard = () => {
  const { leadSettings, isLoading: isLoadingSettings, error } = useLeadSettingsData();

  return {
    leadSettings,
    isLoadingSettings,
    error
  };
};
