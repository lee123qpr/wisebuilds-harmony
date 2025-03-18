
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import MainLayout from '@/components/layout/MainLayout';
import { useQuoteDetails } from '@/hooks/quotes/useQuoteDetails';
import { useQuoteActions } from '@/hooks/quotes/useQuoteActions';
import QuoteStatusBadge from '@/components/quotes/details/QuoteStatusBadge';
import PriceSection from '@/components/quotes/details/PriceSection';
import TimelineSection from '@/components/quotes/details/TimelineSection';
import PaymentSection from '@/components/quotes/details/PaymentSection';
import DescriptionSection from '@/components/quotes/details/DescriptionSection';
import QuoteDetailsSkeleton from '@/components/quotes/details/QuoteDetailsSkeleton';
import { useToast } from '@/hooks/use-toast';

const ViewQuoteDetails = () => {
  const { projectId, quoteId } = useParams();
  const navigate = useNavigate();
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

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/project/${projectId}/quotes`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Quote Details</h1>
          </div>
          <QuoteDetailsSkeleton />
        </div>
      </MainLayout>
    );
  }

  if (error || !quote) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/project/${projectId}/quotes`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Quote Details</h1>
          </div>
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
  
  const formattedDate = format(new Date(quote.created_at), 'MMMM d, yyyy');
  const freelancerName = freelancer?.display_name || 
    (freelancer?.first_name && freelancer?.last_name 
      ? `${freelancer.first_name} ${freelancer.last_name}`
      : 'Freelancer');

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/project/${projectId}/quotes`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Quote Details</h1>
            <p className="text-muted-foreground">
              Project: {project?.title || 'Loading...'}
            </p>
          </div>
        </div>

        {/* Freelancer profile card */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={freelancer?.profile_photo} alt={freelancerName} />
                <AvatarFallback>{freelancerName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{freelancerName}</CardTitle>
                <CardDescription>
                  {freelancer?.job_title || 'Freelancer'} • Submitted on {formattedDate}
                </CardDescription>
              </div>
            </div>
            <QuoteStatusBadge status={quote.status} />
          </CardHeader>
          <CardContent className="space-y-4">
            <PriceSection quote={quote} />
            <TimelineSection quote={quote} />
            <PaymentSection quote={quote} />
            <DescriptionSection quote={quote} />
          </CardContent>
          
          {quote.status === 'pending' && (
            <CardFooter className="flex justify-end space-x-2 pt-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/messages/${quote.freelancer_id}`)}
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Message Freelancer
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="flex items-center gap-2">
                    <X className="h-4 w-4" />
                    Reject Quote
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reject Quote</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to reject this quote? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {}}>Cancel</Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleRejectQuote} 
                      disabled={isRejecting}
                    >
                      {isRejecting ? 'Rejecting...' : 'Reject Quote'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Accept Quote
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Accept Quote</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to accept this quote? This will notify the freelancer and create a contract.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {}}>Cancel</Button>
                    <Button 
                      onClick={handleAcceptQuote} 
                      disabled={isAccepting}
                    >
                      {isAccepting ? 'Accepting...' : 'Accept Quote'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          )}
          
          {quote.status === 'accepted' && (
            <CardFooter>
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-700">
                  You've accepted this quote. The freelancer has been notified and you can now proceed to finalize the contract details.
                </AlertDescription>
              </Alert>
            </CardFooter>
          )}
          
          {quote.status === 'declined' && (
            <CardFooter>
              <Alert className="bg-red-50 border-red-200">
                <AlertDescription className="text-red-700">
                  You've declined this quote. The freelancer has been notified.
                </AlertDescription>
              </Alert>
            </CardFooter>
          )}
        </Card>
      </div>
    </MainLayout>
  );
};

export default ViewQuoteDetails;
