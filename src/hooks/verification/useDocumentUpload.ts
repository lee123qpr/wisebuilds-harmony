
import { useState, useCallback } from 'react';
import { useVerification } from './useVerification';
import { useToast } from '@/hooks/use-toast';

export const useDocumentUpload = (onSuccess?: () => void) => {
  const { uploadVerificationDocument } = useVerification();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileSelection = useCallback((file: File) => {
    setSelectedFile(file);
  }, []);

  const handleRemoveSelectedFile = useCallback(() => {
    setSelectedFile(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selectedFile) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select a file to upload.',
      });
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadVerificationDocument(selectedFile);
      
      if (result) {
        toast({
          title: 'Document Submitted',
          description: 'Your verification document has been submitted successfully.',
        });
        
        setSelectedFile(null);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Failed to upload your document. Please try again.',
      });
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, uploadVerificationDocument, toast, onSuccess]);

  return {
    selectedFile,
    isUploading,
    handleFileSelection,
    handleRemoveSelectedFile,
    handleSubmit
  };
};
