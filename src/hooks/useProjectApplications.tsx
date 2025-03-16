
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FreelancerApplication } from '@/types/applications';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

export const useProjectApplications = (projectId: string | undefined) => {
  const [applications, setApplications] = useState<FreelancerApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!projectId) return;
    
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch all applications for the project
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('project_applications')
          .select('*')
          .eq('project_id', projectId);
        
        if (applicationsError) throw applicationsError;
        
        // Get freelancer info for each application
        const applicationsWithProfiles = await Promise.all(
          applicationsData.map(async (application) => {
            try {
              // First, check if there's a freelancer profile
              const { data: profileData, error: profileError } = await supabase
                .from('freelancer_profiles')
                .select('*')
                .eq('id', application.user_id)
                .single();

              if (!profileError && profileData) {
                // Transform skills from Json to string array if needed
                const skills = Array.isArray(profileData.skills) 
                  ? profileData.skills 
                  : (profileData.skills ? [String(profileData.skills.toString())] : []);
                
                // If there's a profile, use that data
                return {
                  ...application,
                  freelancer_profile: {
                    ...profileData,
                    // Ensure id is set correctly
                    id: application.user_id,
                    // Ensure skills is a string array
                    skills: skills,
                    // Additional properties expected by the UI
                    display_name: profileData.display_name || 
                      (profileData.first_name && profileData.last_name ? 
                        `${profileData.first_name} ${profileData.last_name}` : 'Freelancer'),
                  }
                };
              }
              
              // Get user data via edge function (since we can't access auth.users directly)
              const { data: userData, error: userError } = await supabase.functions.invoke(
                'get-user-profile',
                {
                  body: { userId: application.user_id }
                }
              );
              
              if (userError) throw userError;
              
              // Get verification status
              const { data: verificationData, error: verificationError } = await supabase
                .rpc('is_user_verified', { user_id: application.user_id });
              
              if (verificationError) {
                console.error('Error checking verification status:', verificationError);
              }
              
              // Get name from user metadata
              const firstName = userData?.user_metadata?.first_name;
              const lastName = userData?.user_metadata?.last_name;
              const displayName = firstName && lastName 
                ? `${firstName} ${lastName}` 
                : (userData?.email ? userData.email.split('@')[0] : 'Freelancer');
              
              // Combine all data
              return {
                ...application,
                freelancer_profile: {
                  id: application.user_id,
                  email: userData?.email,
                  verified: verificationData || false,
                  first_name: firstName,
                  last_name: lastName,
                  display_name: displayName,
                  profile_photo: userData?.user_metadata?.avatar_url,
                  phone_number: userData?.user_metadata?.phone_number,
                  job_title: userData?.user_metadata?.job_title || 'Freelancer',
                  // Ensure skills is a string array for consistency
                  skills: []
                }
              };
            } catch (err) {
              console.error('Error processing application:', err);
              return {
                ...application,
                freelancer_profile: {
                  id: application.user_id,
                  display_name: 'Freelancer',
                  skills: []
                }
              };
            }
          })
        );
        
        // Type assertion to ensure compatibility with FreelancerApplication[]
        setApplications(applicationsWithProfiles as FreelancerApplication[]);
      } catch (error: any) {
        console.error('Error fetching applications:', error);
        setError(error.message || 'Failed to load applications');
        toast({
          title: 'Error loading applications',
          description: error.message || 'Something went wrong.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApplications();
  }, [projectId, toast]);

  return { applications, isLoading, error };
};
