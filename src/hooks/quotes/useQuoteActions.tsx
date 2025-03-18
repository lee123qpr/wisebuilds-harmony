
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

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

      const { data, error } = await supabase
        .from('quotes')
        .update({ status: 'accepted', updated_at: new Date().toISOString() })
        .eq('id', quoteId)
        .eq('project_id', projectId)
        .eq('client_id', user.id);

      if (error) {
        console.error('Error accepting quote:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['quote', projectId, quoteId] });
      queryClient.invalidateQueries({ queryKey: ['quotes', projectId] });
    },
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
        .update({ status: 'declined', updated_at: new Date().toISOString() })
        .eq('id', quoteId)
        .eq('project_id', projectId)
        .eq('client_id', user.id);

      if (error) {
        console.error('Error rejecting quote:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['quote', projectId, quoteId] });
      queryClient.invalidateQueries({ queryKey: ['quotes', projectId] });
    },
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
