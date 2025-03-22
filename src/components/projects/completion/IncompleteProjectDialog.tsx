
import React, { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';

interface IncompleteProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
  isProcessing: boolean;
  otherPartyLabel: string;
}

const IncompleteProjectDialog: React.FC<IncompleteProjectDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  isProcessing,
  otherPartyLabel,
}) => {
  const [reason, setReason] = useState('');
  
  const handleConfirm = () => {
    if (reason.trim().length > 0) {
      onConfirm(reason);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Mark Project as Incomplete
          </DialogTitle>
          <DialogDescription>
            Please provide a reason why you believe this project is not complete.
            This will notify the {otherPartyLabel} and mark your completion status as pending.
          </DialogDescription>
        </DialogHeader>
        
        <Alert className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Your feedback is important. Please be specific about what needs to be completed.
          </AlertDescription>
        </Alert>
        
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={`Example: "The final deliverables are missing..." or "We still need to finalize..."`}
          className="min-h-32"
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={isProcessing || reason.trim().length === 0}
            className="bg-red-600 hover:bg-red-700"
          >
            {isProcessing 
              ? 'Processing...' 
              : 'Mark as Incomplete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IncompleteProjectDialog;
