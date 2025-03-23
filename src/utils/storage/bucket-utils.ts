
import { supabase } from '@/integrations/supabase/client';
import { StorageBucket } from './constants';

/**
 * Gets the actual bucket name to use for avatars based on available buckets
 */
export const getActualAvatarBucket = async (): Promise<string> => {
  try {
    // Check available buckets
    const { data: bucketsData, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing buckets:', error);
      return StorageBucket.AVATARS; // Return default as fallback
    }
    
    console.log('Available buckets:', bucketsData?.map(b => b.name).join(', '));
    
    // Check if our primary avatar bucket exists
    if (bucketsData?.some(b => b.name === 'avatar')) {
      console.log('Found primary avatar bucket: avatar');
      return 'avatar';
    }
    
    // Check possible avatar bucket names in order of preference
    const possibleBucketNames = [
      'freelancer-avatar',  // First choice
      'avatars',            // Second choice
      'profile-images',     // Third choice
      'user-avatars'        // Fourth choice
    ];
    
    // Return the first bucket that exists
    for (const bucketName of possibleBucketNames) {
      if (bucketsData?.some(b => b.name === bucketName)) {
        console.log(`Found avatar bucket: ${bucketName}`);
        return bucketName;
      }
    }
    
    // If no avatar bucket found, log and return the first one as an attempt
    console.warn('No avatar bucket found, defaulting to first bucket in list');
    if (bucketsData && bucketsData.length > 0) {
      return bucketsData[0].name;
    }
    
    // Last resort, return the default value
    return StorageBucket.AVATARS;
    
  } catch (error) {
    console.error('Error getting avatar bucket:', error);
    return StorageBucket.AVATARS; // Return default as fallback
  }
};

/**
 * Checks if a bucket exists and is accessible
 */
export const checkBucketExists = async (bucketName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error checking buckets:', error);
      return false;
    }
    
    const bucketExists = data.some(bucket => bucket.name === bucketName);
    console.log(`Bucket ${bucketName} exists: ${bucketExists}`);
    console.log('Available buckets:', data.map(bucket => bucket.name).join(', '));
    
    return bucketExists;
  } catch (error) {
    console.error(`Error checking if bucket ${bucketName} exists:`, error);
    return false;
  }
};

/**
 * Ensures a bucket exists by checking and creating if needed
 * Note: This requires service_role access and should only be used in edge functions
 */
export const ensureBucketExists = async (bucketName: string, isPublic: boolean = false): Promise<boolean> => {
  try {
    // First check if bucket already exists
    const exists = await checkBucketExists(bucketName);
    if (exists) {
      return true;
    }
    
    // In client-side code, we can't create buckets directly
    console.error(`Bucket ${bucketName} doesn't exist. Please create it via Supabase SQL editor.`);
    return false;
  } catch (error) {
    console.error(`Error ensuring bucket ${bucketName} exists:`, error);
    return false;
  }
};
