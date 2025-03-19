
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
        // Properly await the Supabase response and handle it correctly
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

        // Verify the update was successful by checking the returned data
        if (!data || data.length === 0) {
          console.error('No data returned from update operation');
          throw new Error('Failed to update quote status');
        }

        console.log('Quote accepted successfully, updated data:', data);
        return data;
      } catch (err) {
        console.error('Error in acceptMutation:', err);
        throw err;
      }
    },
    onSuccess: (data) => {
      console.log('Accept mutation completed successfully:', data);
      
      // Invalidate queries to ensure fresh data is fetched
      queryClient.invalidateQueries({ queryKey: ['quote', projectId, quoteId] });
      queryClient.invalidateQueries({ queryKey: ['quotes', projectId] });
      
      // Show success toast
      toast.success('Quote accepted successfully', {
        description: 'The freelancer has been notified.'
      });
    },
    onError: (error) => {
      console.error('Error in accept mutation:', error);
      toast.error('Failed to accept quote', {
        description: 'Please try again later.'
      });
    }
  });

  // Reject quote mutation
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
          .select();

        if (error) {
          console.error('Error rejecting quote:', error);
          throw error;
        }

        // Verify the update was successful
        if (!data || data.length === 0) {
          console.error('No data returned from reject update operation');
          throw new Error('Failed to update quote status to declined');
        }

        console.log('Quote rejected successfully, updated data:', data);
        return data;
      } catch (err) {
        console.error('Error in rejectMutation:', err);
        throw err;
      }
    },
    onSuccess: (data) => {
      console.log('Reject mutation completed successfully:', data);
      
      // Invalidate relevant queries with correct keys
      queryClient.invalidateQueries({ queryKey: ['quote', projectId, quoteId] });
      queryClient.invalidateQueries({ queryKey: ['quotes', projectId] });
      
      // Show success toast
      toast.success('Quote rejected successfully', {
        description: 'The freelancer has been notified.'
      });
    },
    onError: (error) => {
      console.error('Error in reject mutation:', error);
      toast.error('Failed to reject quote', {
        description: 'Please try again later.'
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
