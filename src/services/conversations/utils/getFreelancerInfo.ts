
import { supabase } from '@/integrations/supabase/client';
import { FreelancerInfo } from '@/types/messaging';

/**
 * Gets freelancer information from auth user data
 */
export const getFreelancerInfo = async (freelancerId: string): Promise<FreelancerInfo> => {
  // We don't have a freelancer_profiles table, so we'll get data directly from auth
  try {
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
        business_name: null,
        profile_image: null,
        email: null
      };
    }
    
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
    
    // Return user data
    const metaData = userData.user_metadata || {};
    return {
      full_name: userData.full_name || (userData.email ? userData.email.split('@')[0] : 'Unknown Freelancer'),
      business_name: null,
      profile_image: metaData.avatar_url || null,
      phone_number: metaData.phone_number || metaData.phone || null,
      email: userData.email || null,
      email_verified: !!userData.email_confirmed,
      member_since: userData.user?.created_at || metaData.created_at || null,
      jobs_completed: metaData.jobs_completed || 0,
      rating,
      reviews_count: reviews?.length || 0,
      verified: !!verificationData
    };
  } catch (error) {
    console.error('Error calling edge function:', error);
    
    // No data available
    return {
      full_name: 'Unknown Freelancer',
      business_name: null,
      profile_image: null,
      email: null
    };
  }
};
