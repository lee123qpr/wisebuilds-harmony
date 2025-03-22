
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks if a user is verified based on their verification document status
 * @param userId The ID of the user to check
 * @returns Promise resolving to boolean indicating verification status
 */
export const isUserVerified = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const { data, error } = await supabase.rpc('is_user_verified', { 
      check_user_id: userId 
    });
    
    if (error) {
      console.error('Error checking user verification status:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Exception checking user verification status:', error);
    return false;
  }
};

/**
 * Returns verification status for display in the UI
 */
export const getUserVerificationStatus = async (userId: string): Promise<'verified' | 'pending' | 'rejected' | 'not_submitted'> => {
  if (!userId) return 'not_submitted';
  
  try {
    const { data, error } = await supabase
      .from('freelancer_verification')
      .select('status')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching verification status:', error);
      return 'not_submitted';
    }
    
    return data?.status as 'verified' | 'pending' | 'rejected' | 'not_submitted' || 'not_submitted';
  } catch (error) {
    console.error('Exception fetching verification status:', error);
    return 'not_submitted';
  }
};
