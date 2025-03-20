
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
          
        // If quote is already accepted, just return it
        if (quoteCheck.status === 'accepted') {
          console.log('Quote is already accepted, no update needed');
          return quoteCheck;
        }
          
        // Update the quote status to accepted
        // Critical fix: Add explicit delay between operations to ensure database consistency
        const { error } = await supabase
          .from('quotes')
          .update({ 
            status: 'accepted', 
            updated_at: new Date().toISOString() 
          })
          .eq('id', quoteId);

        if (error) {
          console.error('Error accepting quote:', error);
          throw error;
        }

        // Add a small delay to ensure database consistency
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Separately fetch the updated quote to confirm the status change
        const { data: updatedQuote, error: fetchError } = await supabase
          .from('quotes')
          .select('*')
          .eq('id', quoteId)
          .single();
          
        if (fetchError) {
          console.error('Error fetching updated quote:', fetchError);
          throw new Error(`Failed to verify update: ${fetchError.message}`);
        }
        
        if (!updatedQuote) {
          console.error('Updated quote not found');
          throw new Error('Failed to retrieve updated quote');
        }
        
        console.log('Quote after update operation:', updatedQuote);
        
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
      
      // Invalidate all related queries with correct keys
      queryClient.invalidateQueries({ queryKey: ['quote'] });
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      
      // Show success toast only once
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
