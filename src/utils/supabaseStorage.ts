
import { supabase } from '@/integrations/supabase/client';

/**
 * Upload a file to a specified Supabase bucket
 */
export const uploadFile = async (
  file: File,
  userId: string,
  bucketName: string, 
  namePrefix: string = 'file'
): Promise<{ url: string; path: string } | null> => {
  try {
    // Create unique file name with proper extension
    const fileExt = file.name.split('.').pop();
    const fileName = `${namePrefix.trim() || 'file'}-${Date.now()}.${fileExt}`;
    
    // Important: The path MUST start with the userId for RLS policies to work
    const filePath = `${userId}/${fileName}`;
    
    console.log(`Uploading to ${bucketName}, path: ${filePath}`);
    
    // Upload to specified bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, { 
        upsert: true,
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error('Error during upload:', uploadError);
      throw uploadError;
    }

    if (!uploadData) {
      console.error('Upload completed but no data returned');
      throw new Error('Upload completed but no file data was returned');
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
      
    return {
      url: publicUrl,
      path: filePath
    };
  } catch (error) {
    console.error('Error in uploadFile utility:', error);
    return null;
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
    const { data, error } = await supabase.storage.getBucket(bucketName);
    
    if (error) {
      console.error(`Error accessing bucket ${bucketName}:`, error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error(`Error checking bucket ${bucketName}:`, error);
    return false;
  }
};
