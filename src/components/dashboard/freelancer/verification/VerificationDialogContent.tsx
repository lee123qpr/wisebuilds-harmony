
import React, { useState, useEffect } from 'react';
import { DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { setupVerificationSystem } from '@/hooks/verification/setupVerification';
import { useVerification } from '@/hooks/verification';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import VerificationDialogHeader from './dialog/VerificationDialogHeader';
import VerificationStatus from './dialog/VerificationStatus';
import VerificationDialogFooter from './dialog/VerificationDialogFooter';

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
    try {
      const result = await uploadVerificationDocument(selectedFile);
      console.log('Upload result:', result);
      
      if (result) {
        setSelectedFile(null);
        toast({
          title: 'Document uploaded',
          description: 'Your ID document has been submitted for verification.',
        });
        
        // Refresh verification status after upload
        await refreshVerificationStatus();
        
        // Close the dialog after successful upload
        onClose();
      }
    } catch (error) {
      console.error('Error during document upload:', error);
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'An error occurred while uploading your document. Please try again.',
      });
    }
  };

  const handleDelete = async () => {
    try {
      const result = await deleteVerificationDocument();
      if (result) {
        setConfirmDeleteOpen(false);
        toast({
          title: 'Document deleted',
          description: 'Your ID document has been deleted successfully.',
        });
        onClose();
      }
    } catch (error) {
      console.error('Error during document deletion:', error);
      toast({
        variant: 'destructive',
        title: 'Delete failed',
        description: 'An error occurred while deleting your document. Please try again.',
      });
    }
  };

  // Remove selected file before submission
  const handleRemoveSelectedFile = () => {
    setSelectedFile(null);
  };

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
        onFileSelected={setSelectedFile}
        onRemoveFile={handleRemoveSelectedFile}
        onDelete={() => setConfirmDeleteOpen(true)}
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
        onOpenChange={setConfirmDeleteOpen}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </DialogContent>
  );
};

export default VerificationDialogContent;
