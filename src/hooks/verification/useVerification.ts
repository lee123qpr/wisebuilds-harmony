
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
    if (!user) return null;
    
    setIsLoading(true);
    try {
      const data = await fetchVerificationStatus(user.id);
      setVerificationData(data);
      console.log('Refreshed verification status:', data);
      return data;
    } catch (error) {
      console.error('Error refreshing verification status:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Upload ID document
  const handleUploadVerificationDocument = async (file: File) => {
    if (!user) return null;
    
    setIsUploading(true);
    try {
      console.log('Starting document upload for user:', user.id);
      const result = await uploadVerificationDocument(user.id, file);
      
      if (!result.success) {
        console.error('Upload failed with result:', result);
        throw result.error || new Error('Upload failed');
      }
      
      console.log('Upload successful:', result);
      
      if (result.verificationData) {
        setVerificationData(result.verificationData);
      }
      
      return result.filePath || true;
    } catch (error: any) {
      console.error('Error uploading document:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Delete ID document
  const handleDeleteVerificationDocument = async () => {
    if (!user || !verificationData?.id_document_path) return false;
    
    setIsDeleting(true);
    try {
      console.log('Deleting document for user:', user.id);
      const result = await deleteVerificationDocument(user.id, verificationData.id_document_path);
      
      if (!result.success) {
        console.error('Delete failed with result:', result);
        throw result.error || new Error('Delete failed');
      }
      
      console.log('Delete successful:', result);
      
      // Reset verification data
      await refreshVerificationStatus();
      
      return true;
    } catch (error: any) {
      console.error('Error deleting document:', error);
      throw error;
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
    isVerified: verificationData?.verification_status === 'verified',
    isLoading,
    isUploading,
    isDeleting,
    uploadVerificationDocument: handleUploadVerificationDocument,
    deleteVerificationDocument: handleDeleteVerificationDocument,
    refreshVerificationStatus
  };
};
