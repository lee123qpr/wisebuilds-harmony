
import { useState } from 'react';
import { useVerification } from './useVerification';
import { useToast } from '@/hooks/use-toast';

export const useDocumentUpload = (onClose: () => void) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { 
    uploadVerificationDocument, 
    refreshVerificationStatus, 
    isUploading,
    setupComplete
  } = useVerification();
  const { toast } = useToast();

  const handleFileSelection = (file: File) => {
    console.log('File selected:', file.name);
    setSelectedFile(file);
  };

  const handleRemoveSelectedFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = async () => {
    if (!selectedFile || !setupComplete) {
      toast({
        title: "Error",
        description: !setupComplete 
          ? "Verification system is not ready yet. Please try again later." 
          : "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Submitting document for verification:', selectedFile.name);
      
      const result = await uploadVerificationDocument(selectedFile);
      
      if (!result) {
        throw new Error("Upload failed. Please try again later.");
      }
      
      toast({
        title: "Document submitted",
        description: "Your ID document has been submitted for verification. This process usually takes 1-2 business days.",
      });
      
      setSelectedFile(null);
      await refreshVerificationStatus();
      onClose();
    } catch (error: any) {
      console.error('Error submitting document:', error);
      
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your document. Please try again.",
        variant: "destructive",
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
