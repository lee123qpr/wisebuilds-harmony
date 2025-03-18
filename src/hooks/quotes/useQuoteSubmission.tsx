
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface QuoteFormData {
  price: string;
  description: string;
  estimatedDuration: string;
}

interface UseQuoteSubmissionProps {
  projectId: string;
  clientId: string;
}

export const useQuoteSubmission = ({ projectId, clientId }: UseQuoteSubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const submitQuote = async (formData: QuoteFormData) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to submit a quote',
        variant: 'destructive',
      });
      return false;
    }

    try {
      setIsSubmitting(true);

      // Check if a quote already exists for this project and freelancer
      const { data: existingQuote, error: checkError } = await supabase.rpc(
        'check_quote_exists',
        {
          p_project_id: projectId,
          p_freelancer_id: user.id,
        }
      );

      if (checkError) throw checkError;

      if (existingQuote) {
        toast({
          title: 'Quote already exists',
          description: 'You have already submitted a quote for this project',
          variant: 'destructive',
        });
        return false;
      }

      // Create a new quote
      const { data, error } = await supabase
        .from('quotes')
        .insert([
          {
            project_id: projectId,
            freelancer_id: user.id,
            client_id: clientId,
            price: formData.price,
            description: formData.description,
            estimated_duration: formData.estimatedDuration,
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return true;
    } catch (error: any) {
      console.error('Error submitting quote:', error);
      toast({
        title: 'Failed to submit quote',
        description: error.message || 'Please try again later',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitQuote,
    isSubmitting,
  };
};
