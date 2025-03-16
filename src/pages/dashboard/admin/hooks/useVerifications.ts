
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Verification } from '../types';
import { mapStatusToVerificationStatus } from '@/hooks/verification/verificationService';

export const useVerifications = () => {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const { toast } = useToast();

  // Fetch all verifications
  const fetchVerifications = async () => {
    setIsLoading(true);
    try {
      // Fetch verifications
      const { data, error } = await supabase
        .from('freelancer_verification')
        .select('*')
        .order('submitted_at', { ascending: false });
      
      if (error) throw error;
      
      // Get user emails for each verification using the RPC function
      const enhancedData = await Promise.all(data.map(async (verification) => {
        // Use the RPC function to get user email
        const { data: emailData, error: emailError } = await supabase
          .rpc('get_user_email', { user_id: verification.user_id });

        if (emailError) console.error('Error fetching user email:', emailError);
        
        // Get user metadata from session if possible
        // This is a fallback approach that won't query the auth.users table directly
        let fullName = 'Unknown';
        try {
          const { data: userSession } = await supabase.auth.getUser(verification.user_id);
          if (userSession?.user?.user_metadata?.full_name) {
            fullName = userSession.user.user_metadata.full_name;
          }
        } catch (metaError) {
          console.error('Error getting user metadata:', metaError);
        }
        
        return {
          ...verification,
          user_email: emailData?.[0]?.email || 'Unknown',
          user_full_name: fullName,
          verification_status: mapStatusToVerificationStatus(verification.verification_status)
        };
      }));
      
      setVerifications(enhancedData);
    } catch (error) {
      console.error('Error fetching verifications:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load verification requests.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // View document
  const viewDocument = async (verification: Verification) => {
    setSelectedVerification(verification);
    setAdminNotes(verification.admin_notes || '');
    
    try {
      if (verification.id_document_path) {
        // Generate a signed URL for the document (privately accessible)
        const { data, error } = await supabase.storage
          .from('id-documents')
          .createSignedUrl(verification.id_document_path, 60 * 60); // Valid for 1 hour
        
        if (error) throw error;
        
        setDocumentUrl(data.signedUrl);
      } else {
        setDocumentUrl(null);
      }
      
      setDialogOpen(true);
    } catch (error) {
      console.error('Error getting document URL:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load document.'
      });
    }
  };

  // Update verification status
  const updateVerificationStatus = async (status: 'approved' | 'rejected') => {
    if (!selectedVerification) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('freelancer_verification')
        .update({
          verification_status: status,
          verified_at: new Date().toISOString(),
          verified_by: (await supabase.auth.getUser()).data.user?.id,
          admin_notes: adminNotes
        })
        .eq('id', selectedVerification.id);
      
      if (error) throw error;
      
      // Update local state
      setVerifications(prev => 
        prev.map(v => 
          v.id === selectedVerification.id 
            ? { ...v, verification_status: status, admin_notes: adminNotes } 
            : v
        )
      );
      
      toast({
        title: `Verification ${status === 'approved' ? 'Approved' : 'Rejected'}`,
        description: `The verification request has been ${status}.`
      });
      
      setDialogOpen(false);
    } catch (error) {
      console.error(`Error ${status} verification:`, error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to ${status} verification.`
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Initialize
  useEffect(() => {
    fetchVerifications();
  }, []);

  return {
    verifications,
    isLoading,
    selectedVerification,
    dialogOpen,
    setDialogOpen,
    documentUrl,
    adminNotes,
    setAdminNotes,
    isUpdating,
    viewDocument,
    updateVerificationStatus
  };
};
