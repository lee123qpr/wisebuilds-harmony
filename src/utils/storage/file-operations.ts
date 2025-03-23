
import { supabase } from '@/integrations/supabase/client';
import { StorageBucket } from './constants';
import { generateFilePath } from './path-utils';
import { checkBucketExists, getActualAvatarBucket } from './bucket-utils';

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
