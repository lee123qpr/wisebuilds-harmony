
import { supabase } from '@/integrations/supabase/client';
import { getVerificationBucketName } from './storage-utils';

/**
 * Deletes verification document for a user
 */
export const deleteVerificationDocument = async (): Promise<{
  success: boolean;
  error?: any;
}> => {
  try {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return { 
        success: false, 
        error: new Error('Authentication required') 
      };
    }
    
    const userId = user.id;
    console.log('Deleting document for user:', userId);
    
    // Fetch the document path
    const { data: verificationData, error: fetchError } = await supabase
      .from('freelancer_verification')
      .select('document_path')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (fetchError || !verificationData?.document_path) {
      console.error('Error fetching document path:', fetchError);
      return { success: false, error: fetchError };
    }
    
    const documentPath = verificationData.document_path;
    
    // Determine which bucket to use
    const bucketName = await getVerificationBucketName();
    console.log(`Using bucket name for deletion: ${bucketName}`);
    
    // Try to delete the file
    const { error: storageError } = await supabase.storage
      .from(bucketName)
      .remove([documentPath]);
    
    if (storageError) {
      console.error('Error deleting document from storage:', storageError);
      // We'll continue with deleting the database record even if storage deletion fails
      console.log('Continuing with database record deletion despite storage error');
    } else {
      console.log('Successfully deleted document from storage');
    }
    
    // Update the verification record rather than deleting it
    const { error: dbError } = await supabase
      .from('freelancer_verification')
      .update({
        document_path: null,
        document_name: null,
        document_size: null,
        document_type: null,
        status: 'not_submitted',
        admin_notes: null,
        submitted_at: null,
        reviewed_at: null
      })
      .eq('user_id', userId);
    
    if (dbError) {
      console.error('Error updating verification record:', dbError);
      return { success: false, error: dbError };
    }
    
    console.log('Successfully updated verification record in database');
    
    return { 
      success: true
    };
  } catch (error) {
    console.error('Error deleting verification document:', error);
    return { success: false, error };
  }
};
