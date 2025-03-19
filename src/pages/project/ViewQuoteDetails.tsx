
import React, { useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useQuoteDetails } from '@/hooks/quotes/useQuoteDetails';
import { useQuoteActions } from '@/hooks/quotes/useQuoteActions';
import QuoteDetailsHeader from './components/quotes/QuoteDetailsHeader';
import QuoteDetailsDebugInfo from './components/quotes/QuoteDetailsDebugInfo';
import QuoteDetailsCard from './components/quotes/QuoteDetailsCard';
import QuoteDetailsLoading from './components/quotes/QuoteDetailsLoading';
import QuoteDetailsError from './components/quotes/QuoteDetailsError';
import { toast } from 'sonner';

const ViewQuoteDetails = () => {
  const { projectId, quoteId } = useParams();
  
  const { 
    quote, 
    freelancer, 
    project, 
    isLoading, 
    error,
    refetch 
  } = useQuoteDetails({ projectId, quoteId });
  
  const { 
    acceptQuote, 
    rejectQuote, 
    isAccepting, 
    isRejecting 
  } = useQuoteActions({ projectId, quoteId });

  // Initial and periodic data fetching
  useEffect(() => {
    if (!projectId || !quoteId) return;
    
    console.log('Setting up quote details fetch and polling');
    
    // Initial fetch
    refetch();
    
    // Set up polling for updates
    const intervalId = setInterval(() => {
      console.log('Polling for quote updates');
      refetch();
    }, 2000); // Poll every 2 seconds
    
    return () => {
      console.log('Cleaning up quote polling interval');
      clearInterval(intervalId);
    };
  }, [projectId, quoteId, refetch]);

  // Handle accepting a quote with robust error handling
  const handleAcceptQuote = useCallback(async () => {
    if (!projectId || !quoteId) {
      toast.error('Missing project or quote information');
      return;
    }
    
    try {
      console.log('ViewQuoteDetails - Accepting quote');
      
      // Execute the quote acceptance
      await acceptQuote();
      
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
      await rejectQuote();
      
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

  // Render different UI states
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <QuoteDetailsLoading projectId={projectId || ''} />
        </div>
      </MainLayout>
    );
  }

  if (error || !quote) {
    return (
      <MainLayout>
        <div className="container py-8">
          <QuoteDetailsError projectId={projectId || ''} />
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header with back button */}
        <QuoteDetailsHeader 
          projectId={projectId || ''} 
          projectTitle={project?.title}
        />

        {/* Debug information for status */}
        <QuoteDetailsDebugInfo
          status={quote.status}
          updatedAt={quote.updated_at}
          onRefresh={handleManualRefresh}
        />

        {/* Quote details card */}
        <QuoteDetailsCard
          quote={quote}
          freelancer={freelancer}
          onAcceptQuote={handleAcceptQuote}
          onRejectQuote={handleRejectQuote}
          isAccepting={isAccepting}
          isRejecting={isRejecting}
        />
      </div>
    </MainLayout>
  );
};

export default ViewQuoteDetails;
