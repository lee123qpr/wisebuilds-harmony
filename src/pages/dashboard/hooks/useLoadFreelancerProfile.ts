
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';
import { z } from 'zod';
import { freelancerProfileSchema } from '../components/profile/freelancerSchema';
import { fetchFreelancerProfileData } from './freelancer-profile/fetchProfileData';
import { fetchCompletedJobsCount } from './freelancer-profile/fetchJobsCount';
import { formatProfileData, formatUserMetadata } from './freelancer-profile/formatProfileData';

type FreelancerProfileFormValues = z.infer<typeof freelancerProfileSchema>;

interface UseLoadFreelancerProfileProps {
  user: User | null;
  form: UseFormReturn<FreelancerProfileFormValues>;
  setProfileImage: (url: string | null) => void;
  setMemberSince: (date: string | null) => void;
  setEmailVerified: (verified: boolean) => void;
  setJobsCompleted: (count: number) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useLoadFreelancerProfile = ({
  user,
  form,
  setProfileImage,
  setMemberSince,
  setEmailVerified,
  setJobsCompleted,
  setIsLoading
}: UseLoadFreelancerProfileProps) => {
  const { toast } = useToast();

  useEffect(() => {
    async function getProfileData() {
      if (!user) return;
      
      try {
        // Fetch profile data
        const profileData = await fetchFreelancerProfileData(user, setIsLoading, toast);
        
        // Count completed jobs
        const jobsCount = await fetchCompletedJobsCount(user, profileData);
        setJobsCompleted(jobsCount);
        
        if (profileData) {
          // Format profile data from database
          const formatted = formatProfileData(profileData, user);
          if (!formatted) return;
          
          form.reset({
            fullName: formatted.fullName,
            profession: profileData.job_title || '',
            previousEmployers: formatted.formattedEmployers,
            location: profileData.location || '',
            bio: profileData.bio || '',
            phoneNumber: profileData.phone_number || '',
            website: profileData.website || '',
            hourlyRate: profileData.hourly_rate || '',
            availability: profileData.availability || '',
            skills: formatted.skills,
            experience: profileData.experience || '',
            qualifications: formatted.qualifications,
            accreditations: formatted.accreditations,
            indemnity_insurance: formatted.indemnity_insurance,
            previousWork: formatted.previousWork,
            idVerified: profileData.id_verified || false,
          });
          
          setProfileImage(profileData.profile_photo || null);
          setMemberSince(profileData.member_since || user.created_at);
          setEmailVerified(user.email_confirmed_at !== null);
        } else {
          // No profile data, use user metadata
          const metadata = formatUserMetadata(user);
          if (!metadata) return;
          
          form.reset({
            fullName: metadata.fullName,
            profession: metadata.profession,
            previousEmployers: metadata.previousEmployers,
            location: metadata.location,
            bio: metadata.bio,
            phoneNumber: metadata.phoneNumber,
            website: metadata.website,
            hourlyRate: metadata.hourlyRate,
            availability: metadata.availability,
            skills: metadata.skills,
            experience: metadata.experience,
            qualifications: metadata.qualifications,
            accreditations: metadata.accreditations,
            indemnity_insurance: metadata.indemnity_insurance,
            previousWork: metadata.previousWork,
            idVerified: metadata.idVerified,
          });
          
          setProfileImage(metadata.profileImage);
          setMemberSince(user.created_at);
          setEmailVerified(user.email_confirmed_at !== null);
        }
      } catch (error) {
        console.error('Error in profile loading process:', error);
        setIsLoading(false);
      }
    }
    
    getProfileData();
  }, [user, form, toast, setProfileImage, setMemberSince, setEmailVerified, setJobsCompleted, setIsLoading]);
};
