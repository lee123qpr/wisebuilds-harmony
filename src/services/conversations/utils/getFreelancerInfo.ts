
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
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
      },
      body: JSON.stringify({ userId: freelancerId })
    });
    
    let userData = { email: null, email_confirmed: false, user_metadata: {}, user: { created_at: null } };
    
    if (response.ok) {
      userData = await response.json();
    } else {
      console.error('Error fetching user email:', await response.text());
    }
    
    // Extract required data and handle potential undefined values
    const metaData = freelancerData || {};
    
    let rating = 0;
    if (metaData && typeof metaData === 'object' && 'rating' in metaData && metaData.rating !== null) {
      rating = typeof metaData.rating === 'string' ? parseFloat(metaData.rating) : Number(metaData.rating) || 0;
    }
    
    // Safely convert any value to string
    const safeString = (value: unknown): string | null => {
      if (value === null || value === undefined) return null;
      return String(value);
    };
    
    // Build FreelancerInfo object with safe property access
    return {
      id: freelancerId,
      display_name: metaData && typeof metaData === 'object' && 'display_name' in metaData ? safeString(metaData.display_name) : 
                    metaData && typeof metaData === 'object' && 'first_name' in metaData && 'last_name' in metaData ? 
                    `${safeString(metaData.first_name || '')} ${safeString(metaData.last_name || '')}`.trim() : 'Freelancer',
      profile_image: metaData && typeof metaData === 'object' && 'avatar_url' in metaData ? safeString(metaData.avatar_url) : null,
      phone_number: metaData && typeof metaData === 'object' ? 
                    ('phone_number' in metaData ? safeString(metaData.phone_number) : 
                    ('phone' in metaData ? safeString(metaData.phone) : null)) : null,
      email: userData.email || null,
      email_verified: userData.email_confirmed || false,
      member_since: userData && userData.user && userData.user.created_at ? safeString(userData.user.created_at) : 
                   metaData && typeof metaData === 'object' && 'created_at' in metaData ? safeString(metaData.created_at) : null,
      jobs_completed: metaData && typeof metaData === 'object' && 'jobs_completed' in metaData ? Number(metaData.jobs_completed) || 0 : 0,
      rating,
      reviews_count: metaData && typeof metaData === 'object' && 'reviews_count' in metaData ? Number(metaData.reviews_count) || 0 : 0
    };
  } catch (error) {
    console.error('Error getting freelancer info:', error);
    return null;
  }
};
