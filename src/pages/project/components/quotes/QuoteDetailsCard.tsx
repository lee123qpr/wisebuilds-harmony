
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import QuoteStatusBadge from '@/components/quotes/details/QuoteStatusBadge';
import PriceSection from '@/components/quotes/details/PriceSection';
import TimelineSection from '@/components/quotes/details/TimelineSection';
import PaymentSection from '@/components/quotes/details/PaymentSection';
import DescriptionSection from '@/components/quotes/details/DescriptionSection';
import FreelancerProfileCard from './FreelancerProfileCard';
import QuoteActionButtons from './QuoteActionButtons';
import QuoteStatusAlert from './QuoteStatusAlert';
import { Quote } from '@/types/quotes';

interface QuoteDetailsCardProps {
  quote: Quote;
  freelancer: any;
  onAcceptQuote: () => Promise<void>;
  onRejectQuote: () => Promise<void>;
  isAccepting: boolean;
  isRejecting: boolean;
}

const QuoteDetailsCard: React.FC<QuoteDetailsCardProps> = ({
  quote,
  freelancer,
  onAcceptQuote,
  onRejectQuote,
  isAccepting,
  isRejecting,
}) => {
  return (
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
            onAccept={onAcceptQuote}
            onReject={onRejectQuote}
            isAccepting={isAccepting}
            isRejecting={isRejecting}
          />
        )}
        
        {quote.status !== 'pending' && (
          <QuoteStatusAlert status={quote.status} />
        )}
      </CardFooter>
    </Card>
  );
};

export default QuoteDetailsCard;
