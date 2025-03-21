
import { supabase } from '@/integrations/supabase/client';
import type { VerificationData } from '../types';
import { mapStatusToVerificationStatus } from '../utils/status-utils';
import { isUserFreelancer } from './user-verification';

// Delete ID document
export const deleteVerificationDocument = async (userId: string, documentPath: string): Promise<{
  success: boolean;
  error?: any;
}> => {
  try {
    // Check if user is a freelancer first
    const isFreelancer = await isUserFreelancer();
    if (!isFreelancer) {
      console.error('Only freelancers can delete verification documents');
      return { 
        success: false, 
        error: new Error('Only freelancers can delete verification documents') 
      };
    }
    
    console.log('Deleting document:', documentPath);
    
    // Delete the file from storage
    const { data: deleteData, error: deleteError } = await supabase.storage
      .from('verification_documents')
      .remove([documentPath]);
    
    if (deleteError) {
      console.error('Delete file error:', deleteError);
      throw deleteError;
    }
    
    console.log('File deleted successfully');
    
    // Reset the verification record
    const resetRecord = {
      user_id: userId,
      id_document_path: null,
      verification_status: 'not_submitted',
      admin_notes: null,
      verified_at: null,
      updated_at: new Date().toISOString()
    };
    
    const { error: updateError } = await supabase
      .from('freelancer_verification')
      .update(resetRecord)
      .eq('user_id', userId);
    
    if (updateError) {
      console.error('Reset verification record error:', updateError);
      throw updateError;
    }
    
    console.log('Verification record reset successfully');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting document:', error);
    return { success: false, error };
  }
};
