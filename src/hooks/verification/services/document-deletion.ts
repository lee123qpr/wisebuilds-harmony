
import { supabase } from '@/integrations/supabase/client';
import { isUserFreelancer } from './user-verification';

// Delete verification document and reset status
export const deleteVerificationDocument = async (userId: string, documentPath: string): Promise<{
  success: boolean;
  error?: any;
}> => {
  try {
    // Check if user is a freelancer first
    const isFreelancer = await isUserFreelancer();
    if (!isFreelancer) {
      console.error('Only freelancers can manage verification documents');
      return { 
        success: false, 
        error: new Error('Only freelancers can manage verification documents') 
      };
    }
    
    console.log('Attempting to delete document:', documentPath);
    
    // Delete the file from storage
    const { error: deleteFileError } = await supabase.storage
      .from('id-documents')
      .remove([documentPath]);
    
    if (deleteFileError) {
      console.error('Error deleting file:', deleteFileError);
      throw deleteFileError;
    }
    
    console.log('File deleted successfully');
    
    // Update the verification record to reset status
    const { error: updateError } = await supabase
      .from('freelancer_verification')
      .update({
        id_document_path: null,
        verification_status: 'not_submitted',
        submitted_at: null,
        verified_at: null,
        admin_notes: null,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
    
    if (updateError) {
      console.error('Error updating verification record:', updateError);
      throw updateError;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting document:', error);
    return { success: false, error };
  }
};
