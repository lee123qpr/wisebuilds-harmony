
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { FreelancerProfile } from '@/types/applications';
import { toast } from '@/hooks/toast';

export const useFreelancerProfileData = (freelancerIdParam?: string) => {
  const { freelancerId: urlFreelancerId } = useParams<{ freelancerId: string }>();
  const effectiveFreelancerId = freelancerIdParam || urlFreelancerId;
  
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFreelancerProfile = async () => {
      if (!effectiveFreelancerId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Fetch the freelancer profile data
        const { data, error } = await supabase
          .from('freelancer_profiles')
          .select('*')
          .eq('id', effectiveFreelancerId)
          .maybeSingle();
          
        if (error) {
          throw error;
        }

        // If we have profile data, fetch reviews
        if (data) {
          let averageRating = data.rating;
          let reviewsCount = data.reviews_count;
          
          try {
            const { data: reviewsData, error: reviewsError } = await supabase
              .from('client_reviews')
              .select('rating')
              .eq('freelancer_id', effectiveFreelancerId);
              
            if (!reviewsError && reviewsData && reviewsData.length > 0) {
              // Calculate average rating
              const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0);
              averageRating = parseFloat((totalRating / reviewsData.length).toFixed(1));
              reviewsCount = reviewsData.length;
            }
          } catch (reviewsError) {
            console.error('Error fetching reviews:', reviewsError);
            // Continue with profile data even if reviews fetch fails
          }
          
          // Convert database data to FreelancerProfile type safely
          const profileData: FreelancerProfile = {
            id: data.id,
            first_name: data.first_name || undefined,
            last_name: data.last_name || undefined,
            display_name: data.display_name || undefined,
            profile_photo: data.profile_photo || undefined,
            job_title: data.job_title || undefined,
            location: data.location || undefined,
            bio: data.bio || undefined,
            skills: Array.isArray(data.skills) ? data.skills.map(String) : [],
            rating: averageRating || undefined,
            reviews_count: reviewsCount || undefined,
            verified: !!data.id_verified,
            email_verified: !!data.id_verified, // Using id_verified as fallback
            hourly_rate: data.hourly_rate || undefined,
            day_rate: data.hourly_rate || undefined, // Use hourly_rate as fallback
            email: data.email || undefined,
            phone_number: data.phone_number || undefined,
            website: data.website || undefined,
            member_since: data.member_since || undefined,
            jobs_completed: data.jobs_completed || 0,
            experience: data.experience || undefined,
            availability: data.availability || undefined,
            qualifications: Array.isArray(data.qualifications) ? data.qualifications.map(String) : [],
            accreditations: Array.isArray(data.accreditations) ? data.accreditations.map(String) : [],
            previous_employers: data.previous_employers ? 
              formatPreviousEmployers(data.previous_employers) : [],
            previousWork: data.previous_work ? 
              formatPreviousWork(data.previous_work) : [],
            indemnity_insurance: formatIndemnityInsurance(data.indemnity_insurance)
          };
          
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Error fetching freelancer profile:', error);
        toast({
          title: "Error",
          description: "Failed to load freelancer profile",
          variant: "destructive"
        });
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFreelancerProfile();
  }, [effectiveFreelancerId]);

  return { profile, isLoading };
};

// Helper functions to safely format complex objects
function formatPreviousEmployers(data: any) {
  if (!data || !Array.isArray(data)) return [];
  
  return data.map(emp => ({
    employerName: emp?.employerName || '',
    position: emp?.position || '',
    startDate: emp?.startDate || '',
    endDate: emp?.endDate,
    current: !!emp?.current
  }));
}

function formatPreviousWork(data: any) {
  if (!data || !Array.isArray(data)) return [];
  
  return data.map(work => ({
    name: work?.name || '',
    url: work?.url || '',
    type: work?.type || '',
    size: work?.size || 0,
    path: work?.path || ''
  }));
}

function formatIndemnityInsurance(data: any) {
  if (!data) return { hasInsurance: false };
  
  return {
    hasInsurance: !!data?.hasInsurance,
    coverLevel: data?.coverLevel
  };
}
