
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
import { AlertCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
    isDeleting,
    error: verificationError
  } = useVerification();
  
  const { setupComplete, isSettingUp, setupError } = useVerificationSetup();
  const [bucketAccessError, setBucketAccessError] = useState(false);
  const [bucketChecked, setBucketChecked] = useState(false);
  const { toast } = useToast();
  
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
      if (setupComplete && !bucketChecked) {
        console.log('Checking bucket access...');
        try {
          const hasAccess = await checkIdDocumentsBucketAccess();
          console.log('Bucket access check result:', hasAccess);
          
          if (!hasAccess) {
            console.error('Failed to access storage bucket');
            setBucketAccessError(true);
            toast({
              variant: 'destructive',
              title: 'Storage access error',
              description: 'Cannot access document storage. Please try again later.'
            });
            if (onBucketError) {
              onBucketError();
            }
          }
          
          setBucketChecked(true);
        } catch (error) {
          console.error('Error checking bucket access:', error);
          setBucketAccessError(true);
          setBucketChecked(true);
          toast({
            variant: 'destructive',
            title: 'Storage access error',
            description: 'Error connecting to document storage system.'
          });
        }
      }
    };
    
    if (setupComplete && !bucketChecked) {
      checkBucketAccess();
    }
  }, [setupComplete, onBucketError, toast, bucketChecked]);

  // Display verification component even if bucket access fails
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
      
      {verificationError && !setupError && !bucketAccessError && (
        <Alert variant="warning">
          <Info className="h-4 w-4" />
          <AlertDescription>
            There was an issue loading your verification status. Some features may be limited.
          </AlertDescription>
        </Alert>
      )}
      
      {isSettingUp && (
        <div className="py-4">
          <p className="text-center text-sm text-muted-foreground">
            Setting up verification system...
          </p>
        </div>
      )}
      
      <VerificationStatus 
        verificationStatus={verificationStatus}
        verificationData={verificationData}
        setupComplete={setupComplete && !bucketAccessError}
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
