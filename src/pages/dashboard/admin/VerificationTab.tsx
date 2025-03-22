
import React, { useState } from 'react';
import VerificationList from './components/verification/VerificationList';
import VerificationDetailDialog from './components/verification/VerificationDetailDialog';
import { useVerifications } from './hooks/useVerifications';
import { Verification } from './hooks/useVerifications';

const VerificationTab = () => {
  const {
    verifications,
    loading: isLoading,
    error,
    refreshVerifications
  } = useVerifications();
  
  // Add missing state for detail dialog
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Add missing functions
  const viewDocument = (verification: Verification) => {
    setSelectedVerification(verification);
    setAdminNotes(verification.admin_notes || '');
    // In a real implementation, we'd get the document URL
    setDocumentUrl(`/api/documents/${verification.document_path}`);
    setDialogOpen(true);
  };
  
  const updateVerificationStatus = async (status: 'approved' | 'rejected') => {
    if (!selectedVerification) return;
    
    setIsUpdating(true);
    try {
      // In a real implementation, we'd update the status via API
      console.log('Would update verification status to:', status);
      console.log('For verification:', selectedVerification.id);
      console.log('With admin notes:', adminNotes);
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Refresh data
      await refreshVerifications();
      setDialogOpen(false);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <VerificationList 
        verifications={verifications as any[]}
        isLoading={isLoading}
        onViewDocument={viewDocument}
      />

      <VerificationDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        verification={selectedVerification}
        documentUrl={documentUrl}
        adminNotes={adminNotes}
        onAdminNotesChange={setAdminNotes}
        isUpdating={isUpdating}
        onApprove={() => updateVerificationStatus('approved')}
        onReject={() => updateVerificationStatus('rejected')}
      />
    </>
  );
};

export default VerificationTab;
