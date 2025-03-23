
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { FreelancerProfile } from '@/types/applications';
import { toast } from '@/hooks/toast';
import { Json } from '@/integrations/supabase/types';

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
          try {
            const { data: reviewsData, error: reviewsError } = await supabase
              .from('client_reviews')
              .select('rating')
              .eq('freelancer_id', effectiveFreelancerId);
              
            if (!reviewsError && reviewsData && reviewsData.length > 0) {
              // Calculate average rating
              const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0);
              data.rating = parseFloat((totalRating / reviewsData.length).toFixed(1));
              data.reviews_count = reviewsData.length;
            }
          } catch (reviewsError) {
            console.error('Error fetching reviews:', reviewsError);
            // Continue with profile data even if reviews fetch fails
          }
          
          // Safe conversion of JSON arrays to string arrays
          const safeStringArray = (value: Json | null): string[] => {
            if (!value) return [];
            if (Array.isArray(value)) {
              return value.map(item => String(item));
            }
            return [String(value)];
          };
          
          // Transform the data to match FreelancerProfile type
          const transformedProfile: FreelancerProfile = {
            id: data.id,
            first_name: data.first_name,
            last_name: data.last_name,
            display_name: data.display_name,
            profile_photo: data.profile_photo,
            job_title: data.job_title,
            location: data.location,
            bio: data.bio,
            skills: safeStringArray(data.skills),
            rating: data.rating,
            reviews_count: data.reviews_count,
            verified: data.verified,
            email_verified: data.email_verified,
            hourly_rate: data.hourly_rate,
            day_rate: data.day_rate,
            email: data.email,
            phone_number: data.phone_number,
            website: data.website,
            member_since: data.member_since,
            jobs_completed: data.jobs_completed,
            experience: data.experience,
            availability: data.availability,
            qualifications: safeStringArray(data.qualifications),
            accreditations: safeStringArray(data.accreditations),
            previous_employers: data.previous_employers as any || [],
            // Changed previous_work to previousWork to match the FreelancerProfile type
            previousWork: data.previous_work as any || [],
            indemnity_insurance: data.indemnity_insurance as any || { hasInsurance: false },
          };
          
          setProfile(transformedProfile);
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
