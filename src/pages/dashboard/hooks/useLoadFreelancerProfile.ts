
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { z } from 'zod';
import { freelancerProfileSchema } from '../components/profile/freelancerSchema';

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
        
        // Populate form with existing data from user metadata
        form.reset({
          fullName: userMetadata.full_name || '',
          profession: userMetadata.profession || '',
          location: userMetadata.location || '',
          bio: userMetadata.bio || '',
          phoneNumber: userMetadata.phone_number || userMetadata.phone || '',
          website: userMetadata.website || '',
          hourlyRate: userMetadata.hourly_rate || '',
          availability: userMetadata.availability || '',
          skills: userMetadata.skills || [],
          experience: userMetadata.experience || '',
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
