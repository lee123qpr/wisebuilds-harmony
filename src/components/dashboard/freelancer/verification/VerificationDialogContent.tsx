
import React, { useEffect, useState } from 'react';
import { DialogContent } from '@/components/ui/dialog';
import { useVerification } from '@/hooks/verification';
import { useVerificationSetup } from '@/hooks/verification/useVerificationSetup';
import { useDocumentUpload } from '@/hooks/verification/useDocumentUpload';
import { useDocumentDeletion } from '@/hooks/verification/useDocumentDeletion';
import { checkIdDocumentsBucketAccess } from '@/hooks/verification/services/user-verification';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import VerificationDialogHeader from './dialog/VerificationDialogHeader';
import VerificationStatus from './dialog/VerificationStatus';
import VerificationDialogFooter from './dialog/VerificationDialogFooter';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface VerificationDialogContentProps {
  onClose: () => void;
  onBucketError?: () => void;
}

const VerificationDialogContent: React.FC<VerificationDialogContentProps> = ({ 
  onClose,
  onBucketError
}) => {
  const { 
    verificationStatus, 
    verificationData,
    isDeleting
  } = useVerification();
  
  const { setupComplete, isSettingUp, setupError } = useVerificationSetup();
  const [bucketAccessError, setBucketAccessError] = useState(false);
  
  const { 
    selectedFile, 
    isUploading, 
    handleFileSelection, 
    handleRemoveSelectedFile, 
    handleSubmit 
  } = useDocumentUpload(() => {
    // Success callback to close dialog after successful upload
    setTimeout(() => onClose(), 1500);
  });
  
  const { 
    confirmDeleteOpen, 
    handleOpenDeleteConfirmation, 
    handleCloseDeleteConfirmation, 
    handleDelete 
  } = useDocumentDeletion(() => {
    // Success callback to close dialog after successful deletion
    setTimeout(() => onClose(), 1500);
  });

  // Check if bucket is accessible
  useEffect(() => {
    const checkBucketAccess = async () => {
      if (setupComplete) {
        const hasAccess = await checkIdDocumentsBucketAccess();
        if (!hasAccess) {
          console.error('Failed to access storage bucket');
          setBucketAccessError(true);
          if (onBucketError) {
            onBucketError();
          }
        }
      }
    };
    
    checkBucketAccess();
  }, [setupComplete, onBucketError]);

  return (
    <DialogContent className="sm:max-w-[425px]">
      <VerificationDialogHeader />
      
      {bucketAccessError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Cannot access the document storage system. Please try again later or contact support.
          </AlertDescription>
        </Alert>
      )}
      
      {setupError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {setupError}
          </AlertDescription>
        </Alert>
      )}
      
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
        setupComplete={setupComplete && !bucketAccessError}
        isUploading={isUploading || isSettingUp}
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
