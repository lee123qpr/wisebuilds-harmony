
import React from 'react';
import { DialogContent } from '@/components/ui/dialog';
import { useVerification } from '@/hooks/verification';
import { useVerificationSetup } from '@/hooks/verification/useVerificationSetup';
import { useDocumentUpload } from '@/hooks/verification/useDocumentUpload';
import { useDocumentDeletion } from '@/hooks/verification/useDocumentDeletion';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import VerificationDialogHeader from './dialog/VerificationDialogHeader';
import VerificationStatus from './dialog/VerificationStatus';
import VerificationDialogFooter from './dialog/VerificationDialogFooter';

interface VerificationDialogContentProps {
  onClose: () => void;
}

const VerificationDialogContent: React.FC<VerificationDialogContentProps> = ({ onClose }) => {
  const { 
    verificationStatus, 
    verificationData,
    isDeleting = false
  } = useVerification();
  
  const { setupComplete } = useVerificationSetup();
  
  const { 
    selectedFile, 
    isUploading, 
    handleFileSelection, 
    handleRemoveSelectedFile, 
    handleSubmit 
  } = useDocumentUpload(onClose);
  
  const { 
    confirmDeleteOpen, 
    handleOpenDeleteConfirmation, 
    handleCloseDeleteConfirmation, 
    handleDelete 
  } = useDocumentDeletion(onClose);

  return (
    <DialogContent className="sm:max-w-[425px]">
      <VerificationDialogHeader />
      
      <VerificationStatus 
        verificationStatus={verificationStatus}
        verificationData={verificationData}
        setupComplete={setupComplete}
        isUploading={isUploading}
        isDeleting={isDeleting}
        selectedFile={selectedFile}
        onFileSelected={handleFileSelection}
        onRemoveFile={handleRemoveSelectedFile}
        onDelete={handleOpenDeleteConfirmation}
      />
      
      <VerificationDialogFooter 
        verificationStatus={verificationStatus}
        selectedFile={selectedFile}
        setupComplete={setupComplete}
        isUploading={isUploading}
        isDeleting={isDeleting}
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
      
      <DeleteConfirmationDialog
        open={confirmDeleteOpen}
        onOpenChange={handleCloseDeleteConfirmation}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </DialogContent>
  );
};

export default VerificationDialogContent;
