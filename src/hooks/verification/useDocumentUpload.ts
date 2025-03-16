
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useVerification } from './useVerification';

export const useDocumentUpload = (onUploadSuccess?: () => void) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { 
    uploadVerificationDocument, 
    isUploading,
    refreshVerificationStatus
  } = useVerification();
  const { toast } = useToast();

  const handleFileSelection = (file: File) => {
    setSelectedFile(file);
  };

  const handleRemoveSelectedFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select a file to upload.',
      });
      return;
    }

    console.log('Submitting file for verification:', selectedFile.name);
    try {
      const result = await uploadVerificationDocument(selectedFile);
      console.log('Upload result:', result);
      
      if (result) {
        setSelectedFile(null);
        toast({
          title: 'Document uploaded',
          description: 'Your ID document has been submitted for verification.',
        });
        
        // Refresh verification status after upload
        await refreshVerificationStatus();
        
        // Call the success callback if provided
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      }
    } catch (error) {
      console.error('Error during document upload:', error);
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'An error occurred while uploading your document. Please try again.',
      });
    }
  };

  return {
    selectedFile,
    isUploading,
    handleFileSelection,
    handleRemoveSelectedFile,
    handleSubmit
  };
};
