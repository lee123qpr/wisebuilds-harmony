
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

/**
 * Checks if the current user is a freelancer based on their metadata
 * @returns Promise resolving to boolean indicating freelancer status
 */
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
