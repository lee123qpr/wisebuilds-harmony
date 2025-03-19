
import { useState, useEffect } from 'react';
import { FreelancerProfile } from '@/types/applications';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useFreelancerProfileData = (freelancerId: string | undefined) => {
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFreelancerProfile = async () => {
      if (!freelancerId) return;
      
      setIsLoading(true);
      try {
        // Get user data via edge function
        const { data: userData, error: userError } = await supabase.functions.invoke(
          'get-user-profile',
          {
            body: { userId: freelancerId }
          }
        );
        
        if (userError) throw userError;
        
        // Get verification status
        const { data: verificationData, error: verificationError } = await supabase
          .rpc('is_user_verified', { user_id: freelancerId });
        
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
        const bio = userMetadata.bio || '';
        const skills = userMetadata.skills || [];
        
        // Get any reviews for this user
        const { data: reviews, error: reviewsError } = await supabase
          .from('client_reviews')
          .select('rating')
          .eq('reviewer_id', freelancerId);
        
        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError);
        }
        
        // Calculate average rating
        let rating = null;
        if (reviews && reviews.length > 0) {
          const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
          rating = sum / reviews.length;
        }
        
        setProfile({
          id: freelancerId,
          email: email,
          verified: verificationData || false,
          email_verified: userData?.email_confirmed || false,
          first_name: firstName,
          last_name: lastName,
          display_name: displayName,
          phone_number: phoneNumber,
          job_title: jobTitle,
          location: location,
          bio: bio,
          skills: skills,
          profile_photo: userMetadata.avatar_url,
          rating: rating,
          reviews_count: reviews?.length || 0,
          member_since: userData?.user?.created_at || userMetadata.created_at,
          jobs_completed: userMetadata.jobs_completed || 0
        });
      } catch (error: any) {
        console.error('Error fetching freelancer profile:', error);
        toast({
          title: 'Error loading profile',
          description: error.message || 'Could not load freelancer profile',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFreelancerProfile();
  }, [freelancerId, toast]);

  return { profile, isLoading };
};
