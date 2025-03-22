
import { supabase } from '@/integrations/supabase/client';
import { getVerificationBucketName } from './storage-utils';

/**
 * Deletes verification document for a user
 */
export const deleteVerificationDocument = async (userId: string, documentPath: string): Promise<{
  success: boolean;
  error?: any;
}> => {
  try {
    console.log('Deleting document for user:', userId);
    
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
    
    // Delete the verification record
    const { error: dbError } = await supabase
      .from('freelancer_verification')
      .delete()
      .eq('user_id', userId);
    
    if (dbError) {
      console.error('Error deleting verification record:', dbError);
      throw dbError;
    }
    
    console.log('Successfully deleted verification record from database');
    
    return { 
      success: true
    };
  } catch (error) {
    console.error('Error deleting verification document:', error);
    return { success: false, error };
  }
};
