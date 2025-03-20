
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
  // Handle accepting a quote with robust error handling
  const handleAcceptQuote = useCallback(async () => {
    if (!projectId || !quoteId) {
      return Promise.reject(new Error('Missing project or quote information'));
    }
    
    try {
      console.log('ViewQuoteDetails - Accepting quote');
      
      // Execute the quote acceptance with await
      await new Promise<void>((resolve, reject) => {
        acceptQuote(undefined, {
          onSuccess: () => {
            console.log('Quote acceptance mutation succeeded');
            resolve();
          },
          onError: (error) => {
            console.error('Quote acceptance mutation failed:', error);
            reject(error);
          }
        });
      });
      
      // Wait for a moment before refetching to ensure database consistency
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Refetch after the operation completes and database has updated
      console.log('Triggering refetch after accept');
      await refetch({ throwOnError: true });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error accepting quote:', error);
      return Promise.reject(error);
    }
  }, [projectId, quoteId, acceptQuote, refetch]);

  // Handle rejecting a quote with robust error handling
  const handleRejectQuote = useCallback(async () => {
    if (!projectId || !quoteId) {
      return Promise.reject(new Error('Missing project or quote information'));
    }
    
    try {
      console.log('ViewQuoteDetails - Rejecting quote');
      
      // Execute the quote rejection with await
      await new Promise<void>((resolve, reject) => {
        rejectQuote(undefined, {
          onSuccess: () => {
            console.log('Quote rejection mutation succeeded');
            resolve();
          },
          onError: (error) => {
            console.error('Quote rejection mutation failed:', error);
            reject(error);
          }
        });
      });
      
      // Wait for a moment before refetching to ensure database consistency
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Refetch after the operation completes and database has updated
      console.log('Triggering refetch after reject');
      await refetch({ throwOnError: true });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error rejecting quote:', error);
      return Promise.reject(error);
    }
  }, [projectId, quoteId, rejectQuote, refetch]);

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
