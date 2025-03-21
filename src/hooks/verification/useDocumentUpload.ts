
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useVerification } from './useVerification';

export const useDocumentUpload = (onClose?: () => void) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { uploadVerificationDocument, refreshVerificationStatus } = useVerification();

  const handleFileSelection = (file: File) => {
    setSelectedFile(file);
    console.log('File selected:', file.name);
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

    setIsUploading(true);
    
    try {
      console.log('Starting document upload...');
      const result = await uploadVerificationDocument(selectedFile);
      
      if (!result) {
        throw new Error('Upload failed - no result returned');
      }

      if (result === true || (typeof result === 'object' && result.success)) {
        console.log('Document upload succeeded');
        setSelectedFile(null);
        toast({
          title: 'Document uploaded',
          description: 'Your verification document has been submitted for review.',
        });
        
        // Refresh the verification status
        await refreshVerificationStatus();
        
        // Call onClose if provided
        if (onClose) {
          onClose();
        }
      } else {
        console.error('Document upload failed with result:', result);
        throw new Error('Upload failed');
      }
    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: error.message || 'There was an error uploading your document. Please try again.',
      });
    } finally {
      setIsUploading(false);
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
