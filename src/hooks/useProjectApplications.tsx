
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FreelancerApplication, FreelancerProfile } from '@/types/applications';
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

        // Step 1: Get basic application data
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

        // Step 2: Fetch freelancer profiles for each application and map them together
        const applicationsWithProfiles = await Promise.all(
          data.map(async (application) => {
            try {
              // Get freelancer profile data
              const { data: profileData, error: profileError } = await supabase
                .from('freelancer_profiles')
                .select('*')
                .eq('id', application.user_id)
                .maybeSingle();

              if (profileError) {
                console.error('Error fetching profile for user:', application.user_id, profileError);
              }

              // Get verification status
              const { data: isVerified } = await supabase.rpc('is_user_verified', { 
                check_user_id: application.user_id 
              });

              console.log(`User ${application.user_id} verification status:`, isVerified);

              // Create a properly typed FreelancerProfile object
              const typedProfile: FreelancerProfile | null = profileData ? {
                id: profileData.id,
                first_name: profileData.first_name,
                last_name: profileData.last_name,
                display_name: profileData.display_name,
                profile_photo: profileData.profile_photo,
                job_title: profileData.job_title,
                location: profileData.location,
                bio: profileData.bio,
                skills: profileData.skills as string[] | undefined,
                rating: profileData.rating,
                reviews_count: profileData.reviews_count,
                verified: isVerified || false,
                email_verified: profileData.id_verified || false, // map id_verified to email_verified
                hourly_rate: profileData.hourly_rate,
                day_rate: profileData.day_rate,
                email: profileData.email,
                phone_number: profileData.phone_number,
                website: profileData.website,
                member_since: profileData.member_since,
                jobs_completed: profileData.jobs_completed,
                experience: profileData.experience,
                availability: profileData.availability,
                qualifications: profileData.qualifications as string[] | undefined,
                accreditations: profileData.accreditations as string[] | undefined,
                previous_employers: profileData.previous_employers as {
                  employerName: string;
                  position: string;
                  startDate: string;
                  endDate?: string;
                  current: boolean;
                }[] | undefined,
                indemnity_insurance: profileData.indemnity_insurance as {
                  hasInsurance: boolean;
                  coverLevel?: string;
                } | undefined,
                previousWork: profileData.previous_work as {
                  name: string;
                  url: string;
                  type: string;
                  size: number;
                  path: string;
                }[] | undefined
              } : null;

              // Return the application with the typed profile
              return {
                id: application.id,
                user_id: application.user_id,
                project_id: application.project_id,
                message: application.message,
                created_at: application.created_at,
                freelancer_profile: typedProfile
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
