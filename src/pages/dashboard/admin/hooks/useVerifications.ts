
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Verification } from '../types';

export const useVerifications = () => {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  // Fetch all verification requests
  const fetchVerifications = async () => {
    setIsLoading(true);
    try {
      // Get verifications with user information
      const { data, error } = await supabase
        .from('freelancer_verification')
        .select(`
          *,
          user_email:user_id(email),
          user_full_name:user_id(user_metadata->full_name)
        `)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our Verification type
      const transformedData = data.map(item => ({
        ...item,
        user_email: item.user_email?.email,
        user_full_name: item.user_full_name?.user_metadata?.full_name || 'Unknown'
      }));
      
      setVerifications(transformedData as Verification[]);
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

  // Load verifications on component mount
  useEffect(() => {
    fetchVerifications();
  }, []);

  // View document handler
  const viewDocument = async (verification: Verification) => {
    setSelectedVerification(verification);
    setAdminNotes(verification.admin_notes || '');
    
    // Get document URL if there's a path
    if (verification.id_document_path) {
      try {
        const { data, error } = await supabase.storage
          .from('verification-documents')
          .createSignedUrl(verification.id_document_path, 60); // 1 minute expiry
        
        if (error) throw error;
        setDocumentUrl(data.signedUrl);
      } catch (error) {
        console.error('Error getting document URL:', error);
        setDocumentUrl(null);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load document. It may have been deleted or is no longer accessible.'
        });
      }
    } else {
      setDocumentUrl(null);
    }
    
    setDialogOpen(true);
  };

  // Update verification status handler
  const updateVerificationStatus = async (status: 'approved' | 'rejected') => {
    if (!selectedVerification) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('freelancer_verification')
        .update({
          verification_status: status,
          admin_notes: adminNotes,
          verified_at: new Date().toISOString(),
          // In a real app, you'd get the current admin user ID
          verified_by: (await supabase.auth.getSession()).data.session?.user.id
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
      
      // Send notification to the user
      await supabase.from('notifications')
        .insert({
          user_id: selectedVerification.user_id,
          type: 'verification_status',
          title: status === 'approved' ? 'Verification Approved' : 'Verification Rejected',
          description: status === 'approved' 
            ? 'Your ID verification has been approved.' 
            : `Your ID verification has been rejected. Reason: ${adminNotes || 'No reason provided.'}`,
          read: false
        })
        .select();
      
      // Close dialog
      setDialogOpen(false);
      
      toast({
        title: 'Success',
        description: `Verification ${status === 'approved' ? 'approved' : 'rejected'} successfully.`
      });
    } catch (error) {
      console.error('Error updating verification:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update verification status.'
      });
    } finally {
      setIsUpdating(false);
    }
  };

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
    updateVerificationStatus,
    refreshVerifications: fetchVerifications
  };
};
