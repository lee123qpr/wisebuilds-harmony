
import { supabase } from '@/integrations/supabase/client';
import type { VerificationData } from '../types';
import type { VerificationStatus } from '@/components/dashboard/freelancer/VerificationBadge';

export const fetchVerificationStatus = async (userId: string): Promise<VerificationData | null> => {
  try {
    console.log('Fetching verification status for user:', userId);
    
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
    
    console.log('Verification data retrieved:', data);
    
    // If no data found, return null
    if (!data) {
      return null;
    }
    
    // Ensure status is a valid VerificationStatus type
    const verificationStatus = data.status as VerificationStatus;
    
    // Return typed verification data
    return {
      id: data.id,
      user_id: data.user_id,
      document_path: data.document_path,
      document_name: data.document_name,
      document_type: data.document_type,
      document_size: data.document_size,
      status: verificationStatus,
      admin_notes: data.admin_notes,
      submitted_at: data.submitted_at,
      reviewed_at: data.reviewed_at
    };
  } catch (error) {
    console.error('Error in fetchVerificationStatus:', error);
    throw error;
  }
};
