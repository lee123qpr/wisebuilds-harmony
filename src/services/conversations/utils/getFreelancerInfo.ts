
import { supabase } from '@/integrations/supabase/client';
import { FreelancerInfo } from '@/types/messaging';

/**
 * Gets freelancer information from auth user data
 */
export const getFreelancerInfo = async (freelancerId: string): Promise<FreelancerInfo> => {
  try {
    // First try to get data from freelancer_profiles table if it exists
    const { data: profileData, error: profileError } = await supabase
      .from('freelancer_profiles')
      .select('display_name, first_name, last_name, profile_photo, phone_number, email')
      .eq('id', freelancerId)
      .single();
    
    if (profileData && !profileError) {
      // Use profile data if available
      return {
        full_name: profileData.display_name || 
          (profileData.first_name && profileData.last_name 
            ? `${profileData.first_name} ${profileData.last_name}` 
            : 'Freelancer'),
        business_name: null,
        profile_image: profileData.profile_photo,
        phone_number: profileData.phone_number,
        email: profileData.email
      };
    }
    
    // If no profile data, get data from auth using the edge function
    const { data: userData, error: userError } = await supabase.functions.invoke(
      'get-user-profile',
      {
        body: { userId: freelancerId }
      }
    );
    
    if (userError || !userData) {
      console.error('Error fetching user data from edge function:', userError);
      return {
        full_name: 'Freelancer',
        business_name: null,
        profile_image: null,
        phone_number: null,
        email: null
      };
    }
    
    // Get name from user metadata if available
    const firstName = userData.user_metadata?.first_name;
    const lastName = userData.user_metadata?.last_name;
    const fullName = firstName && lastName 
      ? `${firstName} ${lastName}` 
      : (userData.email ? userData.email.split('@')[0] : 'Freelancer');
    
    // Return user data
    return {
      full_name: fullName,
      business_name: userData.user_metadata?.business_name || null,
      profile_image: userData.user_metadata?.avatar_url || null,
      phone_number: userData.user_metadata?.phone_number || null,
      email: userData.email || null
    };
  } catch (error) {
    console.error('Error calling edge function:', error);
    
    // No data available
    return {
      full_name: 'Freelancer',
      business_name: null,
      profile_image: null,
      phone_number: null,
      email: null
    };
  }
};
