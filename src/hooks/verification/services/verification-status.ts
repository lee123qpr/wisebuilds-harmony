
import { supabase } from '@/integrations/supabase/client';
import type { VerificationData } from '../types';
import { mapStatusToVerificationStatus } from '../utils/status-utils';
import { isUserFreelancer } from './user-verification';

// Fetch verification status
export const fetchVerificationStatus = async (userId: string): Promise<VerificationData | null> => {
  try {
    console.log('Fetching verification status for user:', userId);
    
    // Check if user is a freelancer first
    const isFreelancer = await isUserFreelancer();
    if (!isFreelancer) {
      console.log('User is not a freelancer, verification not applicable');
      return null;
    }
    
    // Query the freelancer_verification table
    const { data, error } = await supabase
      .from('freelancer_verification')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching verification status:', error);
      throw error;
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
