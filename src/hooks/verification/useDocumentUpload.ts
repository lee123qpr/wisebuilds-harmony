
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
      
      // Determine the error message to show
      let errorMessage = 'An error occurred while uploading your document. Please try again.';
      
      // Check for specific error types
      if (typeof error === 'object' && error !== null) {
        const errorObj = error as any;
        
        // Check for permission errors
        if (errorObj.message?.includes('permission denied')) {
          errorMessage = 'Permission denied. Please ensure you are logged in as a freelancer.';
        }
        // Check for storage errors
        else if (errorObj.message?.includes('storage') || errorObj.statusCode === 400) {
          errorMessage = 'Storage error. Please ensure your file is below 5MB and in JPG, PNG, or PDF format.';
        }
        // Check for user type errors
        else if (errorObj.message?.includes('freelancer')) {
          errorMessage = 'Only freelancers can upload verification documents. Please ensure your account is set up correctly.';
        }
      }
      
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: errorMessage,
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
