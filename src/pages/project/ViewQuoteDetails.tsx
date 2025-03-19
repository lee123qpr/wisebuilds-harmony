
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
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
import { useToast } from '@/hooks/use-toast';

const ViewQuoteDetails = () => {
  const { projectId, quoteId } = useParams();
  const { toast } = useToast();
  
  const { 
    quote, 
    freelancer, 
    project, 
    isLoading, 
    error 
  } = useQuoteDetails({ projectId, quoteId });
  
  const { 
    acceptQuote, 
    rejectQuote, 
    isAccepting, 
    isRejecting 
  } = useQuoteActions({ projectId, quoteId });

  const handleAcceptQuote = async () => {
    try {
      await acceptQuote();
      toast({
        title: 'Quote Accepted',
        description: 'The freelancer has been notified about your decision.',
      });
    } catch (error) {
      console.error('Error accepting quote:', error);
      toast({
        title: 'Failed to accept quote',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleRejectQuote = async () => {
    try {
      await rejectQuote();
      toast({
        title: 'Quote Rejected',
        description: 'The freelancer has been notified about your decision.',
      });
    } catch (error) {
      console.error('Error rejecting quote:', error);
      toast({
        title: 'Failed to reject quote',
        description: 'Please try again later.',
        variant: 'destructive',
      });
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
          
          <CardFooter>
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
            
            <QuoteStatusAlert status={quote.status} />
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ViewQuoteDetails;
