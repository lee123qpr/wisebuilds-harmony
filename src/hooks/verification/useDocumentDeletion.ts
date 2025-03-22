
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useVerification } from './useVerification';

export const useDocumentDeletion = (onDeleteSuccess?: () => void) => {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const { 
    deleteVerificationDocument = async () => false,
    isDeleting = false
  } = useVerification();
  const { toast } = useToast();

  const handleOpenDeleteConfirmation = () => {
    setConfirmDeleteOpen(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setConfirmDeleteOpen(false);
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
        
        // Call the success callback if provided
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
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

  return {
    confirmDeleteOpen,
    isDeleting,
    handleOpenDeleteConfirmation,
    handleCloseDeleteConfirmation,
    handleDelete
  };
};
