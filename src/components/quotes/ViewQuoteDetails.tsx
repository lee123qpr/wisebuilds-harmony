
import React from 'react';
import { format } from 'date-fns';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent
} from '@/components/ui/card';
import { useFreelancerQuote } from '@/hooks/quotes/useFreelancerQuote';
import QuoteStatusBadge from './details/QuoteStatusBadge';
import PriceSection from './details/PriceSection';
import TimelineSection from './details/TimelineSection';
import PaymentSection from './details/PaymentSection';
import DescriptionSection from './details/DescriptionSection';
import QuoteDetailsSkeleton from './details/QuoteDetailsSkeleton';

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

export default ViewQuoteDetails;
