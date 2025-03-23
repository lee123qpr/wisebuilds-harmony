import { supabase } from '@/integrations/supabase/client';
import { UploadedFile } from './types';
import { generateFilePath } from './utils';
import { useToast } from '@/hooks/use-toast';
import { StorageBucket, uploadFile as storageUploadFile } from '@/utils/storage/index';

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
    const bucket = StorageBucket.PROJECTS;
    
    for (const file of files) {
      try {
        // Determine appropriate folder based on context
        let folder = '';
        if (context.quoteId) {
          folder = `quotes/${context.quoteId}`;
        } else if (context.projectId) {
          folder = `projects/${context.projectId}`;
        }
        
        // Use central upload utility
        const result = await storageUploadFile(file, context.userId, bucket, folder);
        
        if (!result) {
          toast({
            title: "Upload failed",
            description: `Failed to upload ${file.name}`,
            variant: "destructive"
          });
          continue;
        }
        
        uploadedItems.push({
          name: file.name,
          size: file.size,
          type: file.type,
          url: result.url,
          path: result.path
        });
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        toast({
          title: "Upload error",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive"
        });
      }
    }
    
    return uploadedItems;
  };

  return { uploadFiles };
};
