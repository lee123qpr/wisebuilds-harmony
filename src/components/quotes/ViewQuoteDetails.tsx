
import React from 'react';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useFreelancerQuote } from '@/hooks/quotes/useFreelancerQuote';
import QuoteStatusBadge from '@/components/quotes/details/QuoteStatusBadge';
import PriceSection from '@/components/quotes/details/PriceSection';
import TimelineSection from '@/components/quotes/details/TimelineSection';
import PaymentSection from '@/components/quotes/details/PaymentSection';
import DescriptionSection from '@/components/quotes/details/DescriptionSection';
import QuoteDetailsSkeleton from '@/components/quotes/details/QuoteDetailsSkeleton';
import ProjectInfo from './components/ProjectInfo';

interface ViewQuoteDetailsProps {
  projectId: string;
  projectTitle: string;
}

const ViewQuoteDetails: React.FC<ViewQuoteDetailsProps> = ({ 
  projectId, 
  projectTitle 
}) => {
  const { 
    data: quote, 
    isLoading, 
    error 
  } = useFreelancerQuote({ projectId });

  if (isLoading) {
    return <QuoteDetailsSkeleton />;
  }

  if (error || !quote) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {error ? 'Error loading quote details.' : 'No quote found for this project.'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const createdDate = quote.created_at ? format(new Date(quote.created_at), 'MMMM d, yyyy h:mm a') : 'Unknown date';
  
  return (
    <Card className="border-t-4 border-t-blue-500">
      <CardContent className="p-4">
        <div className="space-y-4">
          <ProjectInfo 
            projectTitle={projectTitle} 
            clientName="Client"
            quoteSubmitted={true}
            submissionDate={createdDate}
          />
          
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Your Quote</h3>
            <QuoteStatusBadge status={quote.status} />
          </div>
          
          <Separator />
          
          <PriceSection quote={quote} />
          
          <TimelineSection quote={quote} />
          
          <PaymentSection quote={quote} />
          
          <DescriptionSection quote={quote} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ViewQuoteDetails;
