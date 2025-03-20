
import { useCallback } from 'react';
import { UseMutateFunction, QueryObserverResult, RefetchOptions } from '@tanstack/react-query';

interface UseQuoteActionHandlersProps {
  projectId?: string;
  quoteId?: string;
  acceptQuote: UseMutateFunction<any, Error, void, unknown>;
  rejectQuote: UseMutateFunction<any, Error, void, unknown>;
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>;
}

export const useQuoteActionHandlers = ({
  projectId,
  quoteId,
  acceptQuote,
  rejectQuote,
  refetch
}: UseQuoteActionHandlersProps) => {
  // Generic quote action handler to reduce code duplication
  const handleQuoteAction = useCallback(async (
    actionFn: UseMutateFunction<any, Error, void, unknown>,
    actionName: string
  ) => {
    if (!projectId || !quoteId) {
      return Promise.reject(new Error('Missing project or quote information'));
    }
    
    try {
      console.log(`ViewQuoteDetails - ${actionName} quote`);
      
      // Execute the quote action with await
      await new Promise<void>((resolve, reject) => {
        actionFn(undefined, {
          onSuccess: () => {
            console.log(`Quote ${actionName} mutation succeeded`);
            resolve();
          },
          onError: (error) => {
            console.error(`Quote ${actionName} mutation failed:`, error);
            reject(error);
          }
        });
      });
      
      // Use a slightly longer delay to ensure database consistency
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Refetch data to update UI
      await refetch();
      console.log(`Refetch successful after ${actionName}`);
      
      return Promise.resolve();
    } catch (error) {
      console.error(`Error ${actionName} quote:`, error);
      
      // Try one more refetch even if the action failed
      // This helps update the UI if the change actually went through despite reported errors
      try {
        await refetch();
        console.log(`Refetch after error still completed`);
      } catch (refetchError) {
        console.error('Additional refetch also failed:', refetchError);
      }
      
      return Promise.reject(error);
    }
  }, [projectId, quoteId, refetch]);

  // Specialized handlers using the generic handler
  const handleAcceptQuote = useCallback(() => {
    return handleQuoteAction(acceptQuote, 'accepting');
  }, [acceptQuote, handleQuoteAction]);

  const handleRejectQuote = useCallback(() => {
    return handleQuoteAction(rejectQuote, 'rejecting');
  }, [rejectQuote, handleQuoteAction]);

  // Manual refresh button handler
  const handleManualRefresh = async () => {
    console.log('Manual refresh triggered');
    try {
      await refetch();
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  return {
    handleAcceptQuote,
    handleRejectQuote,
    handleManualRefresh
  };
};
