
import React, { useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';
import { useQuoteDetails } from '@/hooks/quotes/useQuoteDetails';
import { useQuoteActions } from '@/hooks/quotes/useQuoteActions';
import QuoteStatusBadge from '@/components/quotes/details/QuoteStatusBadge';
import PriceSection from '@/components/quotes/details/PriceSection';
import TimelineSection from '@/components/quotes/details/TimelineSection';
import PaymentSection from '@/components/quotes/details/PaymentSection';
import DescriptionSection from '@/components/quotes/details/DescriptionSection';
import QuoteDetailsSkeleton from '@/components/quotes/details/QuoteDetailsSkeleton';
import FreelancerProfileCard from './components/quotes/FreelancerProfileCard';
import QuoteActionButtons from './components/quotes/QuoteActionButtons';
import QuoteStatusAlert from './components/quotes/QuoteStatusAlert';
import QuoteDetailsHeader from './components/quotes/QuoteDetailsHeader';
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

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <QuoteDetailsHeader 
            projectId={projectId || ''} 
            projectTitle={undefined}
          />
          <QuoteDetailsSkeleton />
        </div>
      </MainLayout>
    );
  }

  if (error || !quote) {
    return (
      <MainLayout>
        <div className="container py-8">
          <QuoteDetailsHeader 
            projectId={projectId || ''} 
            projectTitle={undefined}
          />
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-700">Error Loading Quote</CardTitle>
              <CardDescription>
                The quote could not be found or you don't have permission to view it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to={`/project/${projectId}/quotes`}>Back to Quotes</Link>
              </Button>
            </CardContent>
          </Card>
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
        <div className="mb-4 p-2 bg-gray-100 rounded text-xs font-mono">
          <p>Current Quote Status: <span className="font-bold">{quote.status}</span></p>
          <p>Last Updated: {new Date(quote.updated_at).toLocaleString()}</p>
          <Button size="sm" variant="outline" onClick={handleManualRefresh} className="mt-1">
            Refresh Data
          </Button>
        </div>

        {/* Freelancer profile card */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-start justify-between">
            <FreelancerProfileCard 
              freelancer={freelancer} 
              quoteDate={quote.created_at}
            />
            <QuoteStatusBadge status={quote.status} />
          </CardHeader>
          <CardContent className="space-y-4">
            <PriceSection quote={quote} />
            <TimelineSection quote={quote} />
            <PaymentSection quote={quote} />
            <DescriptionSection quote={quote} />
          </CardContent>
          
          <CardFooter className="flex flex-col items-stretch">
            {quote.status === 'pending' && (
              <QuoteActionButtons 
                quoteStatus={quote.status}
                freelancerId={quote.freelancer_id}
                onAccept={handleAcceptQuote}
                onReject={handleRejectQuote}
                isAccepting={isAccepting}
                isRejecting={isRejecting}
              />
            )}
            
            {quote.status !== 'pending' && (
              <QuoteStatusAlert status={quote.status} />
            )}
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ViewQuoteDetails;
