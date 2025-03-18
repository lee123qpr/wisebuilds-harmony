
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Verification } from '../types';
import { fetchAllVerifications, getUserInfoForVerification, updateVerification } from '../services/verificationService';
import { useDocumentPreview } from './useDocumentPreview';

export const useVerifications = () => {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const { documentUrl, loadDocumentUrl } = useDocumentPreview();

  // Fetch all verification requests
  const fetchVerifications = async () => {
    setIsLoading(true);
    try {
      // Get basic verification records
      const verificationRecords = await fetchAllVerifications();
      
      if (verificationRecords.length === 0) {
        setVerifications([]);
        setIsLoading(false);
        return;
      }
      
      // For each verification, fetch the user email and name from auth.users
      const enhancedData: Verification[] = await Promise.all(
        verificationRecords.map(async (item) => {
          try {
            const userInfo = await getUserInfoForVerification(item.user_id);
            return {
              ...item,
              ...userInfo
            };
          } catch (error) {
            console.error(`Error enhancing verification data for user ${item.user_id}:`, error);
            return {
              ...item,
              user_email: 'Error fetching',
              user_full_name: 'Unknown'
            };
          }
        })
      );
      
      console.log('Enhanced verification data:', enhancedData);
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
      await loadDocumentUrl(verification.id_document_path);
    }
    
    setDialogOpen(true);
  };

  // Update verification status handler
  const updateVerificationStatus = async (status: 'approved' | 'rejected') => {
    if (!selectedVerification) return;
    
    setIsUpdating(true);
    try {
      await updateVerification(selectedVerification.id, status, adminNotes);
      
      // Update local state
      setVerifications(prev => 
        prev.map(v => 
          v.id === selectedVerification.id 
            ? { ...v, verification_status: status, admin_notes: adminNotes } 
            : v
        )
      );
      
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
