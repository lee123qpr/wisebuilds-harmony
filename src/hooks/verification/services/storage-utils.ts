
import { supabase } from '@/integrations/supabase/client';

/**
 * Determines which verification bucket to use
 */
export const getVerificationBucketName = async (): Promise<string> => {
  // Check available buckets
  const { data: bucketsData, error: bucketsError } = await supabase.storage
    .listBuckets();
  
  if (bucketsError) {
    console.error('Error checking buckets:', bucketsError);
  }
  
  console.log('Available buckets:', bucketsData ? bucketsData.map(b => b.name).join(', ') : 'none');
  
  // Check if verification_documents or verification-documents exists
  const bucketWithUnderscore = bucketsData?.find(b => b.name === 'verification_documents');
  const bucketWithHyphen = bucketsData?.find(b => b.name === 'verification-documents');
  
  console.log('Bucket with underscore exists:', !!bucketWithUnderscore);
  console.log('Bucket with hyphen exists:', !!bucketWithHyphen);
  
  // Return the correct bucket name
  return bucketWithUnderscore ? 'verification_documents' : 
         bucketWithHyphen ? 'verification-documents' : 'verification_documents';
};
