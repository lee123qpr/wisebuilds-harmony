
import { useLoadFreelancerProfile } from './useLoadFreelancerProfile';
import { useSaveFreelancerProfile } from './useSaveFreelancerProfile';
import { useAuth } from '@/context/AuthContext';

export const useFreelancerProfile = () => {
  const { user } = useAuth();
  const userId = user?.id || '';
  
  const { profile, isLoading: isLoadingProfile } = useLoadFreelancerProfile(userId);
  const { saveProfile, isSaving } = useSaveFreelancerProfile();
  
  return {
    profile,
    isLoadingProfile,
    saveProfile,
    isSaving
  };
};
