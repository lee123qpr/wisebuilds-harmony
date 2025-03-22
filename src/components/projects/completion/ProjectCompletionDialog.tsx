
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ProjectCompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isProcessing: boolean;
  otherPartyCompleted: boolean;
  otherPartyLabel: string;
}

const ProjectCompletionDialog: React.FC<ProjectCompletionDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  isProcessing,
  otherPartyCompleted,
  otherPartyLabel,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {otherPartyCompleted 
              ? 'Confirm Project Completion' 
              : 'Mark Project as Complete'}
          </DialogTitle>
          <DialogDescription>
            {otherPartyCompleted 
              ? `The ${otherPartyLabel} has marked this project as complete. By confirming, you agree that all work has been delivered satisfactorily.` 
              : `This will notify the ${otherPartyLabel} that you consider the project complete. The project will be marked as completed when both parties confirm.`}
          </DialogDescription>
        </DialogHeader>
        
        {otherPartyCompleted && (
          <Alert className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              After confirming completion, you'll be able to leave a review for the {otherPartyLabel}.
            </AlertDescription>
          </Alert>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={onConfirm} 
            disabled={isProcessing}
            className={otherPartyCompleted ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {isProcessing 
              ? 'Processing...' 
              : otherPartyCompleted 
                ? 'Confirm Completion' 
                : 'Mark as Complete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCompletionDialog;
