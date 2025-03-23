
import { supabase } from '@/integrations/supabase/client';

/**
 * Enum of available storage buckets
 */
export enum StorageBucket {
  PROJECTS = 'project-documents',
  ATTACHMENTS = 'attachments',
  AVATARS = 'avatar', // Changed to be more generic, will be resolved during runtime
  VERIFICATION = 'verification_documents'
}

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
    
    // Check possible avatar bucket names in order of preference
    const possibleBucketNames = [
      'freelancer-avatar',  // First choice
      'avatar',             // Second choice
      'avatars',            // Third choice
      'profile-images',     // Fourth choice
      'user-avatars'        // Fifth choice
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

/**
 * Generates a unique file path for uploads
 */
export const generateFilePath = (
  file: File,
  userId: string,
  bucket: string,
  folder?: string
): string => {
  const fileExt = file.name.split('.').pop() || '';
  const uniquePart = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
  
  // Create organized folder structure
  // Always start with userId for RLS policies to work correctly
  let basePath = `${userId}`;
  
  // Add optional folder if provided
  if (folder) {
    basePath += `/${folder}`;
  }
  
  return `${basePath}/${uniquePart}.${fileExt}`;
};

/**
 * Uploads a file to specified bucket
 */
export const uploadFile = async (
  file: File,
  userId: string,
  bucketName: string = StorageBucket.PROJECTS,
  folder?: string
): Promise<{ url: string; path: string } | null> => {
  try {
    // Verify the user is authenticated
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      throw new Error('Authentication required for file uploads');
    }
    
    // If using the AVATARS bucket, try to get the actual bucket name
    let actualBucketName = bucketName;
    if (bucketName === StorageBucket.AVATARS) {
      actualBucketName = await getActualAvatarBucket();
      console.log(`Using avatar bucket: ${actualBucketName}`);
    }
    
    // Generate file path
    const filePath = generateFilePath(file, userId, actualBucketName, folder);
    
    console.log(`Uploading file: ${file.name} to ${actualBucketName}/${filePath}`);
    
    // Check if bucket exists before attempting upload
    const bucketExists = await checkBucketExists(actualBucketName);
    if (!bucketExists) {
      console.error(`Bucket ${actualBucketName} does not exist or is not accessible`);
      const { data: bucketsData } = await supabase.storage.listBuckets();
      console.log('Available buckets:', bucketsData ? bucketsData.map(b => b.name).join(', ') : 'none');
      throw new Error(`Upload failed: Storage bucket '${actualBucketName}' is not available. Available buckets: ${bucketsData ? bucketsData.map(b => b.name).join(', ') : 'none'}`);
    }
    
    // Upload file
    const { data, error } = await supabase.storage
      .from(actualBucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
    
    if (!data || !data.path) {
      console.error('Upload successful but no data or path returned');
      throw new Error('Upload failed: No file path returned');
    }
    
    console.log('File uploaded successfully to path:', data.path);
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(actualBucketName)
      .getPublicUrl(data.path);
    
    console.log('Public URL generated:', publicUrl);
    
    return {
      url: publicUrl,
      path: data.path
    };
  } catch (error) {
    console.error('Error in uploadFile:', error);
    throw error; // Re-throw to handle in the component
  }
};

/**
 * Removes a file from storage
 */
export const removeFile = async (
  path: string,
  bucket: string
): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) {
      console.error('Error removing file:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in removeFile:', error);
    return false;
  }
};
