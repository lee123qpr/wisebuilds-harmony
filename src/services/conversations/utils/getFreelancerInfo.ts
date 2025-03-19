
import { supabase } from '@/integrations/supabase/client';
import { FreelancerInfo } from '@/types/messaging';

/**
 * Gets freelancer information from profile data, not auth metadata
 */
export const getFreelancerInfo = async (freelancerId: string): Promise<FreelancerInfo> => {
  try {
    // First try to get the profile from the freelancer_profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('freelancer_profiles')
      .select('*')
      .eq('id', freelancerId)
      .maybeSingle();
    
    if (profileError) {
      console.error('Error fetching freelancer profile:', profileError);
    }
    
    // If we found a profile, use that data
    if (profileData) {
      // Get verification status
      const { data: verificationData, error: verificationError } = await supabase
        .rpc('is_user_verified', { user_id: freelancerId });
      
      if (verificationError) {
        console.error('Error checking verification status:', verificationError);
      }
      
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
      
      return {
        full_name: profileData.display_name || `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
        profile_image: profileData.profile_photo || null,
        phone_number: profileData.phone_number || null,
        email: profileData.email || null,
        email_verified: false, // Default to false since not available in profile
        member_since: profileData.created_at || null,
        jobs_completed: profileData.jobs_completed || 0,
        rating: profileData.rating || rating,
        reviews_count: reviews?.length || 0,
        verified: !!verificationData,
        location: profileData.location || null
      };
    }
    
    // Fallback: Get minimal information using an edge function
    // This is in case the profile doesn't exist yet
    const { data: userData, error: userError } = await supabase.functions.invoke(
      'get-user-profile',
      {
        body: { userId: freelancerId }
      }
    );
    
    if (userError || !userData) {
      console.error('Error fetching user data from edge function:', userError);
      return {
        full_name: 'Unknown Freelancer',
        profile_image: null,
        email: null,
        location: null
      };
    }
    
    return {
      full_name: 'Unknown Freelancer',
      profile_image: null,
      email: userData.email || null,
      email_verified: !!userData.email_confirmed,
      member_since: null,
      jobs_completed: 0,
      rating: null,
      reviews_count: 0,
      verified: false,
      location: null
    };
  } catch (error) {
    console.error('Error calling edge function:', error);
    
    // No data available
    return {
      full_name: 'Unknown Freelancer',
      profile_image: null,
      email: null,
      location: null
    };
  }
};
