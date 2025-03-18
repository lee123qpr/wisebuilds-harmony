
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
import { Quote, MessageSquare } from 'lucide-react';
import QuoteForm from './QuoteForm';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useFreelancerQuote } from '@/hooks/quotes/useFreelancerQuote';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { createConversation } from '@/services/conversations';
import { useAuth } from '@/context/AuthContext';

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
  const [clientName, setClientName] = useState<string>('');
  const { data: existingQuote, refetch } = useFreelancerQuote({ projectId });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchClientInfo = async () => {
      try {
        // Try to get client information from the client_profiles table
        const { data: clientProfile, error: clientError } = await supabase
          .from('client_profiles')
          .select('contact_name, company_name')
          .eq('id', clientId)
          .maybeSingle();

        if (clientProfile && clientProfile.contact_name) {
          setClientName(clientProfile.contact_name);
          return;
        }

        // If no client profile, fetch from edge function
        const { data: userData, error: userError } = await supabase.functions.invoke(
          'get-user-email',
          {
            body: { userId: clientId }
          }
        );

        if (userData && userData.full_name) {
          setClientName(userData.full_name);
        } else if (userData && userData.email) {
          // Use the part before @ as a fallback name
          setClientName(userData.email.split('@')[0]);
        } else {
          setClientName('Client');
        }
      } catch (error) {
        console.error('Error fetching client information:', error);
        setClientName('Client');
      }
    };

    if (open && clientId) {
      fetchClientInfo();
    }
  }, [clientId, open]);

  const handleSubmitSuccess = () => {
    setOpen(false);
    refetch(); // Refresh the quote data
    if (onQuoteSubmitted) {
      onQuoteSubmitted();
    }
  };

  const handleStartChat = async () => {
    try {
      if (!user) {
        throw new Error('Not authenticated');
      }
      
      console.log('Starting chat between freelancer', user.id, 'and client', clientId, 'for project', projectId);
      
      // Check if conversation already exists
      const { data: existingConversations, error: checkError } = await supabase
        .from('conversations')
        .select('id')
        .eq('project_id', projectId)
        .eq('freelancer_id', user.id)
        .eq('client_id', clientId);
        
      if (checkError) throw checkError;
      
      if (existingConversations && existingConversations.length > 0) {
        console.log('Using existing conversation:', existingConversations[0].id);
        navigate(`/dashboard/freelancer?tab=messages&conversation=${existingConversations[0].id}`);
      } else {
        // Create a new conversation
        const newConversation = await createConversation(user.id, clientId, projectId);
        
        if (!newConversation) {
          throw new Error('Failed to create conversation');
        }
        
        console.log('Created new conversation:', newConversation.id);
        navigate(`/dashboard/freelancer?tab=messages&conversation=${newConversation.id}`);
      }
    } catch (error: any) {
      console.error('Error starting chat:', error);
      toast({
        title: 'Error starting chat',
        description: error.message || 'Failed to start conversation',
        variant: 'destructive',
      });
    }
  };

  // Don't show the dialog trigger if user already submitted a quote
  if (existingQuote) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button 
        onClick={handleStartChat}
        size="sm" 
        variant="outline" 
        className="gap-2"
      >
        <MessageSquare className="h-4 w-4" />
        <span>Message Now</span>
      </Button>
      
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
                clientName={clientName}
                onSubmitSuccess={handleSubmitSuccess}
                onCancel={() => setOpen(false)}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuoteDialog;
