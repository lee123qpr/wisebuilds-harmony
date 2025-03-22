
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FreelancerApplication } from '@/types/applications';
import { toast } from 'sonner';

export const useProjectApplications = (projectId: string | undefined) => {
  const [applications, setApplications] = useState<FreelancerApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching applications for project:', projectId);

        if (!projectId) {
          throw new Error('No project ID provided');
        }

        // The previous query was trying to use a join that doesn't exist
        // Let's modify it to use a proper query structure
        const { data, error } = await supabase
          .from('project_applications')
          .select(`
            id,
            created_at,
            message,
            user_id,
            project_id
          `)
          .eq('project_id', projectId);

        if (error) throw error;
        
        console.log('Applications data received:', data?.length || 0, 'applications');

        if (!data || data.length === 0) {
          setApplications([]);
          setIsLoading(false);
          return;
        }

        // Fetch freelancer profiles for each application
        const applicationsWithProfiles = await Promise.all(
          data.map(async (application) => {
            try {
              // Get freelancer profile data
              const { data: profileData, error: profileError } = await supabase
                .from('freelancer_profiles')
                .select('*')
                .eq('id', application.user_id)
                .single();

              if (profileError) {
                console.error('Error fetching profile for user:', application.user_id, profileError);
              }

              // Get verification status
              const { data: isVerified } = await supabase.rpc('is_user_verified', { 
                check_user_id: application.user_id 
              });

              console.log(`User ${application.user_id} verification status:`, isVerified);

              return {
                id: application.id,
                user_id: application.user_id,
                project_id: application.project_id,
                message: application.message,
                created_at: application.created_at,
                freelancer_profile: profileData ? {
                  ...profileData,
                  verified: isVerified || false,
                  email_verified: profileData.email_verified || false
                } : null
              } as FreelancerApplication;
            } catch (err) {
              console.error('Error processing application:', err);
              return {
                id: application.id,
                user_id: application.user_id,
                project_id: application.project_id,
                message: application.message,
                created_at: application.created_at,
                freelancer_profile: null
              } as FreelancerApplication;
            }
          })
        );

        setApplications(applicationsWithProfiles);
      } catch (err: any) {
        console.error('Error fetching applications:', err);
        setError(err);
        toast.error("Failed to load applications");
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchApplications();
    } else {
      // Reset state if no projectId is provided
      setApplications([]);
      setIsLoading(false);
      setError(null);
    }
  }, [projectId]);

  return { applications, isLoading, error };
};
