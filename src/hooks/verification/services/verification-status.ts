
import { supabase } from '@/integrations/supabase/client';
import { mapDatabaseStatusToVerificationStatus } from './status-utils';
import type { VerificationData } from '../types';

/**
 * Fetches verification status for a user
 */
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
    
    // Map database status to frontend status type with explicit string type to avoid recursion
    const status = mapDatabaseStatusToVerificationStatus(data.status as string);
    
    // Return typed verification data
    return {
      id: data.id,
      user_id: data.user_id,
      document_path: data.document_path,
      document_name: data.document_name,
      document_type: data.document_type,
      document_size: data.document_size,
      status: status,
      admin_notes: data.admin_notes,
      submitted_at: data.submitted_at,
      reviewed_at: data.reviewed_at
    };
  } catch (error) {
    console.error('Error in fetchVerificationStatus:', error);
    throw error;
  }
};
