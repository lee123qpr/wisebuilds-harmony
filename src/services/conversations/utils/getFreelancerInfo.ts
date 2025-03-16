
import { supabase } from '@/integrations/supabase/client';

/**
 * Gets freelancer information from freelancer_profiles table
 */
export const getFreelancerInfo = async (freelancerId: string) => {
  try {
    // First try to get the freelancer profile from the database
    const { data: profileData, error: profileError } = await supabase
      .from('freelancer_profiles')
      .select('*')
      .eq('id', freelancerId)
      .maybeSingle();
    
    if (profileError) {
      console.error('Error fetching freelancer profile:', profileError);
    }
    
    // If we found a profile, return the data
    if (profileData) {
      return {
        full_name: profileData.display_name || 'Unknown Freelancer',
        business_name: null,
        profile_image: profileData.profile_photo || null,
        phone_number: profileData.phone_number || null,
        email: profileData.email || null
      };
    }
    
    // If no profile was found, fall back to the edge function as a last resort
    const { data: userData, error: userError } = await supabase.functions.invoke(
      'get-user-email',
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
    
    // Return user data
    return {
      full_name: userData.full_name || (userData.email ? userData.email.split('@')[0] : 'Unknown Freelancer'),
      business_name: null,
      profile_image: null,
      phone_number: null,
      email: userData.email || null
    };
  } catch (error) {
    console.error('Error getting freelancer info:', error);
    
    // No data available
    return {
      full_name: 'Unknown Freelancer',
      business_name: null,
      profile_image: null,
      email: null
    };
  }
};
