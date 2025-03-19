
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface UseQuoteActionsProps {
  projectId?: string;
  quoteId?: string;
}

export const useQuoteActions = ({ projectId, quoteId }: UseQuoteActionsProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Accept quote mutation
  const acceptMutation = useMutation({
    mutationFn: async () => {
      if (!user || !projectId || !quoteId) {
        throw new Error('Missing required parameters');
      }

      console.log('Accepting quote with ID:', quoteId);

      try {
        // Update the quote status to accepted
        const { data, error } = await supabase
          .from('quotes')
          .update({ 
            status: 'accepted', 
            updated_at: new Date().toISOString() 
          })
          .eq('id', quoteId)
          .select('*');

        if (error) {
          console.error('Error accepting quote:', error);
          throw error;
        }

        // Verify the update was successful by checking the returned data
        if (!data || data.length === 0) {
          console.error('No data returned from update operation');
          throw new Error('Failed to update quote status');
        }

        // Double-check that the status was actually updated by fetching the latest version
        const { data: verificationData, error: verificationError } = await supabase
          .from('quotes')
          .select('*')
          .eq('id', quoteId)
          .single();
          
        if (verificationError) {
          console.error('Error verifying quote update:', verificationError);
          throw verificationError;
        }
        
        if (verificationData.status !== 'accepted') {
          console.error('Quote status was not updated correctly', verificationData);
          throw new Error(`Quote status verification failed: expected 'accepted' but got '${verificationData.status}'`);
        }

        console.log('Quote accepted successfully, updated data:', verificationData);
        return verificationData;
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

  // Reject quote mutation - similar improvements as accept
  const rejectMutation = useMutation({
    mutationFn: async () => {
      if (!user || !projectId || !quoteId) {
        throw new Error('Missing required parameters');
      }

      console.log('Rejecting quote:', quoteId);

      try {
        const { data, error } = await supabase
          .from('quotes')
          .update({ 
            status: 'declined', 
            updated_at: new Date().toISOString() 
          })
          .eq('id', quoteId)
          .select('*');

        if (error) {
          console.error('Error rejecting quote:', error);
          throw error;
        }

        // Verify the update was successful
        if (!data || data.length === 0) {
          console.error('No data returned from reject update operation');
          throw new Error('Failed to update quote status to declined');
        }
        
        // Double-check that the status was actually updated
        const { data: verificationData, error: verificationError } = await supabase
          .from('quotes')
          .select('*')
          .eq('id', quoteId)
          .single();
          
        if (verificationError) {
          console.error('Error verifying quote update:', verificationError);
          throw verificationError;
        }
        
        if (verificationData.status !== 'declined') {
          console.error('Quote status was not updated correctly', verificationData);
          throw new Error(`Quote status verification failed: expected 'declined' but got '${verificationData.status}'`);
        }

        console.log('Quote rejected successfully, updated data:', verificationData);
        return verificationData;
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
      
      // Show success toast
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

  return {
    acceptQuote: acceptMutation.mutate,
    rejectQuote: rejectMutation.mutate,
    isAccepting: acceptMutation.isPending,
    isRejecting: rejectMutation.isPending,
    acceptError: acceptMutation.error,
    rejectError: rejectMutation.error,
  };
};
