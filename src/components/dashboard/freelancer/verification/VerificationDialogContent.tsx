
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { setupVerificationSystem } from '@/hooks/verification/setupVerification';
import { useVerification } from '@/hooks/verification';
import { useToast } from '@/hooks/use-toast';
import DocumentUploadSection from './DocumentUploadSection';
import SubmittedDocumentInfo from './SubmittedDocumentInfo';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { VerificationStatus } from '../VerificationBadge';

interface VerificationDialogContentProps {
  onClose: () => void;
}

const VerificationDialogContent: React.FC<VerificationDialogContentProps> = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [setupComplete, setSetupComplete] = useState<boolean>(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const { 
    uploadVerificationDocument, 
    deleteVerificationDocument,
    isUploading, 
    isDeleting,
    verificationStatus, 
    verificationData,
    refreshVerificationStatus
  } = useVerification();
  const { toast } = useToast();

  // Run verification system setup on component mount
  useEffect(() => {
    const runSetup = async () => {
      const success = await setupVerificationSystem();
      setSetupComplete(success);
      if (!success) {
        toast({
          variant: 'destructive',
          title: 'Setup Error',
          description: 'There was a problem setting up the verification system. Please try again later.',
        });
      }
    };
    
    runSetup();
  }, [toast]);

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select a file to upload.',
      });
      return;
    }

    if (!setupComplete) {
      toast({
        variant: 'destructive',
        title: 'System not ready',
        description: 'Verification system is still setting up. Please try again in a moment.',
      });
      return;
    }

    console.log('Submitting file for verification:', selectedFile.name);
    const result = await uploadVerificationDocument(selectedFile);
    console.log('Upload result:', result);
    
    if (result) {
      setSelectedFile(null);
      onClose();
      
      // Refresh verification status after upload
      await refreshVerificationStatus();
    }
  };

  const handleDelete = async () => {
    const result = await deleteVerificationDocument();
    if (result) {
      setConfirmDeleteOpen(false);
      onClose();
    }
  };

  // Check if it's a new verification or rejected to allow resubmission
  const canSubmit = verificationStatus !== 'approved' && verificationStatus !== 'pending';
  // Document has been submitted but not approved yet, so can be deleted
  const canDelete = verificationStatus === 'pending' || verificationStatus === 'rejected';

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Identity Verification</DialogTitle>
        <DialogDescription>
          Upload a government-issued ID (passport, driver's license, or national ID card) to verify your identity.
          <span className="text-orange-500 font-medium block mt-1">
            Note: Must be a UK or Ireland issued document.
          </span>
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid gap-4 py-4">
        <p className="text-sm text-muted-foreground">
          Your document will be reviewed by our team. This process usually takes 1-2 business days.
        </p>
        
        {canSubmit && (
          <DocumentUploadSection 
            setupComplete={setupComplete}
            isUploading={isUploading}
            onFileSelected={setSelectedFile}
          />
        )}
        
        {canDelete && verificationData?.id_document_path && (
          <SubmittedDocumentInfo 
            verificationData={verificationData}
            isDeleting={isDeleting}
            onDelete={() => setConfirmDeleteOpen(true)}
          />
        )}
        
        {selectedFile && (
          <div className="text-sm">
            Selected file: <span className="font-medium">{selectedFile.name}</span>
          </div>
        )}
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose} disabled={isUploading || isDeleting}>
          Cancel
        </Button>
        {canSubmit && selectedFile && (
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedFile || isUploading || !setupComplete}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Submit for Verification'
            )}
          </Button>
        )}
      </DialogFooter>
      
      <DeleteConfirmationDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </DialogContent>
  );
};

export default VerificationDialogContent;
