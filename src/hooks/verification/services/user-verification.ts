
import { supabase } from '@/integrations/supabase/client';

export const isUserFreelancer = async (): Promise<boolean> => {
  try {
    // Get the current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error('Error getting session or no session found:', sessionError);
      return false;
    }

    // Extract user_type from user metadata
    const userType = session.user.user_metadata?.user_type;
    
    if (!userType) {
      console.warn('No user_type found in user metadata');
      return false;
    }
    
    return userType === 'freelancer';
  } catch (error) {
    console.error('Error checking if user is a freelancer:', error);
    return false;
  }
};
