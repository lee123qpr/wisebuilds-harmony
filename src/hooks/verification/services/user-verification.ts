
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
    
    // As a fallback, check freelancer profiles table
    // This assumes you have a table for storing freelancer profiles
    const { data, error } = await supabase
      .from('freelancer_profiles')
      .select('id')
      .eq('user_id', session.user.id)
      .single();
    
    if (error) {
      console.log('Error checking freelancer profile:', error);
      // Fall back to metadata check again
      return session.user.user_metadata?.user_type === 'freelancer';
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking user type:', error);
    return false;
  }
};
