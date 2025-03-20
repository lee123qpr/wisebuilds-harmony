
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseAcceptQuoteMutationProps {
  projectId?: string;
  quoteId?: string;
  userId?: string;
}

export const useAcceptQuoteMutation = ({ 
  projectId, 
  quoteId, 
  userId 
}: UseAcceptQuoteMutationProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!userId || !projectId || !quoteId) {
        throw new Error('Missing required parameters');
      }

      console.log('Accepting quote with ID:', quoteId);

      try {
        // First, verify the quote exists and check its current status
        const { data: quoteCheck, error: checkError } = await supabase
          .from('quotes')
          .select('*')
          .eq('id', quoteId)
          .single();
          
        if (checkError) {
          console.error('Error checking quote:', checkError);
          throw new Error(`Failed to verify quote: ${checkError.message}`);
        }
          
        if (!quoteCheck) {
          console.error('Quote not found');
          throw new Error('Quote not found');
        }
          
        // Update the quote status to accepted
        const { data, error } = await supabase
          .from('quotes')
          .update({ 
            status: 'accepted', 
            updated_at: new Date().toISOString() 
          })
          .eq('id', quoteId)
          .select();

        if (error) {
          console.error('Error accepting quote:', error);
          throw error;
        }

        // Verify the update was successful
        if (!data || data.length === 0) {
          console.error('No data returned from update operation');
          
          // Perform an additional check to see if the update actually worked
          const { data: verifyData, error: verifyError } = await supabase
            .from('quotes')
            .select('*')
            .eq('id', quoteId)
            .single();
            
          if (verifyError) {
            console.error('Error verifying update:', verifyError);
            throw new Error(`Failed to verify update: ${verifyError.message}`);
          }
            
          if (verifyData && verifyData.status === 'accepted') {
            console.log('Update was successful despite no returned data');
            return verifyData;
          }
            
          throw new Error('Failed to update quote status');
        }

        // The update returns an array with the updated row(s), so we need to check the first item
        const updatedQuote = data[0];
        
        if (updatedQuote.status !== 'accepted') {
          console.error('Quote status was not updated correctly', updatedQuote);
          throw new Error(`Quote status verification failed: expected 'accepted' but got '${updatedQuote.status}'`);
        }

        console.log('Quote accepted successfully, updated data:', updatedQuote);
        return updatedQuote;
      } catch (err) {
        console.error('Error in acceptMutation:', err);
        throw err;
      }
    },
    onSuccess: (data) => {
      console.log('Accept mutation completed successfully:', data);
      
      // Invalidate all related queries to ensure fresh data is fetched
      queryClient.invalidateQueries({ queryKey: ['quote'] });
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      
      // Show success toast
      toast.success('Quote accepted successfully', {
        description: 'The freelancer has been notified.'
      });
    },
    onError: (error) => {
      console.error('Error in accept mutation:', error);
      toast.error('Failed to accept quote', {
        description: error instanceof Error ? error.message : 'Please try again later.'
      });
    }
  });
};
