
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import type { VerificationStatus } from '@/components/dashboard/freelancer/VerificationBadge';

interface VerificationData {
  id: string;
  user_id: string;
  verification_status: VerificationStatus;
  id_document_path: string | null;
  submitted_at: string | null;
  verified_at: string | null;
}

export const useVerification = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Converts database string status to our VerificationStatus type
  const mapStatusToVerificationStatus = (status: string): VerificationStatus => {
    if (status === 'pending' || status === 'approved' || status === 'rejected') {
      return status;
    }
    return 'not_submitted';
  };

  // Fetch verification status
  const fetchVerificationStatus = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('freelancer_verification')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching verification status:', error);
        throw error;
      }
      
      if (data) {
        setVerificationData({
          id: data.id,
          user_id: data.user_id,
          verification_status: mapStatusToVerificationStatus(data.verification_status),
          id_document_path: data.id_document_path,
          submitted_at: data.submitted_at,
          verified_at: data.verified_at
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Upload ID document
  const uploadVerificationDocument = async (file: File) => {
    if (!user) return null;
    
    setIsUploading(true);
    try {
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/id-document-${Date.now()}.${fileExt}`;
      
      // Upload the file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('id-documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the file path
      const filePath = uploadData?.path;
      
      // Check if verification record exists
      if (!verificationData) {
        // Create new verification record
        const { data, error } = await supabase
          .from('freelancer_verification')
          .insert({
            user_id: user.id,
            id_document_path: filePath,
            verification_status: 'pending'
          })
          .select()
          .single();
        
        if (error) throw error;
        
        setVerificationData({
          id: data.id,
          user_id: data.user_id,
          verification_status: mapStatusToVerificationStatus(data.verification_status),
          id_document_path: data.id_document_path,
          submitted_at: data.submitted_at,
          verified_at: data.verified_at
        });
      } else {
        // Update existing verification record
        const { data, error } = await supabase
          .from('freelancer_verification')
          .update({
            id_document_path: filePath,
            verification_status: 'pending',
            submitted_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .select()
          .single();
        
        if (error) throw error;
        
        setVerificationData({
          id: data.id,
          user_id: data.user_id,
          verification_status: mapStatusToVerificationStatus(data.verification_status),
          id_document_path: data.id_document_path,
          submitted_at: data.submitted_at,
          verified_at: data.verified_at
        });
      }
      
      toast({
        title: 'Document uploaded',
        description: 'Your ID document has been submitted for verification.',
      });
      
      return filePath;
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
      fetchVerificationStatus();
    }
  }, [user]);

  return {
    verificationData,
    verificationStatus: verificationData?.verification_status || 'not_submitted',
    isVerified: verificationData?.verification_status === 'approved',
    isLoading,
    isUploading,
    uploadVerificationDocument,
    refreshVerificationStatus: fetchVerificationStatus
  };
};
