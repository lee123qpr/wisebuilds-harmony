
import { useState } from 'react';
import { useClientProfileForm } from './useClientProfileForm';
import { useSaveClientProfile } from './useSaveClientProfile';
import { useLoadClientProfile } from './useLoadClientProfile';
import { User } from '@supabase/supabase-js';

export const useClientProfile = (user: User | null) => {
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [memberSince, setMemberSince] = useState<string | null>(null);
  const [emailVerified, setEmailVerified] = useState<boolean>(false);
  const [jobsCompleted, setJobsCompleted] = useState<number>(0);
  
  const { form, isLoading, setIsLoading } = useClientProfileForm();
  
  const { saveProfile, isSaving } = useSaveClientProfile(user, logoUrl);
  
  useLoadClientProfile({
    user,
    form,
    setLogoUrl,
    setMemberSince,
    setEmailVerified,
    setJobsCompleted,
    setIsLoading
  });

  return {
    form,
    isLoading,
    isSaving,
    logoUrl,
    uploadingLogo,
    setUploadingLogo,
    setLogoUrl,
    saveProfile,
    memberSince,
    emailVerified,
    jobsCompleted
  };
};
