
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Quote } from '@/types/quotes';

interface QuoteFormData {
  fixed_price?: string;
  estimated_price?: string;
  day_rate?: string;
  description: string;
  available_start_date?: string;
  estimated_duration?: string;
  duration_unit?: 'days' | 'weeks' | 'months';
  preferred_payment_method?: string;
  payment_terms?: string;
  quote_files?: any[];
}

interface UseQuoteSubmissionProps {
  projectId: string;
  clientId: string;
}

export const useQuoteSubmission = ({ projectId, clientId }: UseQuoteSubmissionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if quote exists
  const checkQuoteExists = async (freelancerId: string): Promise<boolean> => {
    const { data: existingQuote, error: checkError } = await supabase.rpc(
      'check_quote_exists',
      {
        p_project_id: projectId,
        p_freelancer_id: freelancerId,
      }
    );

    if (checkError) throw checkError;
    return !!existingQuote;
  };

  // Get project owner's ID (the true client ID)
  const getProjectOwnerId = async (): Promise<string> => {
    console.log('Fetching project owner ID for project:', projectId);
    
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', projectId)
      .single();
    
    if (projectError) {
      console.error('Error fetching project owner:', projectError);
      throw new Error('Could not determine project owner');
    }
    
    console.log('Project owner ID verified:', project.user_id);
    return project.user_id;
  };

  // Create quote with verified client ID
  const createQuote = async (formData: QuoteFormData, freelancerId: string): Promise<Quote> => {
    if (freelancerId === clientId) {
      console.warn('Potential ID conflict: freelancer ID and provided client ID are the same');
    }
    
    // Always get the actual project owner ID, regardless of what was passed in
    const projectOwnerId = await getProjectOwnerId();
    
    console.log('Using verified client ID for quote:', projectOwnerId);
    console.log('Freelancer ID for quote:', freelancerId);
    
    // Safety check - never allow the same ID for both fields
    if (freelancerId === projectOwnerId) {
      console.error('Critical ID conflict: freelancer ID and project owner ID are identical');
      throw new Error('Cannot create quote: you appear to be both the client and freelancer');
    }
    
    const { data, error } = await supabase
      .from('quotes')
      .insert([
        {
          project_id: projectId,
          freelancer_id: freelancerId,
          client_id: projectOwnerId, // Always use the project owner as the client ID
          fixed_price: formData.fixed_price,
          estimated_price: formData.estimated_price,
          day_rate: formData.day_rate,
          description: formData.description,
          available_start_date: formData.available_start_date,
          estimated_duration: formData.estimated_duration,
          duration_unit: formData.duration_unit as 'days' | 'weeks' | 'months',
          preferred_payment_method: formData.preferred_payment_method,
          payment_terms: formData.payment_terms,
          quote_files: formData.quote_files,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) throw error;
    
    // Ensure we have properly typed data
    return {
      ...data,
      status: data.status as Quote['status'],
      duration_unit: data.duration_unit as Quote['duration_unit'],
      quote_files: Array.isArray(data.quote_files) ? data.quote_files : []
    };
  };

  // Use React Query mutation
  const mutation = useMutation({
    mutationFn: async (formData: QuoteFormData) => {
      if (!user) {
        throw new Error('Authentication required');
      }

      console.log('Submitting quote data:', formData);
      
      // First check if quote exists
      const quoteExists = await checkQuoteExists(user.id);
      
      if (quoteExists) {
        throw new Error('You have already submitted a quote for this project');
      }
      
      // Create a new quote using the verified project owner as client
      return await createQuote(formData, user.id);
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] });
      
      toast({
        title: 'Quote submitted successfully',
        description: 'Your quote has been sent to the client',
      });
    },
    onError: (error: Error) => {
      console.error('Error submitting quote:', error);
      
      toast({
        title: 'Failed to submit quote',
        description: error.message || 'Please try again later',
        variant: 'destructive',
      });
    }
  });

  return {
    submitQuote: mutation.mutate,
    isSubmitting: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess
  };
};
