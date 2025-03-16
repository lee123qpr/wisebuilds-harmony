
import { supabase } from '@/integrations/supabase/client';
import { FreelancerInfo } from '@/types/messaging';

/**
 * Gets freelancer information from freelancer_profiles table
 */
export const getFreelancerInfo = async (freelancerId: string): Promise<FreelancerInfo> => {
  try {
    // Get freelancer info from freelancer_profiles
    const { data: freelancerProfile, error: profileError } = await supabase
      .from('freelancer_profiles')
      .select('*')
      .eq('id', freelancerId)
      .maybeSingle();
    
    if (profileError) {
      console.error('Error fetching freelancer profile:', profileError);
    }
    
    // If profile exists, return it
    if (freelancerProfile) {
      return {
        name: freelancerProfile.display_name || 
              `${freelancerProfile.first_name || ''} ${freelancerProfile.last_name || ''}`.trim() || 
              'Unknown Freelancer',
        profile_photo: freelancerProfile.profile_photo || null,
        phone_number: freelancerProfile.phone_number || null,
        email: freelancerProfile.email || null,
        id: freelancerId
      };
    }
    
    // If no profile, try to get basic user info from auth
    try {
      const { data: userData, error: userError } = await supabase.functions.invoke(
        'get-user-email',
        {
          body: { userId: freelancerId }
        }
      );
      
      if (userError || !userData) {
        console.error('Error fetching user data:', userError || 'No user data returned');
        return {
          name: 'Unknown Freelancer',
          profile_photo: null,
          id: freelancerId
        };
      }
      
      return {
        name: userData.full_name || 'Unknown Freelancer',
        email: userData.email || null,
        profile_photo: null,
        id: freelancerId
      };
    } catch (error) {
      console.error('Error calling edge function:', error);
      return {
        name: 'Unknown Freelancer',
        profile_photo: null,
        id: freelancerId
      };
    }
  } catch (error) {
    console.error('Error in getFreelancerInfo:', error);
    return {
      name: 'Unknown Freelancer',
      profile_photo: null,
      id: freelancerId
    };
  }
};
