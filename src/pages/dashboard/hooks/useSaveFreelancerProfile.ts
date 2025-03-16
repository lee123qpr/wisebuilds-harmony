import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { z } from 'zod';
import { freelancerProfileSchema } from '../components/profile/freelancerSchema';
import { UploadedFile } from '@/components/projects/file-upload/types';

type FreelancerProfileFormValues = z.infer<typeof freelancerProfileSchema>;

export const useSaveFreelancerProfile = (user: User | null, profileImage: string | null) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const saveProfile = async (values: FreelancerProfileFormValues) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      console.log('Saving profile with values:', values);
      
      // Prepare website URL (ensure it has https:// if not empty)
      const websiteUrl = values.website ? 
        (values.website.match(/^https?:\/\//) ? values.website : `https://${values.website}`) : 
        values.website;
      
      // Ensure previousWork has all required fields
      const previousWork = (values.previousWork || []).map((work: UploadedFile) => ({
        name: work.name,
        url: work.url,
        type: work.type,
        size: work.size,
        path: work.path || '' // Ensure path is included, even if empty
      }));
      
      // Update user metadata to keep it in sync
      const { error: updateUserError } = await supabase.auth.updateUser({
        data: {
          full_name: values.fullName,
          profession: values.profession,
          previous_employers: values.previousEmployers,
          location: values.location,
          bio: values.bio,
          phone_number: values.phoneNumber,
          website: websiteUrl,
          profile_image_url: profileImage,
          hourly_rate: values.hourlyRate,
          availability: values.availability,
          skills: values.skills,
          experience: values.experience,
          qualifications: values.qualifications,
          accreditations: values.accreditations,
          indemnity_insurance: values.indemnityInsurance,
          previous_work: previousWork,
          id_verified: values.idVerified,
        }
      });
      
      if (updateUserError) {
        throw updateUserError;
      }
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save profile information. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    saveProfile
  };
};
