import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { z } from 'zod';
import { freelancerProfileSchema } from '../components/profile/freelancerSchema';
import { FreelancerEmployer, FreelancerProfileFormData } from '@/types/freelancer';

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
        setIsLoading(true);
        
        const { data: profileData, error: profileError } = await supabase
          .from('freelancer_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()
          .options({
            cache: 'no-store'
          });
          
        if (profileError) {
          throw profileError;
        }
        
        console.log('Loaded profile data from database:', profileData);
        console.log('Jobs completed count:', profileData?.jobs_completed);
        
        if (profileData) {
          const previousEmployers = Array.isArray(profileData.previous_employers) 
            ? (profileData.previous_employers as any[]).map(emp => ({
                employerName: emp.employerName || '',
                startDate: emp.startDate || '',
                endDate: emp.endDate || null,
                current: emp.current || false,
                position: emp.position || ''
              })) as FreelancerEmployer[]
            : [];
            
          const skills = Array.isArray(profileData.skills) 
            ? profileData.skills as string[] 
            : [];
            
          const qualifications = Array.isArray(profileData.qualifications) 
            ? profileData.qualifications as string[] 
            : [];
            
          const accreditations = Array.isArray(profileData.accreditations) 
            ? profileData.accreditations as string[] 
            : [];
            
          const previousWork = Array.isArray(profileData.previous_work) 
            ? profileData.previous_work as any[] 
            : [];

          const indemnity_insurance = typeof profileData.indemnity_insurance === 'object' 
            ? profileData.indemnity_insurance as { hasInsurance: boolean; coverLevel?: string }
            : { hasInsurance: false };
          
          const fullName = profileData.display_name || 
                          `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim();
          
          const formattedEmployers = previousEmployers.map(employer => ({
            ...employer,
            startDate: employer.startDate ? new Date(employer.startDate) : new Date(),
            endDate: employer.endDate ? new Date(employer.endDate) : null
          }));
          
          form.reset({
            fullName,
            profession: profileData.job_title || '',
            previousEmployers: formattedEmployers,
            location: profileData.location || '',
            bio: profileData.bio || '',
            phoneNumber: profileData.phone_number || '',
            website: profileData.website || '',
            hourlyRate: profileData.hourly_rate || '',
            availability: profileData.availability || '',
            skills,
            experience: profileData.experience || '',
            qualifications,
            accreditations,
            indemnity_insurance,
            previousWork,
            idVerified: profileData.id_verified || false,
          });
          
          setProfileImage(profileData.profile_photo || null);
          setMemberSince(profileData.member_since || user.created_at);
          setEmailVerified(user.email_confirmed_at !== null);
          
          const completedJobs = profileData.jobs_completed || 0;
          console.log('Setting jobs completed count to:', completedJobs);
          setJobsCompleted(completedJobs);
        } else {
          const userMetadata = user.user_metadata || {};
          
          const previousEmployers = Array.isArray(userMetadata.previous_employers) 
            ? (userMetadata.previous_employers as any[]).map(emp => ({
                employerName: emp.employerName || '',
                startDate: emp.startDate || '',
                endDate: emp.endDate || null,
                current: emp.current || false,
                position: emp.position || ''
              })) as FreelancerEmployer[]
            : [];
            
          const formattedEmployers = previousEmployers.map(employer => ({
            ...employer,
            startDate: employer.startDate ? new Date(employer.startDate) : new Date(),
            endDate: employer.endDate ? new Date(employer.endDate) : null
          }));
          
          form.reset({
            fullName: userMetadata.full_name || '',
            profession: userMetadata.profession || '',
            previousEmployers: formattedEmployers,
            location: userMetadata.location || '',
            bio: userMetadata.bio || '',
            phoneNumber: userMetadata.phone_number || userMetadata.phone || '',
            website: userMetadata.website || '',
            hourlyRate: userMetadata.hourly_rate || '',
            availability: userMetadata.availability || '',
            skills: userMetadata.skills || [],
            experience: userMetadata.experience || '',
            qualifications: userMetadata.qualifications || [],
            accreditations: userMetadata.accreditations || [],
            indemnity_insurance: {
              hasInsurance: userMetadata.indemnity_insurance?.hasInsurance || false,
              coverLevel: userMetadata.indemnity_insurance?.coverLevel || '',
            },
            previousWork: userMetadata.previous_work || [],
            idVerified: userMetadata.id_verified || false,
          });
          
          setProfileImage(userMetadata.profile_image_url || null);
          setMemberSince(user.created_at);
          setEmailVerified(user.email_confirmed_at !== null);
          setJobsCompleted(userMetadata.jobs_completed || 0);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load profile information.',
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    getProfileData();
  }, [user, form, toast, setProfileImage, setMemberSince, setEmailVerified, setJobsCompleted, setIsLoading]);
};
