
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
  
  // Always check for the new 'avatar' bucket first (created by our migration)
  if (bucketsData?.find(b => b.name === 'avatar')) {
    console.log('Found primary avatar bucket: avatar');
    return 'avatar';
  }
  
  // Log available buckets for debugging
  const availableBuckets = bucketsData ? bucketsData.map(b => b.name).join(', ') : 'none';
  console.log('Available buckets for avatar:', availableBuckets);
  
  // Check for various possible avatar bucket names as fallbacks
  const possibleBucketNames = [
    'avatars',
    'freelancer-avatar',
    'profile-images',
    'profile-photos',
    'user-avatars',
    'project-documents'  // Fallback to any available bucket
  ];
  
  // Try to find a dedicated avatar bucket
  for (const bucketName of possibleBucketNames) {
    if (bucketsData?.find(b => b.name === bucketName)) {
      console.log(`Found avatar bucket: ${bucketName}`);
      return bucketName;
    }
  }
  
  // If no specific avatar bucket found but we have buckets, use the first one
  if (bucketsData && bucketsData.length > 0) {
    console.log(`No dedicated avatar bucket found, using first available bucket: ${bucketsData[0].name}`);
    return bucketsData[0].name;
  }
  
  console.error('No avatar bucket found among available buckets');
  return null;
};
