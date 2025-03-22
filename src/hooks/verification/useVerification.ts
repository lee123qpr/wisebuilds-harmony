
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { 
  fetchVerificationStatus, 
  uploadVerificationDocument, 
  deleteVerificationDocument,
  setupVerification
} from './services';
import type { VerificationData, UseVerificationResult } from './types';
import type { VerificationStatus } from '@/components/dashboard/freelancer/VerificationBadge';

export const useVerification = (): UseVerificationResult => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize verification system
  const setupVerificationSystem = async () => {
    try {
      const result = await setupVerification();
      setIsSetupComplete(result.success);
      
      if (!result.success) {
        console.error('Failed to setup verification system:', result.message);
        setError(new Error(result.message));
      } else {
        console.log('Verification system setup complete');
      }
    } catch (error: any) {
      console.error('Error in setupVerificationSystem:', error);
      setIsSetupComplete(false);
      setError(error);
    }
  };

  // Fetch verification status
  const refreshVerificationStatus = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await fetchVerificationStatus();
      setVerificationData(data);
      console.log('Refreshed verification status:', data);
    } catch (error: any) {
      console.error('Error refreshing verification status:', error);
      setError(error);
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
      const result = await uploadVerificationDocument(file);
      
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
      setError(error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Delete ID document
  const handleDeleteVerificationDocument = async () => {
    if (!user || !verificationData?.document_path) return false;
    
    setIsDeleting(true);
    try {
      console.log('Deleting document for user:', user.id);
      const result = await deleteVerificationDocument();
      
      if (!result) {
        console.error('Delete failed');
        throw new Error('Delete failed');
      }
      
      console.log('Delete successful');
      
      // Reset verification data
      await refreshVerificationStatus();
      
      return true;
    } catch (error: any) {
      console.error('Error deleting document:', error);
      setError(error);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  // Initialize
  useEffect(() => {
    setupVerificationSystem();
    
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
    verificationStatus: verificationData?.status as VerificationStatus || 'not_submitted',
    isVerified: verificationData?.status === 'verified',
    isLoading,
    isUploading,
    isDeleting,
    setupComplete: isSetupComplete,
    error,
    uploadVerificationDocument: handleUploadVerificationDocument,
    deleteVerificationDocument: handleDeleteVerificationDocument,
    refreshVerificationStatus
  };
};
