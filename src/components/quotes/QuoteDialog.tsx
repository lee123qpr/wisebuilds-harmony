
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Quote } from 'lucide-react';
import QuoteForm from './QuoteForm';
import { ScrollArea } from '@/components/ui/scroll-area';

interface QuoteDialogProps {
  projectId: string;
  projectTitle: string;
  clientId: string;
  onQuoteSubmitted?: () => void;
}

const QuoteDialog: React.FC<QuoteDialogProps> = ({
  projectId,
  projectTitle,
  clientId,
  onQuoteSubmitted,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSubmitSuccess = () => {
    setOpen(false);
    if (onQuoteSubmitted) {
      onQuoteSubmitted();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Quote className="h-4 w-4" />
          <span>Submit Quote</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Submit a Quote</DialogTitle>
          <DialogDescription>
            Send a detailed quote to the client for this project
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="p-1">
            <QuoteForm
              projectId={projectId}
              projectTitle={projectTitle}
              onSubmitSuccess={handleSubmitSuccess}
              onCancel={() => setOpen(false)}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteDialog;
