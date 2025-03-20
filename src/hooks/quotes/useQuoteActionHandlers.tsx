
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
  // Handle accepting a quote with robust error handling and retry logic
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
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Refetch with multiple attempts if needed
      console.log('Triggering refetch after accept');
      let refetchAttempts = 0;
      const maxRefetchAttempts = 3;
      
      while (refetchAttempts < maxRefetchAttempts) {
        try {
          await refetch({ throwOnError: true });
          console.log('Refetch successful after accept');
          break;
        } catch (refetchError) {
          console.error(`Refetch attempt ${refetchAttempts + 1} failed:`, refetchError);
          refetchAttempts++;
          if (refetchAttempts >= maxRefetchAttempts) {
            console.warn('Max refetch attempts reached, but operation likely succeeded');
            break;
          }
          // Wait before trying again
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error accepting quote:', error);
      return Promise.reject(error);
    }
  }, [projectId, quoteId, acceptQuote, refetch]);

  // Handle rejecting a quote with robust error handling and retry logic
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
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Refetch with multiple attempts if needed
      console.log('Triggering refetch after reject');
      let refetchAttempts = 0;
      const maxRefetchAttempts = 3;
      
      while (refetchAttempts < maxRefetchAttempts) {
        try {
          await refetch({ throwOnError: true });
          console.log('Refetch successful after reject');
          break;
        } catch (refetchError) {
          console.error(`Refetch attempt ${refetchAttempts + 1} failed:`, refetchError);
          refetchAttempts++;
          if (refetchAttempts >= maxRefetchAttempts) {
            console.warn('Max refetch attempts reached, but operation likely succeeded');
            break;
          }
          // Wait before trying again
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
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
