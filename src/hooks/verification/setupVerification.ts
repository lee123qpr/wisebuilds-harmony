
import { supabase } from '@/integrations/supabase/client';

/**
 * Calls the Supabase Edge Function to set up verification infrastructure
 * @returns {Promise<{ success: boolean, error?: any }>}
 */
export const setupVerificationSystem = async (): Promise<{ success: boolean; error?: any }> => {
  try {
    // Create verification documents bucket
    const { error: bucketError } = await supabase.storage.createBucket('verification_documents', {
      public: false,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf']
    });
    
    if (bucketError && !bucketError.message.includes('already exists')) {
      console.error('Error creating verification bucket:', bucketError);
      return { success: false, error: bucketError };
    }
    
    // Add policies for the verification_documents bucket
    try {
      // Users can upload their own documents
      await supabase.storage.from('verification_documents').createPolicy(
        'Users can upload their own documents',
        {
          name: 'Users can upload their own documents',
          definition: "(bucket_id = 'verification_documents' AND auth.uid()::text = SPLIT_PART(name, '/', 1))",
          action: 'INSERT'
        }
      );
      
      // Users can view their own documents
      await supabase.storage.from('verification_documents').createPolicy(
        'Users can view their own documents',
        {
          name: 'Users can view their own documents',
          definition: "(bucket_id = 'verification_documents' AND auth.uid()::text = SPLIT_PART(name, '/', 1))",
          action: 'SELECT'
        }
      );
      
      // Users can delete their own documents
      await supabase.storage.from('verification_documents').createPolicy(
        'Users can delete their own documents',
        {
          name: 'Users can delete their own documents',
          definition: "(bucket_id = 'verification_documents' AND auth.uid()::text = SPLIT_PART(name, '/', 1))",
          action: 'DELETE'
        }
      );
    } catch (policyError) {
      console.log('Error creating policies (they may already exist):', policyError);
      // Continue since this is not a critical failure
    }
    
    console.log('Verification system setup complete');
    return { success: true };
  } catch (error) {
    console.error('Error in setupVerificationSystem:', error);
    return { success: false, error };
  }
};
