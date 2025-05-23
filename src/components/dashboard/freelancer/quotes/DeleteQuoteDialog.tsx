
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface DeleteQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
  isRetracting?: boolean;
}

const DeleteQuoteDialog: React.FC<DeleteQuoteDialogProps> = ({
  open,
  onOpenChange,
  onDelete,
  isDeleting,
  isRetracting = false,
}) => {
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    await onDelete();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isRetracting ? 'Retract this quote?' : 'Delete this quote?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove this quote from your dashboard. 
            This action cannot be undone.
            
            {isRetracting ? (
              <div className="mt-2 text-amber-600 font-medium">
                <p>Warning: The client will be notified that you have retracted this quote.</p>
                <p>The quote will be marked as declined in their dashboard.</p>
              </div>
            ) : (
              <div className="mt-2 text-amber-600 font-medium">
                Note: If the quote was already sent to a client, they will still be able to view it,
                but it will no longer appear in your dashboard.
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="w-24"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isRetracting ? 'Retracting...' : 'Deleting...'}
              </>
            ) : (
              isRetracting ? 'Retract' : 'Delete'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteQuoteDialog;
