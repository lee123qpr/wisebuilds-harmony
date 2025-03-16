
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
              // Get user data via edge function (since we can't access auth.users directly)
              const { data: userData, error: userError } = await supabase.functions.invoke(
                'get-user-profile',
                {
                  body: { userId: application.user_id }
                }
              );
              
              if (userError) throw userError;
              
              // Get freelancer profile data
              const { data: profileData, error: profileError } = await supabase
                .from('freelancer_profiles')
                .select('*')
                .eq('id', application.user_id)
                .single();
                
              if (profileError && profileError.code !== 'PGRST116') {
                // PGRST116 means not found, which might happen if profile not created yet
                console.error('Error fetching freelancer profile:', profileError);
              }
              
              // Get verification status
              const { data: verificationData, error: verificationError } = await supabase
                .rpc('is_user_verified', { user_id: application.user_id });
              
              if (verificationError) {
                console.error('Error checking verification status:', verificationError);
              }
              
              // Combine all data
              return {
                ...application,
                freelancer_profile: {
                  id: application.user_id,
                  email: userData?.email,
                  verified: verificationData || false,
                  ...profileData,
                  // Get name from user_metadata if available
                  first_name: profileData?.first_name || userData?.user_metadata?.first_name,
                  last_name: profileData?.last_name || userData?.user_metadata?.last_name,
                  display_name: profileData?.display_name || 
                    (userData?.user_metadata?.first_name && userData?.user_metadata?.last_name) ? 
                    `${userData.user_metadata.first_name} ${userData.user_metadata.last_name}` : 
                    'Anonymous Freelancer',
                  phone_number: profileData?.phone_number || userData?.user_metadata?.phone_number,
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
