
import { useState } from 'react';
import { useVerification } from './useVerification';
import { useToast } from '@/hooks/use-toast';

export const useDocumentDeletion = (onClose: () => void) => {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const { deleteVerificationDocument, refreshVerificationStatus, isDeleting } = useVerification();
  const { toast } = useToast();

  const handleOpenDeleteConfirmation = () => {
    setConfirmDeleteOpen(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setConfirmDeleteOpen(false);
  };

  const handleDelete = async () => {
    try {
      console.log('Deleting verification document');
      const result = await deleteVerificationDocument();
      
      if (!result) {
        throw new Error("Failed to delete document");
      }
      
      toast({
        title: "Document deleted",
        description: "Your ID verification document has been deleted. You can submit a new one anytime.",
      });
      
      await refreshVerificationStatus();
      setConfirmDeleteOpen(false);
      onClose();
    } catch (error: any) {
      console.error('Error deleting document:', error);
      
      toast({
        title: "Delete failed",
        description: error.message || "There was an error deleting your document. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    confirmDeleteOpen,
    handleOpenDeleteConfirmation,
    handleCloseDeleteConfirmation,
    handleDelete
  };
};
