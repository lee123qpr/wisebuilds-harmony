
import { useState } from 'react';
import { useFreelancerProfileForm } from './useFreelancerProfileForm';
import { useSaveFreelancerProfile } from './useSaveFreelancerProfile';
import { useLoadFreelancerProfile } from './useLoadFreelancerProfile';
import { User } from '@supabase/supabase-js';

export const useFreelancerProfile = (user: User | null) => {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [memberSince, setMemberSince] = useState<string | null>(null);
  const [emailVerified, setEmailVerified] = useState<boolean>(false);
  const [jobsCompleted, setJobsCompleted] = useState<number>(0);
  const [idVerified, setIdVerified] = useState<boolean>(false);
  
  const { form, isLoading, setIsLoading } = useFreelancerProfileForm();
  
  const { saveProfile, isSaving } = useSaveFreelancerProfile(user, profileImage);
  
  useLoadFreelancerProfile({
    user,
    form,
    setProfileImage,
    setMemberSince,
    setEmailVerified,
    setJobsCompleted,
    setIsLoading
  });

  // Log jobs completed value whenever it changes
  console.log('useFreelancerProfile - Jobs completed:', jobsCompleted);

  return {
    form,
    isLoading,
    isSaving,
    profileImage,
    uploadingImage,
    setUploadingImage,
    setProfileImage,
    saveProfile,
    memberSince,
    emailVerified,
    jobsCompleted,
    idVerified,
    setIdVerified
  };
};
