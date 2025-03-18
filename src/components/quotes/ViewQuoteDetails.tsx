
import React from 'react';
import { format } from 'date-fns';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFreelancerQuote } from '@/hooks/quotes/useFreelancerQuote';
import { Quote } from '@/types/quotes';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, Clock, X } from 'lucide-react';

interface ViewQuoteDetailsProps {
  projectId: string;
  projectTitle: string;
}

const ViewQuoteDetails: React.FC<ViewQuoteDetailsProps> = ({ projectId, projectTitle }) => {
  const { data: quote, isLoading, error } = useFreelancerQuote({ projectId });

  if (isLoading) {
    return <QuoteDetailsSkeleton />;
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">Error Loading Quote</CardTitle>
          <CardDescription>
            There was a problem loading your quote details.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!quote) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-700">No Quote Found</CardTitle>
          <CardDescription>
            You haven't submitted a quote for this project yet.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Your Quote for {projectTitle}</CardTitle>
            <CardDescription>
              Submitted on {format(new Date(quote.created_at), 'MMMM d, yyyy')}
            </CardDescription>
          </div>
          <QuoteStatusBadge status={quote.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <PriceSection quote={quote} />
        <TimelineSection quote={quote} />
        <PaymentSection quote={quote} />
        <DescriptionSection quote={quote} />
      </CardContent>
    </Card>
  );
};

const QuoteStatusBadge = ({ status }: { status: Quote['status'] }) => {
  switch (status) {
    case 'pending':
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    case 'accepted':
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
          <Check className="h-3 w-3" />
          Accepted
        </Badge>
      );
    case 'declined':
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
          <X className="h-3 w-3" />
          Declined
        </Badge>
      );
    default:
      return null;
  }
};

const PriceSection = ({ quote }: { quote: Quote }) => {
  // Determine which price type was used
  const priceType = quote.fixed_price 
    ? 'Fixed Price' 
    : quote.estimated_price 
      ? 'Estimated Price' 
      : quote.day_rate 
        ? 'Day Rate' 
        : 'Not specified';
  
  const priceValue = quote.fixed_price || quote.estimated_price || quote.day_rate || 'Not specified';

  return (
    <div className="space-y-2">
      <h3 className="text-md font-semibold">Price Details</h3>
      <div className="bg-slate-50 p-3 rounded-md">
        <div className="grid grid-cols-2 gap-2">
          <span className="text-sm text-slate-600">Price Type:</span>
          <span className="text-sm font-medium">{priceType}</span>
          
          <span className="text-sm text-slate-600">Amount:</span>
          <span className="text-sm font-medium">{priceValue}</span>
        </div>
      </div>
    </div>
  );
};

const TimelineSection = ({ quote }: { quote: Quote }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-md font-semibold">Timeline</h3>
      <div className="bg-slate-50 p-3 rounded-md">
        <div className="grid grid-cols-2 gap-2">
          <span className="text-sm text-slate-600">Start Date:</span>
          <span className="text-sm font-medium">
            {quote.available_start_date 
              ? format(new Date(quote.available_start_date), 'MMMM d, yyyy') 
              : 'Not specified'}
          </span>
          
          <span className="text-sm text-slate-600">Duration:</span>
          <span className="text-sm font-medium">
            {quote.estimated_duration && quote.duration_unit 
              ? `${quote.estimated_duration} ${quote.duration_unit}` 
              : 'Not specified'}
          </span>
        </div>
      </div>
    </div>
  );
};

const PaymentSection = ({ quote }: { quote: Quote }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-md font-semibold">Payment Details</h3>
      <div className="bg-slate-50 p-3 rounded-md">
        <div className="grid grid-cols-2 gap-2">
          <span className="text-sm text-slate-600">Payment Method:</span>
          <span className="text-sm font-medium">
            {quote.preferred_payment_method || 'Not specified'}
          </span>
          
          <span className="text-sm text-slate-600">Payment Terms:</span>
          <span className="text-sm font-medium">
            {quote.payment_terms || 'Not specified'}
          </span>
        </div>
      </div>
    </div>
  );
};

const DescriptionSection = ({ quote }: { quote: Quote }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-md font-semibold">Description</h3>
      <div className="bg-slate-50 p-3 rounded-md">
        <p className="text-sm whitespace-pre-wrap">{quote.description || 'No description provided.'}</p>
      </div>
    </div>
  );
};

const QuoteDetailsSkeleton = () => (
  <Card className="mb-6">
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2 mt-2" />
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/4" />
        <div className="bg-slate-50 p-3 rounded-md">
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/4" />
        <div className="bg-slate-50 p-3 rounded-md">
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default ViewQuoteDetails;
