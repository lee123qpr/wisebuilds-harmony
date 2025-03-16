import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { 
  fetchVerificationStatus, 
  uploadVerificationDocument, 
  deleteVerificationDocument 
} from './verificationService';
import type { VerificationData, UseVerificationResult } from './types';
import type { VerificationStatus } from '@/components/dashboard/freelancer/VerificationBadge';

export const useVerification = (): UseVerificationResult => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch verification status
  const refreshVerificationStatus = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await fetchVerificationStatus(user.id);
      setVerificationData(data);
    } catch (error) {
      console.error('Error refreshing verification status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Upload ID document
  const handleUploadVerificationDocument = async (file: File) => {
    if (!user) return null;
    
    setIsUploading(true);
    try {
      const result = await uploadVerificationDocument(user.id, file);
      
      if (!result.success) {
        throw result.error || new Error('Upload failed');
      }
      
      if (result.verificationData) {
        setVerificationData(result.verificationData);
      }
      
      toast({
        title: 'Document uploaded',
        description: 'Your ID document has been submitted for verification.',
      });
      
      return result.filePath || null;
    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: error.message || 'Failed to upload document. Please try again.',
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Delete ID document
  const handleDeleteVerificationDocument = async () => {
    if (!user || !verificationData?.id_document_path) return false;
    
    setIsDeleting(true);
    try {
      const result = await deleteVerificationDocument(user.id, verificationData.id_document_path);
      
      if (!result.success) {
        throw result.error || new Error('Delete failed');
      }
      
      // Reset verification data
      await refreshVerificationStatus();
      
      toast({
        title: 'Document deleted',
        description: 'Your ID document has been deleted and verification status reset.',
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting document:', error);
      toast({
        variant: 'destructive',
        title: 'Delete failed',
        description: error.message || 'Failed to delete document. Please try again.',
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  // Initialize
  useEffect(() => {
    if (user) {
      refreshVerificationStatus();
    } else {
      // If no user, reset the state
      setVerificationData(null);
      setIsLoading(false);
    }
  }, [user]);

  return {
    verificationData,
    verificationStatus: verificationData?.verification_status || 'not_submitted',
    isVerified: verificationData?.verification_status === 'approved',
    isLoading,
    isUploading,
    isDeleting,
    uploadVerificationDocument: handleUploadVerificationDocument,
    deleteVerificationDocument: handleDeleteVerificationDocument,
    refreshVerificationStatus
  };
};
