
import { supabase } from '@/integrations/supabase/client';

/**
 * Upload a file to a specified Supabase bucket
 * File path is constructed as userId/filename to comply with RLS policies
 */
export const uploadFile = async (
  file: File,
  userId: string,
  bucketName: string, 
  namePrefix: string = 'file'
): Promise<{ url: string; path: string } | null> => {
  try {
    if (!userId) {
      console.error('Error: userId is required for storage RLS policies');
      throw new Error('User ID is required for uploading files');
    }

    // Create unique file name with proper extension
    const fileExt = file.name.split('.').pop();
    const fileName = `${namePrefix.trim() || 'file'}-${Date.now()}.${fileExt}`;
    
    // Important: The path MUST start with the userId for RLS policies to work
    const filePath = `${userId}/${fileName}`;
    
    console.log(`Uploading to ${bucketName}, path: ${filePath}`);
    
    // Check if bucket exists before attempting upload
    const bucketExists = await checkBucketAccess(bucketName);
    if (!bucketExists) {
      console.warn(`Bucket ${bucketName} doesn't exist or is inaccessible`);
    }
    
    // Upload to specified bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, { 
        upsert: true,
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error('Error during upload:', uploadError);
      
      // Handle specific error cases 
      if (uploadError.message.includes('storage/object-not-found')) {
        throw new Error('Storage bucket not found. Please contact support.');
      } else if (uploadError.message.includes('permission denied') || uploadError.message.includes('access denied')) {
        throw new Error(`Permission denied: You can only upload to your own folder (${userId}/)`);
      } else if (uploadError.message.includes('not authorized')) {
        throw new Error('Authentication required: Please log in before uploading files');
      } else {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }
    }

    if (!uploadData) {
      console.error('Upload completed but no data returned');
      throw new Error('Upload completed but no file data was returned');
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
      
    console.log('File uploaded successfully to path:', filePath);
    return {
      url: publicUrl,
      path: filePath
    };
  } catch (error) {
    console.error('Error in uploadFile utility:', error);
    throw error; // Re-throw to handle in the component
  }
};

/**
 * Remove a file from a Supabase bucket
 */
export const removeFile = async (
  bucketName: string,
  filePath: string
): Promise<boolean> => {
  try {
    // Validate path
    if (!filePath.includes('/')) {
      console.error('Invalid file path:', filePath);
      throw new Error('Invalid file path format - must include user ID as first segment');
    }

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
      
    if (error) {
      console.error('Error removing file:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in removeFile utility:', error);
    return false;
  }
};

/**
 * Check if a bucket exists and is accessible
 */
export const checkBucketAccess = async (bucketName: string): Promise<boolean> => {
  try {
    // First check if user is authenticated
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      console.warn('User not authenticated, cannot check bucket access');
      return false;
    }
    
    // A simple way to check bucket access is to list files (with a limit of 0)
    // This will tell us if we have at least READ access
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list('', { limit: 1 });
    
    if (error) {
      console.error(`Error accessing bucket ${bucketName}:`, error);
      return false;
    }
    
    console.log(`Successfully verified access to bucket: ${bucketName}`);
    return true;
  } catch (error) {
    console.error(`Error checking bucket ${bucketName}:`, error);
    return false;
  }
};
