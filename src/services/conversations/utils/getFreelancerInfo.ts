
import { supabase } from '@/integrations/supabase/client';
import { FreelancerInfo } from '@/types/messaging';
import type { Json } from '@/integrations/supabase/types';

export const getFreelancerInfo = async (freelancerId: string): Promise<FreelancerInfo> => {
  try {
    // First, try to get data from freelancer_profiles
    const { data: profileData, error: profileError } = await supabase
      .from('freelancer_profiles')
      .select('*')
      .eq('id', freelancerId)
      .maybeSingle();
    
    // If no profile found, get basic user data from auth
    if (!profileData && freelancerId) {
      try {
        const { data: userData, error: userError } = await supabase.functions.invoke('get-user-email', {
          body: { userId: freelancerId }
        });
        
        if (userError || !userData) {
          return {
            id: freelancerId,
            display_name: 'Unknown Freelancer',
            email: null
          };
        }
        
        return {
          id: freelancerId,
          display_name: userData.full_name || (userData.email ? userData.email.split('@')[0] : 'Unknown Freelancer'),
          email: userData.email || null,
          member_since: userData.created_at
        };
      } catch (error) {
        console.error('Error calling edge function:', error);
        return {
          id: freelancerId,
          display_name: 'Unknown Freelancer',
          email: null
        };
      }
    }
    
    // If profile found, format and return
    return {
      id: freelancerId,
      display_name: profileData?.display_name || 
        (profileData?.first_name && profileData?.last_name ? 
          `${profileData.first_name} ${profileData.last_name}` : 'Unknown Freelancer'),
      profile_image: profileData?.profile_photo || null,
      email: profileData?.email || null,
      phone_number: profileData?.phone_number || null,
      member_since: profileData?.member_since || null,
      jobs_completed: profileData?.jobs_completed || 0,
      rating: profileData?.rating || null,
      reviews_count: profileData?.reviews_count || 0,
      email_verified: profileData?.id_verified || false
    };
  } catch (error) {
    console.error('Error getting freelancer info:', error);
    return {
      id: freelancerId,
      display_name: 'Unknown Freelancer'
    };
  }
};
