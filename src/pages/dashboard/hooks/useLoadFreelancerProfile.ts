
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { FreelancerProfileData } from '@/pages/dashboard/components/profile/freelancerSchema';
import { getStorageUrl } from '@/integrations/supabase/client';

export const useLoadFreelancerProfile = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<FreelancerProfileData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadFreelancerProfile = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        console.log('Loading freelancer profile for user:', user.id);
        
        // Fetch user metadata from auth service
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Error fetching user data:', userError);
          throw userError;
        }
        
        const userMetadata = userData.user?.user_metadata || {};
        console.log('User metadata:', userMetadata);
        
        // Fetch profile data from freelancer_profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('freelancer_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          console.error('Error fetching freelancer profile:', profileError);
          // Don't throw here, we can still use the metadata if available
        }
        
        console.log('Fetched profile data:', profileData);
        
        // Process the fetched data
        const previousWorkData = profileData?.previous_work || [];
        const previousWork = Array.isArray(previousWorkData) 
          ? previousWorkData 
          : [];
          
        const previousEmployersData = profileData?.previous_employers || [];
        const previousEmployers = Array.isArray(previousEmployersData) 
          ? previousEmployersData 
          : [];
        
        // Process skills, qualifications and accreditations
        const skillsData = profileData?.skills || [];
        const skills = Array.isArray(skillsData) ? skillsData : [];
        
        const qualificationsData = profileData?.qualifications || [];
        const qualifications = Array.isArray(qualificationsData) ? qualificationsData : [];
        
        const accreditationsData = profileData?.accreditations || [];
        const accreditations = Array.isArray(accreditationsData) ? accreditationsData : [];
        
        // Combine data, prioritizing the profile data from the database
        const fullProfile: FreelancerProfileData = {
          display_name: profileData?.display_name || '',
          first_name: profileData?.first_name || userMetadata.firstName || '',
          last_name: profileData?.last_name || userMetadata.lastName || '',
          location: profileData?.location || '',
          bio: profileData?.bio || '',
          phone_number: profileData?.phone_number || '',
          website: profileData?.website || '',
          hourly_rate: profileData?.hourly_rate || '',
          availability: profileData?.availability || '',
          skills: skills,
          experience: profileData?.experience || '',
          qualifications: qualifications,
          accreditations: accreditations,
          // Handle indemnity insurance
          indemnity_insurance: profileData?.indemnity_insurance || null,
          has_indemnity_insurance: !!profileData?.indemnity_insurance,
          // ID verification
          id_verified: !!profileData?.id_verified,
          previous_work: previousWork,
          previous_employers: previousEmployers,
          profile_photo: profileData?.profile_photo || '',
          member_since: profileData?.member_since || null,
          jobs_completed: profileData?.jobs_completed || 0,
          email: profileData?.email || userMetadata.email || '',
          job_title: profileData?.job_title || ''
        };
        
        setProfile(fullProfile);
        console.log('Loaded freelancer profile:', fullProfile);
      } catch (err) {
        console.error('Error loading freelancer profile:', err);
        setError(err instanceof Error ? err : new Error('Error loading profile'));
        toast({
          title: 'Failed to load profile',
          description: 'There was an error loading your profile. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFreelancerProfile();
  }, [user, toast]);

  return { profile, isLoading, error };
};
