
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { freelancerProfileSchema } from '../components/profile/freelancerSchema';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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
        
        // Fetch data from Supabase
        const { data: profileData, error } = await supabase
          .from('freelancer_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching freelancer profile:', error);
          return;
        }
        
        if (profileData) {
          // Set form values from profile data
          form.reset({
            fullName: profileData.display_name || '',
            profession: profileData.job_title || '',
            previousEmployers: profileData.previous_employers as any[] || [],
            location: profileData.location || '',
            bio: profileData.bio || '',
            phoneNumber: profileData.phone_number || '',
            website: profileData.website || '',
            hourlyRate: profileData.hourly_rate || '',
            availability: profileData.availability || '',
            skills: profileData.skills as string[] || [],
            experience: profileData.experience || '',
            qualifications: profileData.qualifications as string[] || [],
            accreditations: profileData.accreditations as string[] || [],
            indemnityInsurance: profileData.indemnity_insurance as any || { hasInsurance: false, coverLevel: '' },
            previousWork: profileData.previous_work as any[] || [],
            idVerified: profileData.id_verified || false,
          });
          
          // Set additional state values
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
