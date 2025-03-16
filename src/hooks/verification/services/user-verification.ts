
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
    
    // Check if there's a freelancer_credits record which only exists for freelancers
    const { data: freelancerCredits, error: creditsError } = await supabase
      .from('freelancer_credits')
      .select('credit_balance')
      .eq('user_id', session.user.id)
      .single();
      
    if (freelancerCredits) {
      return true;
    }
    
    // As a fallback, check if there's a client_profiles record
    // If there is a client_profiles record, the user is not a freelancer
    const { data: clientProfile, error: clientError } = await supabase
      .from('client_profiles')
      .select('id')
      .eq('id', session.user.id)
      .maybeSingle();
    
    // If no client profile exists, we need more verification
    // For now, we'll default to false unless explicitly identified as a freelancer above
    return !clientProfile && session.user.user_metadata?.user_type !== 'business';
    
  } catch (error) {
    console.error('Error checking user type:', error);
    return false;
  }
};
