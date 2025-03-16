
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useVerification } from './useVerification';

export const useDocumentUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { uploadVerificationDocument, refreshVerificationStatus } = useVerification();

  const handleSubmit = async (file: File) => {
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
      
      const result = await uploadVerificationDocument(file);
      
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
    isUploading,
    handleSubmit
  };
};

export default useDocumentUpload;
