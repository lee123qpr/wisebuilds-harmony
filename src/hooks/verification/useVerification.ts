
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { fetchVerificationStatus, uploadVerificationDocument } from './verificationService';
import type { VerificationData, UseVerificationResult } from './types';
import type { VerificationStatus } from '@/components/dashboard/freelancer/VerificationBadge';

export const useVerification = (): UseVerificationResult => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch verification status
  const refreshVerificationStatus = async () => {
    if (!user) return;

    setIsLoading(true);
    const data = await fetchVerificationStatus(user.id);
    if (data) {
      setVerificationData(data);
    }
    setIsLoading(false);
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

  // Initialize
  useEffect(() => {
    if (user) {
      refreshVerificationStatus();
    }
  }, [user]);

  return {
    verificationData,
    verificationStatus: verificationData?.verification_status || 'not_submitted',
    isVerified: verificationData?.verification_status === 'approved',
    isLoading,
    isUploading,
    uploadVerificationDocument: handleUploadVerificationDocument,
    refreshVerificationStatus
  };
};
