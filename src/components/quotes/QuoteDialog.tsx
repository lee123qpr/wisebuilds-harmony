
import React, { useEffect, useState } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { useFreelancerQuote } from '@/hooks/quotes/useFreelancerQuote';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { getClientInfo } from '@/services/conversations/utils/getClientInfo';

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
  const [clientName, setClientName] = useState<string>('Client');
  const [isLoadingClientInfo, setIsLoadingClientInfo] = useState<boolean>(false);
  const { data: existingQuote, isLoading: isCheckingQuote, refetch } = useFreelancerQuote({ projectId });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchClientInfo = async () => {
      if (!clientId) {
        console.error('No clientId provided to QuoteDialog');
        setClientName('Client');
        return;
      }
      
      setIsLoadingClientInfo(true);
      try {
        console.log('Fetching client info for ID:', clientId);
        
        // Get client info focusing on the full name
        const clientInfo = await getClientInfo(clientId);
        console.log('Client info received in QuoteDialog:', clientInfo);
        
        if (clientInfo.contact_name && clientInfo.contact_name !== 'Client') {
          setClientName(clientInfo.contact_name);
          console.log('Setting client name to:', clientInfo.contact_name);
        } else if (clientInfo.company_name) {
          setClientName(clientInfo.company_name);
          console.log('Using company name instead:', clientInfo.company_name);
        } else if (clientInfo.email) {
          // Use email as last resort
          setClientName(clientInfo.email.split('@')[0]);
          console.log('Using email name as fallback:', clientInfo.email.split('@')[0]);
        } else {
          setClientName('Client');
          console.log('No client info found, using default: Client');
        }
      } catch (error) {
        console.error('Error fetching client information:', error);
        setClientName('Client');
      } finally {
        setIsLoadingClientInfo(false);
      }
    };

    if (open && clientId) {
      console.log('Dialog opened, fetching client info for clientId:', clientId);
      fetchClientInfo();
    }
  }, [clientId, open]);

  const handleSubmitSuccess = () => {
    setOpen(false);
    toast({
      title: "Quote successfully submitted!",
      description: "Your quote has been sent to the client.",
      variant: "success"
    });
    refetch(); // Refresh the quote data
    if (onQuoteSubmitted) {
      onQuoteSubmitted();
    }
  };

  // Show loading state while checking for existing quote
  if (isCheckingQuote) {
    return <Button variant="outline" size="sm" className="gap-2" disabled>
      <span className="animate-pulse">Checking...</span>
    </Button>;
  }

  // Don't show the dialog trigger if user already submitted a quote
  if (existingQuote) {
    return <Button variant="outline" size="sm" className="gap-2" disabled>
      <Quote className="h-4 w-4" />
      <span>Quote Submitted</span>
    </Button>;
  }

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
            {isLoadingClientInfo ? (
              <div className="py-2 text-center text-sm text-muted-foreground">
                Loading client information...
              </div>
            ) : (
              <QuoteForm
                projectId={projectId}
                projectTitle={projectTitle}
                clientName={clientName}
                onSubmitSuccess={handleSubmitSuccess}
                onCancel={() => setOpen(false)}
              />
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteDialog;
