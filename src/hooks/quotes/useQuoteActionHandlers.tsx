
import { useCallback } from 'react';
import { toast } from 'sonner';
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
      toast.error('Missing project or quote information');
      return;
    }
    
    try {
      console.log('ViewQuoteDetails - Accepting quote');
      
      // Execute the quote acceptance
      acceptQuote();
      
      // Immediately refetch data after accepting
      console.log('Triggering refetch after accept');
      await refetch();
      
      // Repeated refetches at intervals to ensure we get the updated status
      setTimeout(async () => {
        console.log('Delayed refetch after accept (1s)');
        await refetch();
        
        setTimeout(async () => {
          console.log('Delayed refetch after accept (3s)');
          await refetch();
        }, 2000);
      }, 1000);
    } catch (error) {
      console.error('Error accepting quote:', error);
      toast.error('Failed to accept quote', { 
        description: 'There was an error updating the quote status. Please try again.' 
      });
    }
  }, [projectId, quoteId, acceptQuote, refetch]);

  // Handle rejecting a quote with robust error handling
  const handleRejectQuote = useCallback(async () => {
    if (!projectId || !quoteId) {
      toast.error('Missing project or quote information');
      return;
    }
    
    try {
      console.log('ViewQuoteDetails - Rejecting quote');
      
      // Execute the quote rejection
      rejectQuote();
      
      // Immediately refetch data after rejecting
      console.log('Triggering refetch after reject');
      await refetch();
      
      // Repeated refetches at intervals
      setTimeout(async () => {
        console.log('Delayed refetch after reject (1s)');
        await refetch();
        
        setTimeout(async () => {
          console.log('Delayed refetch after reject (3s)');
          await refetch();
        }, 2000);
      }, 1000);
    } catch (error) {
      console.error('Error rejecting quote:', error);
      toast.error('Failed to reject quote', { 
        description: 'There was an error updating the quote status. Please try again.' 
      });
    }
  }, [projectId, quoteId, rejectQuote, refetch]);

  // Manual refresh button handler
  const handleManualRefresh = async () => {
    console.log('Manual refresh triggered');
    try {
      await refetch();
      toast.success('Data refreshed');
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Failed to refresh data');
    }
  };

  return {
    handleAcceptQuote,
    handleRejectQuote,
    handleManualRefresh
  };
};
