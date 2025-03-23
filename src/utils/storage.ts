
import { supabase } from '@/integrations/supabase/client';

/**
 * Enum of available storage buckets
 */
export enum StorageBucket {
  PROJECTS = 'project-documents',
  ATTACHMENTS = 'attachments',
  AVATARS = 'freelancer-avatar',  // Make sure this matches an existing bucket in Supabase
  VERIFICATION = 'verification_documents'
}

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
    
    console.log('Available buckets:', data.map(bucket => bucket.name).join(', '));
    return data.some(bucket => bucket.name === bucketName);
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
  bucket: StorageBucket,
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
  bucket: StorageBucket = StorageBucket.PROJECTS,
  folder?: string
): Promise<{ url: string; path: string } | null> => {
  try {
    // Verify the user is authenticated
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      throw new Error('Authentication required for file uploads');
    }
    
    // Generate file path
    const filePath = generateFilePath(file, userId, bucket, folder);
    
    console.log(`Uploading file: ${file.name} to ${bucket}/${filePath}`);
    
    // Check if bucket exists before attempting upload
    const bucketExists = await checkBucketExists(bucket);
    if (!bucketExists) {
      console.error(`Bucket ${bucket} does not exist or is not accessible`);
      const { data: bucketsData } = await supabase.storage.listBuckets();
      console.log('Available buckets:', bucketsData ? bucketsData.map(b => b.name).join(', ') : 'none');
      throw new Error(`Upload failed: Storage bucket '${bucket}' is not available. Available buckets: ${bucketsData ? bucketsData.map(b => b.name).join(', ') : 'none'}`);
    }
    
    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
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
      .from(bucket)
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
  bucket: StorageBucket
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
