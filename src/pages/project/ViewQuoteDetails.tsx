
import React, { useEffect } from 'react';
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

  // Force refetch data when component mounts or when URL params change
  useEffect(() => {
    if (projectId && quoteId) {
      refetch();
    }
  }, [projectId, quoteId, refetch]);

  const handleAcceptQuote = async () => {
    try {
      await acceptQuote();
      // Manually trigger a refetch to ensure the UI is updated
      setTimeout(() => refetch(), 500);
    } catch (error) {
      console.error('Error accepting quote:', error);
    }
  };

  const handleRejectQuote = async () => {
    try {
      await rejectQuote();
      // Manually trigger a refetch to ensure the UI is updated
      setTimeout(() => refetch(), 500);
    } catch (error) {
      console.error('Error rejecting quote:', error);
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
