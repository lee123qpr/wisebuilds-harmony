
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useProjectApplications = (projectId: string) => {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching applications for project:', projectId);

        const { data, error } = await supabase
          .from('project_applications')
          .select(`
            id,
            created_at,
            message,
            user_id,
            user:user_id (
              id,
              first_name,
              last_name,
              display_name,
              job_title,
              location,
              profile_photo,
              bio,
              experience,
              hourly_rate,
              rating
            )
          `)
          .eq('project_id', projectId);

        if (error) throw error;
        
        console.log('Applications data received:', data?.length || 0, 'applications');

        // Fetch verification status for each applicant
        const applicationsWithVerification = await Promise.all(
          (data || []).map(async (application) => {
            try {
              const { data: isVerified } = await supabase.rpc('is_user_verified', { 
                check_user_id: application.user_id 
              });

              console.log(`User ${application.user_id} verification status:`, isVerified);

              return {
                id: application.id,
                created_at: application.created_at,
                message: application.message,
                user_id: application.user_id,
                user: application.user ? {
                  // Use type assertion to ensure TypeScript knows this is an object
                  ...(application.user as object),
                  is_verified: isVerified || false
                } : null
              };
            } catch (error) {
              console.error('Error checking verification status:', error);
              return {
                id: application.id,
                created_at: application.created_at,
                message: application.message,
                user_id: application.user_id,
                user: application.user ? {
                  // Use type assertion to ensure TypeScript knows this is an object
                  ...(application.user as object),
                  is_verified: false
                } : null
              };
            }
          })
        );

        setApplications(applicationsWithVerification);
      } catch (err: any) {
        console.error('Error fetching applications:', err);
        setError(err);
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
