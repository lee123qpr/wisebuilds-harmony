
import { useState } from 'react';
import { useVerification } from './useVerification';
import { useToast } from '@/hooks/use-toast';
import { StorageBucket, uploadFile } from '@/utils/storage';
import { supabase } from '@/integrations/supabase/client';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const VALID_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

export const useDocumentUpload = (onClose: () => void) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { 
    refreshVerificationStatus, 
    isUploading,
    setupComplete,
    verificationStatus,
    setVerificationState
  } = useVerification();
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB",
        variant: "destructive",
      });
      return false;
    }
    
    if (!VALID_TYPES.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG or PDF file",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleFileSelection = (file: File) => {
    console.log('File selected:', file.name);
    
    if (validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleRemoveSelectedFile = () => {
    setSelectedFile(null);
  };

  const setIsUploading = (loading: boolean) => {
    setVerificationState(prev => ({
      ...prev,
      isUploading: loading
    }));
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
      setIsUploading(true);
      
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        throw new Error('Authentication required: Please log in to upload verification documents');
      }
      
      const userId = session.session.user.id;
      
      const result = await uploadFile(
        selectedFile, 
        userId, 
        StorageBucket.VERIFICATION,
        'id-documents'
      );
      
      if (!result) {
        throw new Error('Failed to upload document. Please try again.');
      }
      
      const { error } = await supabase
        .from('freelancer_verification')
        .upsert({
          user_id: userId,
          document_path: result.path,
          document_name: selectedFile.name,
          document_size: selectedFile.size,
          document_type: selectedFile.type,
          status: 'pending',
          submitted_at: new Date().toISOString()
        });
      
      if (error) {
        throw new Error(`Database error: ${error.message}`);
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
