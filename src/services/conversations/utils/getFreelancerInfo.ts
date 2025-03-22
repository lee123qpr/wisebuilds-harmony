
import { supabase } from '@/integrations/supabase/client';

export async function getFreelancerInfo(freelancerId: string) {
  try {
    // Get freelancer profile information
    const { data: freelancer, error: profileError } = await supabase
      .from('freelancer_profiles')
      .select(`
        id,
        first_name,
        last_name,
        display_name,
        profile_photo,
        job_title,
        rating
      `)
      .eq('id', freelancerId)
      .maybeSingle();

    if (profileError) throw profileError;

    // Check if freelancer is verified
    const { data: isVerified, error: verificationError } = await supabase
      .rpc('is_user_verified', { check_user_id: freelancerId });

    if (verificationError) throw verificationError;

    return {
      id: freelancer?.id,
      name: freelancer?.display_name || `${freelancer?.first_name} ${freelancer?.last_name}`,
      profilePhoto: freelancer?.profile_photo,
      jobTitle: freelancer?.job_title,
      rating: freelancer?.rating,
      isVerified: isVerified || false
    };
  } catch (error) {
    console.error('Error getting freelancer info:', error);
    return {
      id: freelancerId,
      name: 'Unknown Freelancer',
      profilePhoto: null,
      jobTitle: null,
      rating: null,
      isVerified: false
    };
  }
}
