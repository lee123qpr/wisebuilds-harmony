
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FreelancerApplication } from '@/types/applications';
import { useToast } from '@/hooks/use-toast';

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
              // First try to get the freelancer profile from freelancer_profiles
              const { data: profileData, error: profileError } = await supabase
                .from('freelancer_profiles')
                .select('*')
                .eq('id', application.user_id)
                .maybeSingle();
                
              if (profileError) {
                console.error('Error fetching freelancer profile:', profileError);
              }
              
              // If we found a profile, use that data
              if (profileData) {
                // Get verification status
                const { data: verificationData, error: verificationError } = await supabase
                  .rpc('is_user_verified', { user_id: application.user_id });
                
                if (verificationError) {
                  console.error('Error checking verification status:', verificationError);
                }
                
                return {
                  ...application,
                  freelancer_profile: {
                    id: application.user_id,
                    email: profileData.email,
                    verified: verificationData || false,
                    first_name: profileData.first_name || '',
                    last_name: profileData.last_name || '',
                    display_name: profileData.display_name || 'Anonymous Freelancer',
                    phone_number: profileData.phone_number || '',
                    job_title: profileData.job_title || '',
                    location: profileData.location || '',
                    profile_photo: profileData.profile_photo || null,
                  }
                };
              }
              
              // If no profile was found, fall back to the user metadata
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
              
              // Extract user metadata
              const userMetadata = userData?.user_metadata || {};
              const firstName = userMetadata.first_name || userMetadata.firstname || '';
              const lastName = userMetadata.last_name || userMetadata.lastname || '';
              const phoneNumber = userMetadata.phone_number || userMetadata.phone || '';
              const displayName = firstName && lastName 
                ? `${firstName} ${lastName}` 
                : userMetadata.full_name || 'Anonymous Freelancer';
              const jobTitle = userMetadata.job_title || userMetadata.profession || '';
              const location = userMetadata.location || '';
              
              // Return the application with user metadata
              return {
                ...application,
                freelancer_profile: {
                  id: application.user_id,
                  email: userData?.email,
                  verified: verificationData || false,
                  first_name: firstName,
                  last_name: lastName,
                  display_name: displayName,
                  phone_number: phoneNumber,
                  job_title: jobTitle,
                  location: location,
                  profile_photo: userMetadata.avatar_url,
                }
              };
            } catch (err) {
              console.error('Error processing application:', err);
              return application;
            }
          })
        );
        
        setApplications(applicationsWithProfiles);
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
