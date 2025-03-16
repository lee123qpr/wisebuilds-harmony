
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { z } from 'zod';
import { freelancerProfileSchema } from '../components/profile/freelancerSchema';
import { UploadedFile } from '@/components/projects/file-upload/types';

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

  // Fetch freelancer profile data
  useEffect(() => {
    async function getProfileData() {
      if (!user) return;
      
      try {
        setIsLoading(true);
        // Check if there's a table for freelancer profiles
        // In a real app, you'd create this table, but for now, we'll use user metadata
        
        // Extract user metadata for values
        const userMetadata = user.user_metadata || {};
        
        // Convert dates to Date objects for previousEmployers
        let previousEmployers = userMetadata.previous_employers || [];
        if (previousEmployers.length > 0) {
          previousEmployers = previousEmployers.map((employer: any) => ({
            ...employer,
            startDate: employer.startDate ? new Date(employer.startDate) : new Date(),
            endDate: employer.endDate ? new Date(employer.endDate) : null
          }));
        }
        
        // Handle previous work files
        let previousWork: UploadedFile[] = [];
        if (userMetadata.previous_work && Array.isArray(userMetadata.previous_work)) {
          previousWork = userMetadata.previous_work.map((work: any) => ({
            name: work.name || '',
            url: work.url || '',
            type: work.type || '',
            size: work.size || 0,
            path: work.path || ''
          }));
        }
        
        // Populate form with existing data from user metadata
        form.reset({
          fullName: userMetadata.full_name || '',
          profession: userMetadata.profession || '',
          previousEmployers: previousEmployers,
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
          indemnityInsurance: {
            hasInsurance: userMetadata.indemnity_insurance?.hasInsurance || false,
            coverLevel: userMetadata.indemnity_insurance?.coverLevel || '',
          },
          previousWork: previousWork,
          idVerified: userMetadata.id_verified || false,
        });
        
        setProfileImage(userMetadata.profile_image_url || null);
        
        // Member since would come from the database in a real app
        const memberSince = userMetadata.created_at || user.created_at;
        setMemberSince(memberSince);
        
        setEmailVerified(user.email_confirmed_at !== null);
        
        // Jobs completed would come from the database in a real app
        setJobsCompleted(userMetadata.jobs_completed || 0);
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
