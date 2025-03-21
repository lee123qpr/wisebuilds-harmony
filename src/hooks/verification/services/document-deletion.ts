
import { supabase } from '@/integrations/supabase/client';

// Delete ID document
export const deleteVerificationDocument = async (userId: string, documentPath: string): Promise<{
  success: boolean;
  error?: any;
}> => {
  try {
    console.log('Deleting document for user:', userId);
    
    // Delete the file from storage
    const { error: storageError } = await supabase.storage
      .from('verification_documents')
      .remove([documentPath]);
    
    if (storageError) {
      console.error('Error deleting document from storage:', storageError);
      throw storageError;
    }
    
    // Delete or update the verification record
    const { error: dbError } = await supabase
      .from('freelancer_verification')
      .delete()
      .eq('user_id', userId);
    
    if (dbError) {
      console.error('Error deleting verification record:', dbError);
      throw dbError;
    }
    
    return { 
      success: true
    };
  } catch (error) {
    console.error('Error deleting verification document:', error);
    return { success: false, error };
  }
};
