
import { supabase } from '@/integrations/supabase/client';
import type { VerificationData } from '../types';

export const fetchVerificationStatus = async (userId: string): Promise<VerificationData | null> => {
  try {
    console.log('Fetching verification status for user:', userId);
    
    // Instead of accessing the users table directly (which causes permission denied),
    // we'll just query the freelancer_verification table
    const { data, error } = await supabase
      .from('freelancer_verification')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching verification status:', error);
      throw error;
    }
    
    console.log('Verification data retrieved:', data);
    return data;
  } catch (error) {
    console.error('Error in fetchVerificationStatus:', error);
    throw error;
  }
};
