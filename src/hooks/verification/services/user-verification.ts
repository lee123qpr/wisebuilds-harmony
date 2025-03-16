
import { supabase } from '@/integrations/supabase/client';

// Check if current user is a freelancer
export const isUserFreelancer = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    return user.user_metadata?.user_type === 'freelancer';
  } catch (error) {
    console.error('Error checking user type:', error);
    return false;
  }
};
