
import { supabase } from '@/integrations/supabase/client';

export async function getFreelancerInfo(freelancerId: string) {
  try {
    // Get freelancer profile information from the database table
    const { data: freelancer, error: profileError } = await supabase
      .from('freelancer_profiles')
      .select(`
        id,
        first_name,
        last_name,
        display_name,
        profile_photo,
        job_title,
        rating,
        location,
        member_since,
        jobs_completed,
        reviews_count,
        email,
        phone_number
      `)
      .eq('id', freelancerId)
      .maybeSingle();

    if (profileError) throw profileError;

    // Check if freelancer is verified
    const { data: isVerified, error: verificationError } = await supabase
      .rpc('is_user_verified', { check_user_id: freelancerId });

    if (verificationError) throw verificationError;

    // Return a comprehensive object with consistent property naming
    return {
      id: freelancer?.id,
      // Both camelCase and snake_case properties for backward compatibility
      name: freelancer?.display_name || `${freelancer?.first_name || ''} ${freelancer?.last_name || ''}`.trim() || 'Unknown Freelancer',
      full_name: freelancer?.display_name || `${freelancer?.first_name || ''} ${freelancer?.last_name || ''}`.trim() || 'Unknown Freelancer',
      profilePhoto: freelancer?.profile_photo,
      profile_image: freelancer?.profile_photo,
      jobTitle: freelancer?.job_title,
      job_title: freelancer?.job_title, // Add this for consistency
      rating: freelancer?.rating,
      isVerified: isVerified || false,
      verified: isVerified || false,
      location: freelancer?.location,
      member_since: freelancer?.member_since,
      jobs_completed: freelancer?.jobs_completed,
      reviews_count: freelancer?.reviews_count,
      email: freelancer?.email,
      phone_number: freelancer?.phone_number
    };
  } catch (error) {
    console.error('Error getting freelancer info:', error);
    return {
      id: freelancerId,
      name: 'Unknown Freelancer',
      full_name: 'Unknown Freelancer',
      profilePhoto: null,
      profile_image: null,
      jobTitle: null,
      job_title: null, // Add this for consistency
      rating: null,
      isVerified: false,
      verified: false
    };
  }
}
