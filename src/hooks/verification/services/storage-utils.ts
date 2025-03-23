
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

/**
 * Determines which avatar bucket to use
 */
export const getAvatarBucketName = async (): Promise<string | null> => {
  // Check available buckets
  const { data: bucketsData, error: bucketsError } = await supabase.storage
    .listBuckets();
  
  if (bucketsError) {
    console.error('Error checking buckets:', bucketsError);
    return null;
  }
  
  console.log('Available buckets for avatar:', bucketsData ? bucketsData.map(b => b.name).join(', ') : 'none');
  
  // Check for various possible avatar bucket names
  const possibleBucketNames = [
    'freelancer-avatar',
    'avatar',
    'avatars',
    'profile-images',
    'profile-photos',
    'user-avatars'
  ];
  
  for (const bucketName of possibleBucketNames) {
    if (bucketsData?.find(b => b.name === bucketName)) {
      console.log(`Found avatar bucket: ${bucketName}`);
      return bucketName;
    }
  }
  
  // If no specific avatar bucket found but we have buckets, return the first one as a fallback
  if (bucketsData && bucketsData.length > 0) {
    console.log(`No dedicated avatar bucket found, using first available bucket: ${bucketsData[0].name}`);
    return bucketsData[0].name;
  }
  
  console.error('No avatar bucket found among available buckets');
  return null;
};
