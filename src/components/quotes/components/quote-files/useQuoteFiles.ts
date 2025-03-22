
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { UploadedFile } from '@/components/projects/file-upload/types';
import { uploadFile, validateFile, removeFileFromStorage } from '../file-upload/fileUtils';

interface UseQuoteFilesProps {
  quoteFiles: UploadedFile[];
  onQuoteFilesUploaded: (files: UploadedFile[]) => void;
  projectId?: string;
  quoteId?: string;
}

export const useQuoteFiles = ({
  quoteFiles,
  onQuoteFilesUploaded,
  projectId,
  quoteId
}: UseQuoteFilesProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;
    if (!newFiles || newFiles.length === 0 || !user) {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to upload files",
          variant: "destructive"
        });
      }
      return;
    }

    // Filter out invalid file types
    const validFiles = Array.from(newFiles).filter(file => {
      const isValid = validateFile(file);
      if (!isValid) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an allowed file type`,
          variant: "destructive"
        });
      }
      return isValid;
    });

    if (validFiles.length === 0) return;

    // Add to selected files instead of uploading immediately
    setSelectedFiles(prev => [...prev, ...validFiles]);
    
    // Clear the input so the same file can be selected again if needed
    event.target.value = '';
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !user) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    const uploadedItems: UploadedFile[] = [];
    let completedUploads = 0;
    
    const uploadContext = {
      projectId,
      quoteId,
      userId: user.id,
      userType: user.user_metadata?.user_type
    };
    
    for (const file of selectedFiles) {
      try {
        const uploadedFile = await uploadFile(file, uploadContext);
        
        if (uploadedFile) {
          uploadedItems.push(uploadedFile);
        } else {
          toast({
            title: "Upload failed",
            description: `Failed to upload ${file.name}`,
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Exception during file upload:', error);
        toast({
          title: "Upload error",
          description: `An error occurred uploading ${file.name}`,
          variant: "destructive"
        });
      }
      
      completedUploads++;
      setUploadProgress(Math.round((completedUploads / selectedFiles.length) * 100));
    }
    
    setIsUploading(false);
    setSelectedFiles([]);
    
    // Combine with existing files
    const allUploadedFiles = [...quoteFiles, ...uploadedItems];
    onQuoteFilesUploaded(allUploadedFiles);
    
    if (uploadedItems.length > 0) {
      toast({
        title: "Files uploaded",
        description: `Successfully uploaded ${uploadedItems.length} file(s)`,
      });
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeFile = (index: number) => {
    const fileToRemove = quoteFiles[index];
    const updatedFiles = quoteFiles.filter((_, i) => i !== index);
    onQuoteFilesUploaded(updatedFiles);
    
    // Optionally delete from storage
    if (fileToRemove.path) {
      removeFileFromStorage(fileToRemove.path);
    }
  };

  return {
    isUploading,
    uploadProgress,
    selectedFiles,
    handleFileChange,
    handleUpload,
    removeSelectedFile,
    removeFile
  };
};
