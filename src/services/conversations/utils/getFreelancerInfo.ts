
import { supabase } from '@/integrations/supabase/client';
import { FreelancerInfo } from '@/types/messaging';

export const getFreelancerInfo = async (freelancerId: string): Promise<FreelancerInfo | null> => {
  try {
    // Get freelancer profile data
    const { data: freelancerData, error: freelancerError } = await supabase
      .from('freelancer_profiles')
      .select('*')
      .eq('id', freelancerId)
      .single();
    
    if (freelancerError) {
      console.error('Error fetching freelancer profile:', freelancerError);
      return null;
    }
    
    // Get user data including email from edge function
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/get-user-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.auth.getSession().then(res => res.data.session?.access_token)}`
      },
      body: JSON.stringify({ userId: freelancerId })
    });
    
    let userData = { email: null, email_confirmed: false, user_metadata: {} };
    
    if (response.ok) {
      userData = await response.json();
    } else {
      console.error('Error fetching user email:', await response.text());
    }
    
    // Extract required data
    const metaData = freelancerData || {};
    
    let rating = 0;
    if (metaData.rating) {
      rating = typeof metaData.rating === 'string' ? parseFloat(metaData.rating) : metaData.rating;
    }
    
    // Build FreelancerInfo object
    return {
      id: freelancerId,
      display_name: metaData.display_name || `${metaData.first_name || ''} ${metaData.last_name || ''}`.trim() || 'Freelancer',
      profile_image: metaData.avatar_url || null,
      phone_number: metaData.phone_number || metaData.phone || null,
      email: userData.email || null,
      email_verified: userData.email_confirmed || false,
      member_since: userData.user?.created_at || metaData.created_at || null,
      jobs_completed: metaData.jobs_completed || 0,
      rating,
      reviews_count: metaData.reviews_count || 0
    };
  } catch (error) {
    console.error('Error getting freelancer info:', error);
    return null;
  }
};
