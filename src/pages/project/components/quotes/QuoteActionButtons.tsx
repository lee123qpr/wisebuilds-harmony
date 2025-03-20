import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';

interface QuoteActionButtonsProps {
  quoteStatus: string;
  freelancerId: string;
  onAccept: () => Promise<void>;
  onReject: () => Promise<void>;
  isAccepting: boolean;
  isRejecting: boolean;
}

const QuoteActionButtons: React.FC<QuoteActionButtonsProps> = ({
  quoteStatus,
  freelancerId,
  onAccept,
  onReject,
  isAccepting,
  isRejecting
}) => {
  const navigate = useNavigate();
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  
  if (quoteStatus !== 'pending') {
    return null;
  }

  // Handler for accepting a quote
  const handleAccept = async () => {
    try {
      console.log('Handling accept in QuoteActionButtons');
      await onAccept();
      console.log('Accept completed, closing dialog');
      setAcceptDialogOpen(false);
    } catch (error) {
      console.error('Error in handleAccept:', error);
      // Keep dialog open on error so user can try again
    }
  };

  // Handler for rejecting a quote
  const handleReject = async () => {
    try {
      console.log('Handling reject in QuoteActionButtons');
      await onReject();
      console.log('Reject completed, closing dialog');
      setRejectDialogOpen(false);
    } catch (error) {
      console.error('Error in handleReject:', error);
      // Keep dialog open on error
    }
  };

  // Handle navigating to messages with the freelancer
  const handleMessageFreelancer = () => {
    // Navigate to messages tab with the freelancer ID
    navigate(`/messages/${freelancerId}`);
    console.log(`Navigating to messages with freelancer ${freelancerId}`);
  };

  return (
    <div className="flex justify-end space-x-2 pt-2">
      <Button
        variant="outline"
        onClick={handleMessageFreelancer}
        className="flex items-center gap-2"
      >
        <MessageSquare className="h-4 w-4" />
        Message Freelancer
      </Button>
      
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive" className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Reject Quote
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Quote</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this quote? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject} 
              disabled={isRejecting}
            >
              {isRejecting ? 'Rejecting...' : 'Reject Quote'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            Accept Quote
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept Quote</DialogTitle>
            <DialogDescription>
              Are you sure you want to accept this quote? This will notify the freelancer and create a contract.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAcceptDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAccept} 
              disabled={isAccepting}
            >
              {isAccepting ? 'Accepting...' : 'Accept Quote'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuoteActionButtons;
