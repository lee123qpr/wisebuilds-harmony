
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useQuoteDetails } from '@/hooks/quotes/useQuoteDetails';
import { useQuoteActions } from '@/hooks/quotes/useQuoteActions';
import { useQuoteActionHandlers } from '@/hooks/quotes/useQuoteActionHandlers';
import QuoteDetailsHeader from './components/quotes/QuoteDetailsHeader';
import QuoteDetailsCard from './components/quotes/QuoteDetailsCard';
import QuoteDetailsLoading from './components/quotes/QuoteDetailsLoading';
import QuoteDetailsError from './components/quotes/QuoteDetailsError';

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

  const {
    handleAcceptQuote,
    handleRejectQuote,
    handleManualRefresh
  } = useQuoteActionHandlers({
    projectId,
    quoteId,
    acceptQuote,
    rejectQuote,
    refetch
  });

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
