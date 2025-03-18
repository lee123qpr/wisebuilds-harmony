
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Verification } from '../types';
import { 
  fetchAllVerifications, 
  getUserInfoForVerification, 
  getDocumentSignedUrl,
  updateVerification
} from '../services/verificationService';

export const useVerifications = () => {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const fetchVerifications = async () => {
    setIsLoading(true);
    try {
      // Fetch all verification records
      const verificationRecords = await fetchAllVerifications();
      
      if (!verificationRecords || verificationRecords.length === 0) {
        setVerifications([]);
        setIsLoading(false);
        return;
      }
      
      // For each verification, fetch the user info from freelancer_profiles instead of auth.users
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
      
      setVerifications(enhancedData);
    } catch (error) {
      console.error('Error fetching verifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load verification requests.',
        variant: 'destructive',
      });
      setVerifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const loadDocumentUrl = async (documentPath: string) => {
    if (!documentPath) {
      setDocumentUrl(null);
      return;
    }
    
    try {
      const url = await getDocumentSignedUrl(documentPath);
      setDocumentUrl(url);
    } catch (error) {
      console.error('Error loading document URL:', error);
      setDocumentUrl(null);
    }
  };

  const viewDocument = async (verification: Verification) => {
    setSelectedVerification(verification);
    setAdminNotes(verification.admin_notes || '');
    
    // Get document URL if there's a path
    if (verification.id_document_path) {
      await loadDocumentUrl(verification.id_document_path);
    }
    
    setDialogOpen(true);
  };

  const updateVerificationStatus = async (status: 'approved' | 'rejected') => {
    if (!selectedVerification) return;
    
    setIsUpdating(true);
    try {
      await updateVerification(selectedVerification.id, status, adminNotes);
      
      // Close dialog and refresh data
      setDialogOpen(false);
      await fetchVerifications();
      
      toast({
        title: 'Success',
        description: `Verification ${status === 'approved' ? 'approved' : 'rejected'} successfully.`,
      });
    } catch (error) {
      console.error('Error updating verification status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update verification status.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const refreshVerifications = () => {
    fetchVerifications();
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
    refreshVerifications
  };
};
