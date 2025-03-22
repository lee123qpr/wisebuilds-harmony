
import { supabase } from '@/integrations/supabase/client';
import { UploadedFile } from './types';
import { generateFilePath } from './utils';
import { useToast } from '@/hooks/use-toast';

export const useFileUploader = () => {
  const { toast } = useToast();

  const uploadFiles = async (
    files: File[],
    context: {
      projectId?: string;
      quoteId?: string;
      userId: string;
      userType?: string;
    }
  ): Promise<UploadedFile[]> => {
    if (!files.length) return [];
    
    const uploadedItems: UploadedFile[] = [];
    
    for (const file of files) {
      try {
        // Generate organized file path based on context
        const filePath = generateFilePath(file, context);
        
        console.log(`Uploading file to path: ${filePath}`);
        
        const { data, error } = await supabase.storage
          .from('project-documents')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (error) {
          console.error('Error uploading file:', error);
          toast({
            title: "Upload failed",
            description: `Failed to upload ${file.name}: ${error.message}`,
            variant: "destructive"
          });
        } else {
          // Get the public URL for the file
          const { data: { publicUrl } } = supabase.storage
            .from('project-documents')
            .getPublicUrl(data.path);
          
          uploadedItems.push({
            name: file.name,
            size: file.size,
            type: file.type,
            url: publicUrl,
            path: data.path
          });
        }
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
      }
    }
    
    return uploadedItems;
  };

  return { uploadFiles };
};
