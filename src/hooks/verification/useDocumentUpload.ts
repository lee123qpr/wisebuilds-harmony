
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useVerification } from '.';
import { uploadVerificationDocument } from './services/document-upload';
import { useToast } from '@/hooks/use-toast';

export const useDocumentUpload = (onClose: () => void) => {
  const { user } = useAuth();
  const { refreshVerificationStatus } = useVerification();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelection = (file: File) => {
    console.log('File selected:', file.name);
    setSelectedFile(file);
  };

  const handleRemoveSelectedFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = async () => {
    if (!selectedFile || !user) {
      toast({
        title: "Missing information",
        description: selectedFile ? "Authentication required" : "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    console.log('Starting document upload...');
    console.log('Starting document upload for user:', user.id);

    try {
      const result = await uploadVerificationDocument(user.id, selectedFile);
      
      if (!result || !result.success) {
        console.error('Upload failed with result:', result);
        throw new Error(result?.error?.message || 'Failed to upload document');
      }

      // Refresh verification status to get the latest data
      await refreshVerificationStatus();
      
      toast({
        title: "Document uploaded successfully",
        description: "Your verification document has been submitted for review",
      });
      
      // Close the dialog
      onClose();
    } catch (error: any) {
      console.error('Error uploading document:', error);
      
      toast({
        title: "Upload failed",
        description: error.message || "There was a problem uploading your document. Please try again.",
        variant: "destructive"
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
