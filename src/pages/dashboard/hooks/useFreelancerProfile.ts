
import { useLoadFreelancerProfile } from './useLoadFreelancerProfile';
import { useSaveFreelancerProfile } from './useSaveFreelancerProfile';
import { useAuth } from '@/context/AuthContext';

export const useFreelancerProfile = () => {
  const { user } = useAuth();
  
  const { profile, isLoading: isLoadingProfile } = useLoadFreelancerProfile();
  const { saveProfile, isSaving } = useSaveFreelancerProfile();
  
  return {
    profile,
    isLoadingProfile,
    saveProfile,
    isSaving
  };
};
