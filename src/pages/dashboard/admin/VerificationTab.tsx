
import React from 'react';
import VerificationList from './components/verification/VerificationList';
import VerificationDetailDialog from './components/verification/VerificationDetailDialog';
import { useVerifications } from './hooks/useVerifications';

const VerificationTab = () => {
  const {
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
  } = useVerifications();

  return (
    <>
      <VerificationList 
        verifications={verifications}
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
