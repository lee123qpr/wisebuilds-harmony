
import { supabase } from '@/integrations/supabase/client';

// Check if current user is a freelancer
export const isUserFreelancer = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    // Check user_type from user metadata (client side)
    if (user.user_metadata?.user_type === 'freelancer') {
      return true;
    }
    
    // As a fallback, check if the user has a freelancer profile
    const { data: profile, error } = await supabase
      .from('freelancer_profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking freelancer profile:', error);
      return false;
    }
    
    return !!profile;
  } catch (error) {
    console.error('Error checking user type:', error);
    return false;
  }
};
