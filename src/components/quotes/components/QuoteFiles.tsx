
import React, { useState } from 'react';
import { FormDescription, FormLabel } from '@/components/ui/form';
import { UploadedFile } from '@/components/projects/file-upload/types';
import { useToast } from '@/hooks/use-toast';
import FileDropzone from './file-upload/FileDropzone';
import UploadProgressBar from './file-upload/UploadProgressBar';
import FileList from './file-upload/FileList';
import { uploadFile, validateFile, removeFileFromStorage } from './file-upload/fileUtils';

interface QuoteFilesProps {
  quoteFiles: UploadedFile[];
  onQuoteFilesUploaded: (files: UploadedFile[]) => void;
}

const QuoteFiles: React.FC<QuoteFilesProps> = ({ quoteFiles, onQuoteFilesUploaded }) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;
    if (!newFiles || newFiles.length === 0) return;

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

    // Start upload process automatically
    setIsUploading(true);
    setUploadProgress(0);
    
    const uploadedItems: UploadedFile[] = [];
    let completedUploads = 0;
    
    for (const file of validFiles) {
      try {
        const uploadedFile = await uploadFile(file);
        
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
      setUploadProgress(Math.round((completedUploads / validFiles.length) * 100));
    }
    
    setIsUploading(false);
    
    // Combine with existing files
    const allUploadedFiles = [...quoteFiles, ...uploadedItems];
    onQuoteFilesUploaded(allUploadedFiles);
    
    if (uploadedItems.length > 0) {
      toast({
        title: "Files uploaded",
        description: `Successfully uploaded ${uploadedItems.length} file(s)`,
      });
    }
    
    // Clear the input so the same file can be selected again if needed
    event.target.value = '';
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

  return (
    <div className="space-y-4">
      <FormLabel>Quote Documents</FormLabel>
      
      <FileDropzone 
        isUploading={isUploading}
        onFileSelect={handleFileChange}
      />

      {isUploading && <UploadProgressBar progress={uploadProgress} />}

      <FileList 
        files={quoteFiles}
        onRemoveFile={removeFile}
      />

      <FormDescription>
        Upload any formal quote documents or additional terms
      </FormDescription>
    </div>
  );
};

export default QuoteFiles;
