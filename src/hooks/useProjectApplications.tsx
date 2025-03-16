
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
              
              // Get verification status
              const { data: verificationData, error: verificationError } = await supabase
                .rpc('is_user_verified', { user_id: application.user_id });
              
              if (verificationError) {
                console.error('Error checking verification status:', verificationError);
              }
              
              // Extract user metadata
              const userMetadata = userData?.user_metadata || {};
              const email = userData?.email || '';
              const firstName = userMetadata.first_name || userMetadata.firstname || '';
              const lastName = userMetadata.last_name || userMetadata.lastname || '';
              const phoneNumber = userMetadata.phone_number || userMetadata.phone || '';
              const displayName = firstName && lastName 
                ? `${firstName} ${lastName}` 
                : userMetadata.full_name || 'Anonymous Freelancer';
              const jobTitle = userMetadata.job_title || userMetadata.profession || '';
              const location = userMetadata.location || '';
              
              // Get any reviews for this user
              const { data: reviews, error: reviewsError } = await supabase
                .from('client_reviews')
                .select('rating')
                .eq('reviewer_id', application.user_id);
              
              if (reviewsError) {
                console.error('Error fetching reviews:', reviewsError);
              }
              
              // Calculate average rating
              let rating = null;
              if (reviews && reviews.length > 0) {
                const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
                rating = sum / reviews.length;
              }
              
              // Combine all data
              return {
                ...application,
                freelancer_profile: {
                  id: application.user_id,
                  email: email,
                  verified: verificationData || false,
                  first_name: firstName,
                  last_name: lastName,
                  display_name: displayName,
                  phone_number: phoneNumber,
                  job_title: jobTitle,
                  location: location,
                  profile_photo: userMetadata.avatar_url,
                  rating: rating,
                  reviews_count: reviews?.length || 0,
                  member_since: userData?.user?.created_at || userMetadata.created_at,
                  jobs_completed: userMetadata.jobs_completed || 0
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
