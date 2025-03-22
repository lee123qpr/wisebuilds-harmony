
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { MessageAttachment } from '@/types/messaging';
import { FileUploadParams } from './types';

/**
 * Upload a file for a message
 */
export const uploadMessageAttachment = async ({ file }: FileUploadParams): Promise<MessageAttachment | null> => {
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

    const bucketName = 'attachments';
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = fileName;
    
    console.log(`Uploading file: "${file.name}" (${file.size} bytes) to bucket "${bucketName}"`);
    
    // Upload the file directly without checking if bucket exists
    // (bucket should be pre-configured in Supabase)
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false // Change to true if you want to overwrite existing files
      });
    
    if (error) {
      console.error('Error uploading file:', error);
      console.error('Full error details:', JSON.stringify(error, null, 2));
      
      // Provide more specific error messages based on error code
      let errorMessage = error.message;
      if (error.message.includes('bucket')) {
        errorMessage = `Storage bucket "${bucketName}" is not configured.`;
      }
      
      toast({
        title: "Failed to upload file",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    }
    
    // Get the public URL for the file (getPublicUrl is synchronous)
    const publicUrl = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath).data.publicUrl;
    
    console.log('File uploaded successfully. Public URL:', publicUrl);
    
    return {
      id: filePath,
      name: file.name,
      size: file.size,
      type: file.type,
      url: publicUrl,
      path: filePath
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
