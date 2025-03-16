
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CalculatorIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SubmitQuoteDialog from './SubmitQuoteDialog';

interface SubmitQuoteButtonProps {
  projectId: string;
  projectTitle: string;
  isPurchased: boolean;
  onQuoteSubmitted?: () => void;
}

const SubmitQuoteButton: React.FC<SubmitQuoteButtonProps> = ({
  projectId,
  projectTitle,
  isPurchased,
  onQuoteSubmitted
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasExistingQuote, setHasExistingQuote] = useState(false);
  const { toast } = useToast();

  const checkExistingQuote = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('check_quote_exists', {
        p_project_id: projectId,
        p_freelancer_id: supabase.auth.getUser().then(res => res.data.user?.id)
      });
      
      if (error) throw error;
      
      setHasExistingQuote(data === true);
      
      // Only open dialog if there's no existing quote
      if (data === false) {
        setIsDialogOpen(true);
      } else {
        toast({
          variant: 'default',
          title: 'Quote already submitted',
          description: 'You have already submitted a quote for this project.'
        });
      }
    } catch (err) {
      console.error('Error checking existing quote:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not check if you have already submitted a quote.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitClick = () => {
    if (!isPurchased) {
      toast({
        variant: 'default',
        title: 'Purchase required',
        description: 'You need to purchase this lead before you can submit a quote.'
      });
      return;
    }
    
    checkExistingQuote();
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleQuoteSubmitted = () => {
    setIsDialogOpen(false);
    setHasExistingQuote(true);
    if (onQuoteSubmitted) {
      onQuoteSubmitted();
    }
    
    toast({
      title: 'Quote submitted',
      description: 'Your quote has been submitted successfully.'
    });
  };

  return (
    <>
      <Button 
        variant={hasExistingQuote ? "secondary" : "default"}
        className="flex items-center gap-2"
        onClick={handleSubmitClick}
        disabled={isLoading || (hasExistingQuote && isPurchased)}
      >
        <CalculatorIcon className="h-4 w-4" />
        {hasExistingQuote ? 'Quote Submitted' : 'Submit Quote'}
      </Button>
      
      <SubmitQuoteDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        projectId={projectId}
        projectTitle={projectTitle}
        onQuoteSubmitted={handleQuoteSubmitted}
      />
    </>
  );
};

export default SubmitQuoteButton;
