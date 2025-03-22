
import { supabase } from '@/integrations/supabase/client';
import { UploadedFile } from '@/components/projects/file-upload/types';
import { generateFilePath } from '@/components/projects/file-upload/utils';

/**
 * Uploads a file to Supabase storage
 */
export const uploadFile = async (file: File, context: {
  projectId?: string;
  quoteId?: string;
  userId: string;
  userType?: string;
}): Promise<UploadedFile | null> => {
  try {
    // Generate appropriate file path with organized structure
    const filePath = generateFilePath(file, context);
    
    console.log(`Uploading file: ${file.name} to path: ${filePath}`);
    
    const { data, error } = await supabase.storage
      .from('project-documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }
    
    // Get the public URL for the file
    const { data: { publicUrl } } = supabase.storage
      .from('project-documents')
      .getPublicUrl(filePath);
    
    console.log('File uploaded successfully, publicUrl:', publicUrl);
    
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      url: publicUrl,
      path: filePath
    };
  } catch (error) {
    console.error('Error in uploadFile:', error);
    return null;
  }
};

/**
 * Removes a file from Supabase storage
 */
export const removeFileFromStorage = async (filePath: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from('project-documents')
      .remove([filePath]);
      
    if (error) {
      console.error('Error removing file:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in removeFileFromStorage:', error);
    return false;
  }
};
