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
import { useContactInfo } from '@/hooks/leads/useContactInfo';

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
  const { clientInfo, isLoading: isLoadingContactInfo } = useContactInfo(projectId);

  useEffect(() => {
    const fetchClientInfo = async () => {
      if (!clientId) {
        console.error('No clientId provided to QuoteDialog');
        setClientName('Client');
        return;
      }
      
      console.log('QuoteDialog clientId:', clientId);
      setIsLoadingClientInfo(true);
      
      try {
        // First try to get client info from useContactInfo hook if project ID is available
        if (clientInfo) {
          console.log('Using client info from useContactInfo:', clientInfo);
          if (clientInfo.contact_name) {
            setClientName(clientInfo.contact_name);
            console.log('Setting client name from contact info:', clientInfo.contact_name);
            setIsLoadingClientInfo(false);
            return;
          }
        }
        
        // Fallback to getClientInfo utility
        console.log('Fetching client info for ID:', clientId);
        const fetchedClientInfo = await getClientInfo(clientId);
        console.log('Client info received in QuoteDialog:', fetchedClientInfo);
        
        // Use the contact_name directly, fall back to other options if not available
        if (fetchedClientInfo && fetchedClientInfo.contact_name && fetchedClientInfo.contact_name !== 'Client') {
          setClientName(fetchedClientInfo.contact_name);
          console.log('Setting client name to contact_name:', fetchedClientInfo.contact_name);
        } else if (fetchedClientInfo && fetchedClientInfo.company_name) {
          setClientName(fetchedClientInfo.company_name);
          console.log('Using company_name instead:', fetchedClientInfo.company_name);
        } else if (fetchedClientInfo && fetchedClientInfo.email) {
          const emailName = fetchedClientInfo.email.split('@')[0];
          setClientName(emailName);
          console.log('Using email as fallback:', emailName);
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
  }, [clientId, open, clientInfo]);

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
