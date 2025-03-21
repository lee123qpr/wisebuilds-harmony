
import { supabase } from '@/integrations/supabase/client';
import type { VerificationData } from '../types';
import type { VerificationStatus } from '@/components/dashboard/freelancer/VerificationBadge';

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
    
    // If no data found, return null
    if (!data) {
      return null;
    }
    
    // Ensure verification_status is a valid VerificationStatus type
    const verificationStatus = data.verification_status as VerificationStatus;
    
    // Return typed verification data
    return {
      id: data.id,
      user_id: data.user_id,
      id_document_path: data.id_document_path,
      verification_status: verificationStatus,
      admin_notes: data.admin_notes,
      submitted_at: data.submitted_at,
      verified_at: data.verified_at,
      verified_by: data.verified_by
    };
  } catch (error) {
    console.error('Error in fetchVerificationStatus:', error);
    throw error;
  }
};
