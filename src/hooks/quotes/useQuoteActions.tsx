
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

      console.log('Accepting quote:', quoteId);

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

      console.log('Quote accepted successfully:', data);
      return data;
    },
    onSuccess: () => {
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

      console.log('Quote rejected successfully:', data);
      return data;
    },
    onSuccess: () => {
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
