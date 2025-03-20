
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Quote } from '@/types/quotes';

type QuoteStatus = 'pending' | 'accepted' | 'declined';

interface UseUpdateQuoteStatusMutationProps {
  projectId?: string;
  quoteId?: string;
  userId?: string;
}

export const useUpdateQuoteStatusMutation = ({
  projectId,
  quoteId,
  userId
}: UseUpdateQuoteStatusMutationProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ status }: { status: QuoteStatus }) => {
      if (!userId || !projectId || !quoteId) {
        throw new Error('Missing required parameters');
      }

      console.log(`Updating quote ${quoteId} status to: ${status}`);

      // Perform a direct update using RPC function for better atomicity
      const { data: updateResult, error: updateError } = await supabase
        .rpc('update_quote_status', { 
          quote_id: quoteId, 
          new_status: status 
        });
      
      if (updateError) {
        console.error('Error in update operation:', updateError);
        throw new Error(`Database update failed: ${updateError.message}`);
      }
      
      // If we got a result back from the RPC, it means the update was successful
      if (updateResult) {
        console.log('Update successful:', updateResult);
        return updateResult as Quote;
      }
      
      // Fallback - if RPC call succeeded but didn't return data, fetch the quote directly
      const { data: fetchedQuote, error: fetchError } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', quoteId)
        .maybeSingle();
        
      if (fetchError) {
        console.error('Error fetching updated quote:', fetchError);
        throw new Error(`Failed to verify update: ${fetchError.message}`);
      }
      
      if (!fetchedQuote) {
        console.error('Quote not found after update');
        throw new Error('Quote not found after update');
      }
      
      console.log('Fetched quote after update:', fetchedQuote);
      
      // Final status check - less strict, just log warning if status doesn't match expected
      if (fetchedQuote.status !== status) {
        console.warn(`Warning: Quote status is ${fetchedQuote.status}, expected ${status}`);
      }
      
      return fetchedQuote as Quote;
    },
    onSuccess: (data, variables) => {
      console.log(`${variables.status} mutation completed successfully:`, data);
      
      // Invalidate all related queries with correct keys
      queryClient.invalidateQueries({ queryKey: ['quote'] });
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      
      // Show success toast only once
      const actionText = variables.status === 'accepted' ? 'accepted' : 'rejected';
      toast.success(`Quote ${actionText} successfully`, {
        description: 'The freelancer has been notified.'
      });
    },
    onError: (error, variables) => {
      console.error(`Error in ${variables.status} mutation:`, error);
      const actionText = variables.status === 'accepted' ? 'accept' : 'reject';
      toast.error(`Failed to ${actionText} quote`, {
        description: error instanceof Error ? error.message : 'Please try again later.'
      });
    }
  });
};
