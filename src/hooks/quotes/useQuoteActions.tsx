
import { useAuth } from '@/context/AuthContext';
import { useUpdateQuoteStatusMutation } from './mutations/useUpdateQuoteStatusMutation';

interface UseQuoteActionsProps {
  projectId?: string;
  quoteId?: string;
}

export const useQuoteActions = ({ projectId, quoteId }: UseQuoteActionsProps) => {
  const { user } = useAuth();
  
  const updateQuoteStatusMutation = useUpdateQuoteStatusMutation({ 
    projectId, 
    quoteId, 
    userId: user?.id 
  });
  
  return {
    acceptQuote: () => updateQuoteStatusMutation.mutate({ status: 'accepted' }),
    rejectQuote: () => updateQuoteStatusMutation.mutate({ status: 'declined' }),
    isAccepting: updateQuoteStatusMutation.isPending && updateQuoteStatusMutation.variables?.status === 'accepted',
    isRejecting: updateQuoteStatusMutation.isPending && updateQuoteStatusMutation.variables?.status === 'declined',
    acceptError: updateQuoteStatusMutation.error,
    rejectError: updateQuoteStatusMutation.error,
  };
};
