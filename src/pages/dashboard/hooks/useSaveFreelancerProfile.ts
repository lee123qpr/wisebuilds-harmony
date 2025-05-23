
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
      
      // Convert Date objects to ISO strings for database storage
      const previousEmployers = values.previousEmployers.map(employer => ({
        ...employer,
        startDate: employer.startDate.toISOString(),
        endDate: employer.endDate ? employer.endDate.toISOString() : null
      }));
      
      // Ensure website URL has https:// if not empty
      const websiteUrl = values.website ? 
        (values.website.match(/^https?:\/\//) ? values.website : `https://${values.website}`) : 
        values.website;
      
      // Ensure previousWork has all required fields
      const previousWork = (values.previousWork || []).map((work: UploadedFile) => ({
        name: work.name,
        url: work.url,
        type: work.type,
        size: work.size,
        path: work.path || ''
      }));
      
      // Update user metadata
      const { error: updateUserError } = await supabase.auth.updateUser({
        data: {
          full_name: values.fullName,
          profession: values.profession,
          previous_employers: previousEmployers,
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
          indemnity_insurance: values.indemnity_insurance,
          previous_work: previousWork,
          id_verified: values.idVerified,
        }
      });
      
      if (updateUserError) {
        throw updateUserError;
      }
      
      // Update the freelancer_profiles table
      const { error: updateProfileError } = await supabase
        .from('freelancer_profiles')
        .update({
          first_name: values.fullName.split(' ')[0] || '',
          last_name: values.fullName.split(' ').slice(1).join(' ') || '',
          display_name: values.fullName,
          job_title: values.profession,
          location: values.location,
          bio: values.bio,
          phone_number: values.phoneNumber,
          website: websiteUrl,
          profile_photo: profileImage,
          hourly_rate: values.hourlyRate,
          availability: values.availability,
          skills: values.skills,
          experience: values.experience,
          qualifications: values.qualifications,
          accreditations: values.accreditations,
          previous_employers: previousEmployers,
          indemnity_insurance: values.indemnity_insurance,
          previous_work: previousWork,
          id_verified: values.idVerified,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (updateProfileError) {
        console.error('Error updating freelancer profile:', updateProfileError);
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
