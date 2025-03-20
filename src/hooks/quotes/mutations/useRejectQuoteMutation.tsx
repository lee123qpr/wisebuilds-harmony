
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
        // First, directly fetch the quote to check its current status
        const { data: quoteCheck, error: checkError } = await supabase
          .from('quotes')
          .select('*')
          .eq('id', quoteId)
          .maybeSingle();
          
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
        
        // Create a direct SQL RPC call to update the quote status
        // This is more reliable than the standard update method
        const { data: directUpdateResult, error: directUpdateError } = await supabase.rpc(
          'update_quote_status',
          { 
            quote_id: quoteId,
            new_status: 'declined'
          }
        );
        
        if (directUpdateError) {
          console.error('Error in direct update operation:', directUpdateError);
          throw new Error(`Database update failed: ${directUpdateError.message}`);
        }
        
        console.log('Direct update result:', directUpdateResult);
        
        // Add a significant delay to ensure full database consistency
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Double-check by fetching the quote again to absolutely verify the change
        const { data: verifiedQuote, error: verifyError } = await supabase
          .from('quotes')
          .select('*')
          .eq('id', quoteId)
          .maybeSingle();
          
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
