
import { supabase } from '@/integrations/supabase/client';

/**
 * Gets freelancer information from freelancer_profiles or auth user data
 */
export const getFreelancerInfo = async (freelancerId: string) => {
  // Try to get freelancer info from freelancer_profiles
  const { data: freelancerProfile, error: freelancerError } = await supabase
    .from('freelancer_profiles')
    .select('full_name, business_name, profile_image, phone_number, email')
    .eq('id', freelancerId)
    .maybeSingle();
  
  if (freelancerError) {
    console.error('Error fetching freelancer profile:', freelancerError);
  }
  
  // If profile exists with essential data, return it
  if (freelancerProfile && freelancerProfile.full_name) {
    return freelancerProfile;
  }
  
  // If no complete profile, try to get user data from auth using edge function
  try {
    const { data: userData, error: userError } = await supabase.functions.invoke(
      'get-user-email',
      {
        body: { userId: freelancerId }
      }
    );
    
    if (userError || !userData) {
      console.error('Error fetching user data from edge function:', userError);
      
      // If we have partial freelancer profile data (but no full_name), use that
      if (freelancerProfile) {
        return {
          full_name: 'Unknown Freelancer',
          business_name: freelancerProfile.business_name,
          profile_image: freelancerProfile.profile_image,
          phone_number: freelancerProfile.phone_number,
          email: freelancerProfile.email
        };
      }
      
      // No data available at all
      return {
        full_name: 'Unknown Freelancer',
        business_name: null,
        profile_image: null,
        email: null
      };
    }
    
    // Combine data from both sources
    return {
      full_name: userData.full_name || (userData.email ? userData.email.split('@')[0] : 'Unknown Freelancer'),
      business_name: freelancerProfile?.business_name || null,
      profile_image: freelancerProfile?.profile_image || null,
      phone_number: freelancerProfile?.phone_number || null,
      email: userData.email || null
    };
  } catch (error) {
    console.error('Error calling edge function:', error);
    
    // If we have partial freelancer profile data, use that
    if (freelancerProfile) {
      return {
        full_name: freelancerProfile.full_name || 'Unknown Freelancer',
        business_name: freelancerProfile.business_name,
        profile_image: freelancerProfile.profile_image,
        phone_number: freelancerProfile.phone_number,
        email: freelancerProfile.email
      };
    }
    
    // No data available at all
    return {
      full_name: 'Unknown Freelancer',
      business_name: null,
      profile_image: null,
      email: null
    };
  }
};
