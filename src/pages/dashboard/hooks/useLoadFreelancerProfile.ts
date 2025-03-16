import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { freelancerProfileSchema } from '../components/profile/freelancerSchema';
import { User } from '@supabase/supabase-js';

interface UseLoadFreelancerProfileProps {
  user: User | null;
  form: ReturnType<typeof useForm<z.infer<typeof freelancerProfileSchema>>>;
  setProfileImage: (url: string | null) => void;
  setMemberSince: (date: string | null) => void;
  setEmailVerified: (verified: boolean) => void;
  setJobsCompleted: (count: number) => void;
  setIsLoading: (loading: boolean) => void;
  setRating: (rating: number) => void;
  setReviewsCount: (count: number) => void;
}

export const useLoadFreelancerProfile = ({
  user,
  form,
  setProfileImage,
  setMemberSince,
  setEmailVerified,
  setJobsCompleted,
  setIsLoading,
  setRating,
  setReviewsCount
}: UseLoadFreelancerProfileProps) => {
  useEffect(() => {
    if (!user) {
      return;
    }
    
    const loadProfileData = async () => {
      try {
        setIsLoading(true);
        
        const profileData = form.getValues();
        
        if (profileData) {
          form.reset(profileData);
          
          if (profileData.profile_photo) {
            setProfileImage(profileData.profile_photo);
          }
          
          if (profileData.member_since) {
            setMemberSince(profileData.member_since);
          }
          
          setEmailVerified(profileData.email_verified || false);
          setJobsCompleted(profileData.jobs_completed || 0);
          
          if (profileData.rating !== null && profileData.rating !== undefined) {
            setRating(Number(profileData.rating));
          }
          
          if (profileData.reviews_count !== null && profileData.reviews_count !== undefined) {
            setReviewsCount(Number(profileData.reviews_count));
          }
        }
      } catch (error) {
        console.error('Error loading freelancer profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfileData();
  }, [user, form, setProfileImage, setMemberSince, setEmailVerified, setJobsCompleted, setIsLoading, setRating, setReviewsCount]);
};
