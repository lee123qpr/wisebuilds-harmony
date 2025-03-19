
import React from 'react';
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
  onAccept: () => void;
  onReject: () => void;
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
  
  if (quoteStatus !== 'pending') {
    return null;
  }

  return (
    <div className="flex justify-end space-x-2 pt-2">
      <Button
        variant="outline"
        onClick={() => navigate(`/messages/${freelancerId}`)}
        className="flex items-center gap-2"
      >
        <MessageSquare className="h-4 w-4" />
        Message Freelancer
      </Button>
      
      <Dialog>
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
          <DialogFooter>
            <Button variant="outline" onClick={() => {}}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={onReject} 
              disabled={isRejecting}
            >
              {isRejecting ? 'Rejecting...' : 'Reject Quote'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog>
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
          <DialogFooter>
            <Button variant="outline" onClick={() => {}}>Cancel</Button>
            <Button 
              onClick={onAccept} 
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
