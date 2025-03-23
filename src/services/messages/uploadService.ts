import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { MessageAttachment } from '@/types/messaging';
import { FileUploadParams } from './types';
import { StorageBucket, uploadFile, checkBucketExists } from '@/utils/storage/index';

/**
 * Upload a file for a message
 */
export const uploadMessageAttachment = async ({ file, userId }: FileUploadParams): Promise<MessageAttachment | null> => {
  try {
    if (!file) {
      console.error('No file provided for upload.');
      toast({
        title: "Upload failed",
        description: "No file provided",
        variant: "destructive"
      });
      return null;
    }

    if (!userId) {
      console.error('User ID is required for uploads.');
      toast({
        title: "Upload failed",
        description: "User authentication required",
        variant: "destructive"
      });
      return null;
    }

    const bucketName = StorageBucket.ATTACHMENTS;
    
    // Check if bucket exists
    const bucketExists = await checkBucketExists(bucketName);
    if (!bucketExists) {
      console.error(`Storage bucket "${bucketName}" does not exist.`);
      toast({
        title: "Upload failed",
        description: `Storage bucket "${bucketName}" is not configured.`,
        variant: "destructive"
      });
      return null;
    }
    
    console.log(`Uploading file: "${file.name}" (${file.size} bytes) to bucket "${bucketName}"`);
    
    // Use the central upload utility
    const folder = 'messages';
    const result = await uploadFile(file, userId, bucketName, folder);
    
    if (!result) {
      toast({
        title: "Failed to upload file",
        description: "An error occurred during upload",
        variant: "destructive"
      });
      return null;
    }
    
    console.log('File uploaded successfully. Public URL:', result.url);
    
    return {
      id: result.path,
      name: file.name,
      size: file.size,
      type: file.type,
      url: result.url,
      path: result.path
    };
  } catch (e) {
    console.error('Unexpected error during file upload:', e);
    toast({
      title: "Failed to upload file",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};
