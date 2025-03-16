
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { fetchVerificationStatus, uploadVerificationDocument, mapStatusToVerificationStatus } from './verificationService';
import type { VerificationData, UseVerificationResult, VerificationStatus } from './types';

export const useVerification = (): UseVerificationResult => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Fetch verification status
  const refreshVerificationStatus = async () => {
    if (!user) return;

    setIsLoading(true);
    setStatus('loading');
    try {
      const data = await fetchVerificationStatus(user.id);
      if (data) {
        setVerificationData(data);
      }
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setStatus('error');
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

  // Initialize
  useEffect(() => {
    if (user) {
      refreshVerificationStatus();
    }
  }, [user]);

  const verificationStatus: VerificationStatus = verificationData?.verification_status || 'not_submitted';
  const isVerified = verificationData?.verification_status === 'approved';

  return {
    verificationData,
    verificationStatus,
    isVerified,
    isLoading,
    isUploading,
    error,
    status,
    isSubmitting: isUploading,
    submitVerification: handleUploadVerificationDocument,
    uploadVerificationDocument: handleUploadVerificationDocument,
    refreshVerificationStatus
  };
};
