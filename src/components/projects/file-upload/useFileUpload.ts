
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { UploadedFile } from './types';
import { allowedFileTypes, isValidFile } from './utils';
import { useFileUploader } from './uploadUtils';
import { StorageBucket, removeFile } from '@/utils/storage';

export const useFileUpload = (
  initialFiles: UploadedFile[] = [],
  onFilesUploaded: (files: UploadedFile[]) => void,
  projectId?: string,
  quoteId?: string
) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(initialFiles);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();
  const { uploadFiles } = useFileUploader();

  const handleFileSelection = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      // Use the isValidFile function for more robust validation
      const isValid = isValidFile(file);
      if (!isValid) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an allowed file type`,
          variant: "destructive"
        });
      }
      return isValid;
    });
    
    setFiles(prevFiles => [...prevFiles, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const removeUploadedFile = (index: number) => {
    const fileToRemove = uploadedFiles[index];
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    
    setUploadedFiles(updatedFiles);
    onFilesUploaded(updatedFiles);
    
    if (fileToRemove.path) {
      removeFile(fileToRemove.path, StorageBucket.PROJECTS)
        .then(success => {
          if (!success) {
            console.error('Error removing file from storage:', fileToRemove.path);
            toast({
              title: "Error",
              description: `Failed to delete ${fileToRemove.name} from storage`,
              variant: "destructive"
            });
          }
        });
    }
  };

  const uploadSelectedFiles = async () => {
    if (!files.length || !user) {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to upload files",
          variant: "destructive"
        });
      }
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const totalFiles = files.length;
      let completedUploads = 0;
      
      const uploadedItems = await uploadFiles(files, {
        projectId,
        quoteId,
        userId: user.id,
        userType: user.user_metadata?.user_type
      });
      
      completedUploads = uploadedItems.length;
      setUploadProgress(100);
      
      const allUploadedFiles = [...uploadedFiles, ...uploadedItems];
      setUploadedFiles(allUploadedFiles);
      
      onFilesUploaded(allUploadedFiles);
      
      setFiles([]);
      
      if (uploadedItems.length > 0) {
        toast({
          title: "Files uploaded",
          description: `Successfully uploaded ${uploadedItems.length} file(s)`,
          variant: "default"
        });
      }
    } catch (error) {
      console.error('File upload error:', error);
      toast({
        title: "Upload failed",
        description: "An error occurred during file upload",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearAllFiles = () => {
    setFiles([]);
  };

  return {
    files,
    uploadedFiles,
    isUploading,
    uploadProgress,
    handleFileSelection,
    removeFile,
    removeUploadedFile,
    uploadSelectedFiles,
    clearAllFiles
  };
};
