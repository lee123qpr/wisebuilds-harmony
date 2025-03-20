
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
          
        // If quote is already accepted, just return it
        if (quoteCheck.status === 'accepted') {
          console.log('Quote is already accepted, no update needed');
          return quoteCheck;
        }
        
        console.log('Current quote status before update:', quoteCheck.status);
        
        // Update the quote status directly
        const { data: updateResult, error: updateError } = await supabase
          .from('quotes')
          .update({ 
            status: 'accepted', 
            updated_at: new Date().toISOString() 
          })
          .eq('id', quoteId)
          .select('*')
          .maybeSingle();
        
        if (updateError) {
          console.error('Error in update operation:', updateError);
          throw new Error(`Database update failed: ${updateError.message}`);
        }
        
        console.log('Update result:', updateResult);
        
        // Implement a retry mechanism for verification
        let verifiedQuote = null;
        let retryCount = 0;
        const maxRetries = 3;
        
        while (retryCount < maxRetries) {
          // Add a significant delay to ensure database consistency
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Double-check by fetching the quote again to verify the change
          const { data: fetchedQuote, error: verifyError } = await supabase
            .from('quotes')
            .select('*')
            .eq('id', quoteId)
            .maybeSingle();
            
          if (verifyError) {
            console.error('Error in verification fetch:', verifyError);
            retryCount++;
            continue;
          }
          
          if (!fetchedQuote) {
            console.error('Verification fetch returned no quote');
            retryCount++;
            continue;
          }
          
          console.log(`Verification attempt ${retryCount + 1}: Quote status = ${fetchedQuote.status}`);
          
          if (fetchedQuote.status === 'accepted') {
            // Verification successful
            verifiedQuote = fetchedQuote;
            break;
          }
          
          retryCount++;
        }
        
        if (!verifiedQuote) {
          console.error('Quote status verification failed after multiple attempts', {
            quoteId,
            originalStatus: quoteCheck.status,
          });
          throw new Error(`Status verification failed: expected 'accepted' but verification timed out`);
        }
        
        console.log('Quote accepted successfully, verified data:', verifiedQuote);
        return verifiedQuote;
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
