
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
      console.log('Fetching verification requests...');
      
      // Get verifications with user information
      const { data, error } = await supabase
        .from('freelancer_verification')
        .select('*');

      if (error) {
        console.error('Error fetching verification data:', error);
        throw error;
      }
      
      console.log('Found verification records:', data?.length || 0);
      
      if (!data || data.length === 0) {
        setVerifications([]);
        setIsLoading(false);
        return;
      }
      
      // For each verification, fetch the user email and name separately
      const enhancedData: Verification[] = await Promise.all(
        data.map(async (item) => {
          try {
            console.log('Fetching user data for:', item.user_id);
            // Get user data
            const { data: userData, error: userError } = await supabase
              .from('user_profiles')  // Try a profiles table first
              .select('email, full_name')
              .eq('user_id', item.user_id)
              .single();
            
            if (userError || !userData) {
              console.log('No profile found, fetching from auth.users');
              // Fallback to auth.users table
              const { data: authData } = await supabase.auth.admin.getUserById(
                item.user_id
              );
              
              if (!authData?.user) {
                console.error('User not found:', item.user_id);
                return {
                  ...item,
                  user_email: 'Unknown',
                  user_full_name: 'Unknown'
                };
              }
              
              return {
                ...item,
                user_email: authData.user.email || 'Unknown',
                user_full_name: authData.user.user_metadata?.full_name || 'Unknown'
              };
            }
            
            return {
              ...item,
              user_email: userData.email || 'Unknown',
              user_full_name: userData.full_name || 'Unknown'
            };
          } catch (error) {
            console.error('Error fetching user data:', error);
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
      try {
        console.log('Getting signed URL for:', verification.id_document_path);
        const { data, error } = await supabase.storage
          .from('id-documents')
          .createSignedUrl(verification.id_document_path, 60); // 1 minute expiry
        
        if (error) {
          console.error('Error creating signed URL:', error);
          throw error;
        }
        
        console.log('Signed URL created:', data.signedUrl);
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
      console.log('Updating verification status to:', status);
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
      
      if (error) {
        console.error('Error updating verification status:', error);
        throw error;
      }
      
      console.log('Verification status updated successfully');
      
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
