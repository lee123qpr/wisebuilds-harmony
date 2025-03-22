
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
  // Generate appropriate file path with organized structure
  const filePath = generateFilePath(file, context);
  
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
  
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    url: publicUrl,
    path: filePath
  };
};

/**
 * Removes a file from Supabase storage
 */
export const removeFileFromStorage = async (filePath: string): Promise<boolean> => {
  const { error } = await supabase.storage
    .from('project-documents')
    .remove([filePath]);
    
  if (error) {
    console.error('Error removing file:', error);
    return false;
  }
  
  return true;
};
