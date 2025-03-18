
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface QuoteFormData {
  fixed_price?: string;
  estimated_price?: string;
  description: string;
  available_start_date?: string;
  estimated_duration?: string;
  duration_unit?: 'days' | 'weeks' | 'months';
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
            fixed_price: formData.fixed_price,
            estimated_price: formData.estimated_price,
            description: formData.description,
            available_start_date: formData.available_start_date,
            estimated_duration: formData.estimated_duration,
            duration_unit: formData.duration_unit,
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
