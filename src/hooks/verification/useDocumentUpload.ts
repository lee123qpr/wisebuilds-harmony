
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useVerification } from './useVerification';

export const useDocumentUpload = (onSuccess?: () => void) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { uploadVerificationDocument, refreshVerificationStatus } = useVerification();

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
        description: 'Please select a file to upload',
      });
      return false;
    }

    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to upload documents.',
      });
      return false;
    }

    setIsUploading(true);
    try {
      console.log('Uploading document for user:', user.id);
      
      const result = await uploadVerificationDocument(selectedFile);
      
      // Check if result is not successful
      if (!result.success) {
        const errorMessage = result.errorMessage || 'Upload failed. Please try again.';
        console.error('Upload failed with result:', result);
        toast({
          variant: 'destructive',
          title: 'Upload failed',
          description: errorMessage,
        });
        return false;
      }
      
      console.log('Document uploaded successfully');
      
      // Refresh the verification status
      await refreshVerificationStatus();
      
      toast({
        title: 'Document Uploaded',
        description: 'Your document was uploaded successfully and is pending review.',
      });
      
      // Clear the selected file after successful upload
      setSelectedFile(null);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (error: any) {
      console.error('Error during document upload:', error);
      toast({
        variant: 'destructive',
        title: 'Upload Error',
        description: error.message || 'Failed to upload document. Please try again.',
      });
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    selectedFile,
    isUploading,
    handleSubmit,
    handleFileSelection,
    handleRemoveSelectedFile
  };
};

export default useDocumentUpload;
