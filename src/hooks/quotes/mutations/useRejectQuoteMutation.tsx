
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseRejectQuoteMutationProps {
  projectId?: string;
  quoteId?: string;
  userId?: string;
}

export const useRejectQuoteMutation = ({
  projectId,
  quoteId,
  userId
}: UseRejectQuoteMutationProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!userId || !projectId || !quoteId) {
        throw new Error('Missing required parameters');
      }

      console.log('Rejecting quote:', quoteId);

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
          
        // If quote is already declined, just return it
        if (quoteCheck.status === 'declined') {
          console.log('Quote is already declined, no update needed');
          return quoteCheck;
        }
        
        console.log('Current quote status before update:', quoteCheck.status);
        console.log('About to update quote status to declined');
          
        // Update the quote status to declined with explicit return of data
        const updateTimestamp = new Date().toISOString();
        const { data: updateResult, error: updateError } = await supabase
          .from('quotes')
          .update({ 
            status: 'declined', 
            updated_at: updateTimestamp
          })
          .eq('id', quoteId)
          .select('*')
          .single();

        if (updateError) {
          console.error('Error in Supabase update operation:', updateError);
          throw new Error(`Database update failed: ${updateError.message}`);
        }
        
        if (!updateResult) {
          console.error('Update operation returned no data');
          throw new Error('Update operation did not return expected data');
        }
        
        console.log('Direct update result:', updateResult);
        console.log('Updated status from update operation:', updateResult.status);
        
        // Add a larger delay to ensure full database consistency
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Double-check by fetching the quote again to absolutely verify the change
        const { data: verifiedQuote, error: verifyError } = await supabase
          .from('quotes')
          .select('*')
          .eq('id', quoteId)
          .single();
          
        if (verifyError) {
          console.error('Error in verification fetch:', verifyError);
          throw new Error(`Failed to verify status change: ${verifyError.message}`);
        }
        
        if (!verifiedQuote) {
          console.error('Verification fetch returned no quote');
          throw new Error('Failed to retrieve quote for verification');
        }
        
        console.log('Verified quote after update:', verifiedQuote);
        console.log('Final verified status:', verifiedQuote.status);
        
        if (verifiedQuote.status !== 'declined') {
          console.error('Quote status verification failed', {
            quoteId,
            originalStatus: quoteCheck.status,
            updateResult: updateResult?.status,
            verifiedStatus: verifiedQuote.status
          });
          throw new Error(`Status verification failed: expected 'declined' but got '${verifiedQuote.status}'`);
        }
        
        console.log('Quote rejected successfully, verified data:', verifiedQuote);
        return verifiedQuote;
      } catch (err) {
        console.error('Error in rejectMutation:', err);
        throw err;
      }
    },
    onSuccess: (data) => {
      console.log('Reject mutation completed successfully:', data);
      
      // Invalidate all related queries with correct keys
      queryClient.invalidateQueries({ queryKey: ['quote'] });
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      
      // Show success toast only once
      toast.success('Quote rejected successfully', {
        description: 'The freelancer has been notified.'
      });
    },
    onError: (error) => {
      console.error('Error in reject mutation:', error);
      toast.error('Failed to reject quote', {
        description: error instanceof Error ? error.message : 'Please try again later.'
      });
    }
  });
};
