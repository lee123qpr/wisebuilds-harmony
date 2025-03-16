
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
    // If there is no client_profiles record but the user exists, then they are likely a freelancer
    const { data: clientProfile, error: clientError } = await supabase
      .from('client_profiles')
      .select('id')
      .eq('id', session.user.id)
      .single();
    
    if (clientError && clientError.code === 'PGRST116') {
      // No client profile found, check if user has verification records
      const { data: verificationData, error: verificationError } = await supabase
        .from('freelancer_verification')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle();
        
      if (!verificationError && verificationData) {
        return true;
      }
      
      // As a last resort, consider user without client profile to be a freelancer
      // This is a simplification - in a production app, you might check other tables
      return true;
    }
    
    // If client profile exists, user is not a freelancer
    return !clientProfile;
  } catch (error) {
    console.error('Error checking user type:', error);
    return false;
  }
};
