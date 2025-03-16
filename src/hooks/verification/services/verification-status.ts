
import { supabase } from '@/integrations/supabase/client';
import type { VerificationData } from '../types';
import { mapStatusToVerificationStatus } from '../utils/status-utils';

// Fetch verification status
export const fetchVerificationStatus = async (userId: string): Promise<VerificationData | null> => {
  try {
    console.log('Fetching verification status for user:', userId);
    
    // Query the freelancer_verification table directly
    const { data, error } = await supabase
      .from('freelancer_verification')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching verification status:', error);
      // Don't throw the error, just log it and return null
      return null;
    }
    
    console.log('Verification data found:', data);
    
    if (data) {
      return {
        id: data.id,
        user_id: data.user_id,
        verification_status: mapStatusToVerificationStatus(data.verification_status),
        id_document_path: data.id_document_path,
        submitted_at: data.submitted_at,
        verified_at: data.verified_at,
        admin_notes: data.admin_notes
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error in fetchVerificationStatus:', error);
    return null;
  }
};
