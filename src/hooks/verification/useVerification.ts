
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { 
  fetchVerificationStatus, 
  uploadVerificationDocument as uploadDocument, 
  deleteVerificationDocument as deleteDocument 
} from './verificationService';
import type { VerificationData, UseVerificationResult } from './types';

export const useVerification = (): UseVerificationResult => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch verification status
  const refreshVerificationStatus = async () => {
    if (!user) return null;
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchVerificationStatus(user.id);
      setVerificationData(data);
      console.log('Refreshed verification status:', data);
      return data;
    } catch (err: any) {
      console.error('Error refreshing verification status:', err);
      setError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Upload ID document
  const handleUploadVerificationDocument = async (file: File) => {
    if (!user) {
      return {
        success: false,
        errorMessage: 'You must be logged in to upload documents.'
      };
    }
    
    setIsUploading(true);
    setError(null);
    try {
      console.log('Starting document upload for user:', user.id);
      const result = await uploadDocument(user.id, file);
      
      if (!result.success) {
        console.error('Upload failed with result:', result);
        return result;
      }
      
      console.log('Upload successful:', result);
      
      if (result.verificationData) {
        setVerificationData(result.verificationData);
      }
      
      return result;
    } catch (err: any) {
      console.error('Error uploading document:', err);
      setError(err);
      return {
        success: false,
        errorMessage: err.message || 'An unexpected error occurred'
      };
    } finally {
      setIsUploading(false);
    }
  };

  // Delete ID document
  const handleDeleteVerificationDocument = async () => {
    if (!user || !verificationData?.id_document_path) {
      return false;
    }
    
    setIsDeleting(true);
    setError(null);
    try {
      console.log('Deleting document for user:', user.id);
      const result = await deleteDocument(user.id, verificationData.id_document_path);
      
      if (!result.success) {
        console.error('Delete failed with result:', result);
        throw result.error || new Error('Delete failed');
      }
      
      console.log('Delete successful:', result);
      
      // Reset verification data
      await refreshVerificationStatus();
      
      return true;
    } catch (err: any) {
      console.error('Error deleting document:', err);
      setError(err);
      throw err;
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
    error,
    uploadVerificationDocument: handleUploadVerificationDocument,
    deleteVerificationDocument: handleDeleteVerificationDocument,
    refreshVerificationStatus
  };
};
