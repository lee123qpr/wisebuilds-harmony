
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { FreelancerProfileData } from '@/pages/dashboard/components/profile/freelancerSchema';

export const useSaveFreelancerProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const saveProfile = async (profileData: FreelancerProfileData): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to save your profile',
        variant: 'destructive',
      });
      return false;
    }

    setIsSaving(true);
    try {
      console.log('Saving freelancer profile:', profileData);
      
      // Check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('freelancer_profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking existing profile:', checkError);
        throw checkError;
      }
      
      const profileUpdate = {
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        display_name: profileData.display_name,
        job_title: profileData.job_title,
        location: profileData.location,
        bio: profileData.bio,
        email: profileData.email,
        phone_number: profileData.phone_number,
        website: profileData.website,
        hourly_rate: profileData.hourly_rate,
        availability: profileData.availability,
        skills: profileData.skills,
        experience: profileData.experience,
        qualifications: profileData.qualifications,
        accreditations: profileData.accreditations,
        indemnity_insurance: profileData.has_indemnity_insurance ? profileData.indemnity_insurance : null,
        previous_work: profileData.previous_work || [],
        previous_employers: profileData.previous_employers || [],
        profile_photo: profileData.profile_photo,
        updated_at: new Date().toISOString()
      };
      
      let result;
      
      if (existingProfile) {
        // Update existing profile
        result = await supabase
          .from('freelancer_profiles')
          .update(profileUpdate)
          .eq('id', user.id);
      } else {
        // Create new profile
        result = await supabase
          .from('freelancer_profiles')
          .insert({
            id: user.id,
            ...profileUpdate,
            created_at: new Date().toISOString(),
            member_since: new Date().toISOString()
          });
      }
      
      if (result.error) {
        console.error('Error saving freelancer profile:', result.error);
        throw result.error;
      }
      
      // Update user metadata for non-sensitive info
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          firstName: profileData.first_name,
          lastName: profileData.last_name,
          displayName: profileData.display_name,
          profileComplete: true
        }
      });
      
      if (metadataError) {
        console.error('Error updating user metadata:', metadataError);
        // Don't fail the entire save operation if only metadata update fails
      }
      
      toast({
        title: 'Profile saved',
        description: 'Your profile has been updated successfully',
      });
      
      return true;
    } catch (err) {
      console.error('Error saving freelancer profile:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      
      toast({
        title: 'Failed to save profile',
        description: 'There was an error saving your profile. Please try again.',
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { saveProfile, isSaving, error };
};
