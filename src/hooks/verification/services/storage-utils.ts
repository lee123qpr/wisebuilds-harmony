
import { supabase } from '@/integrations/supabase/client';
import { StorageBucket } from '@/utils/storage';

/**
 * Get the name of the verification documents bucket
 */
export const getVerificationBucketName = async (): Promise<string> => {
  // First try the dedicated verification bucket
  const verificationBucket = StorageBucket.VERIFICATION;
  
  // Check if the bucket exists
  const { data, error } = await supabase.storage
    .from(verificationBucket)
    .list('', { limit: 1 });
  
  if (!error) {
    console.log(`Using dedicated verification bucket: ${verificationBucket}`);
    return verificationBucket;
  }
  
  // Fallback to avatars bucket which should always exist
  console.log(`Falling back to avatars bucket: ${StorageBucket.AVATARS}`);
  return StorageBucket.AVATARS;
};

/**
 * Generate a file path for verification documents
 */
export const generateVerificationFilePath = (userId: string, fileName: string): string => {
  const timestamp = new Date().getTime();
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.]/g, '_');
  return `${userId}/verification/${timestamp}_${cleanFileName}`;
};
