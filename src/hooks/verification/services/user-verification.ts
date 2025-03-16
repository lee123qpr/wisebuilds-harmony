
import { supabase } from '@/integrations/supabase/client';

// Check if current user is a freelancer
export const isUserFreelancer = async (): Promise<boolean> => {
  try {
    // Get the current user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) return false;
    
    // Check user metadata for user_type
    return session.user.user_metadata?.user_type === 'freelancer';
  } catch (error) {
    console.error('Error checking user type:', error);
    return false;
  }
};
