
import { supabase } from '@/integrations/supabase/client';
import { FreelancerInfo } from '@/types/messaging';

/**
 * Gets freelancer information from auth user data
 */
export const getFreelancerInfo = async (freelancerId: string): Promise<FreelancerInfo> => {
  // We don't have a freelancer_profiles table, so we'll get data directly from auth
  try {
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
