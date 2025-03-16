
import { supabase } from '@/integrations/supabase/client';

// Check if current user is a freelancer
export const isUserFreelancer = async (): Promise<boolean> => {
  try {
    // Get the current user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) return false;
    
    // First check user metadata for quick verification
    if (session.user.user_metadata?.user_type === 'freelancer') {
      return true;
    }
    
    // As a fallback, check if there's a client_profiles record for this user
    // If there is a client_profiles record, the user is not a freelancer
    const { data: clientProfile, error: clientError } = await supabase
      .from('client_profiles')
      .select('id')
      .eq('id', session.user.id)
      .single();
    
    if (clientError && clientError.code === 'PGRST116') {
      // No client profile found, this could be a freelancer
      // We should check for credit balance which is only for freelancers
      const { data: freelancerCredits } = await supabase
        .from('freelancer_credits')
        .select('credit_balance')
        .eq('user_id', session.user.id)
        .single();
        
      return !!freelancerCredits; // If credits exist, user is a freelancer
    }
    
    // If client profile exists, user is not a freelancer
    return !clientProfile;
  } catch (error) {
    console.error('Error checking user type:', error);
    return false;
  }
};
