
import { useAuth } from '@/context/AuthContext';
import { useAcceptQuoteMutation } from './mutations/useAcceptQuoteMutation';
import { useRejectQuoteMutation } from './mutations/useRejectQuoteMutation';

interface UseQuoteActionsProps {
  projectId?: string;
  quoteId?: string;
}

export const useQuoteActions = ({ projectId, quoteId }: UseQuoteActionsProps) => {
  const { user } = useAuth();
  
  const acceptMutation = useAcceptQuoteMutation({ 
    projectId, 
    quoteId, 
    userId: user?.id 
  });
  
  const rejectMutation = useRejectQuoteMutation({ 
    projectId, 
    quoteId, 
    userId: user?.id 
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
