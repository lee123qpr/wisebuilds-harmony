
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useFreelancerQuote } from '@/hooks/quotes/useFreelancerQuote';
import QuoteStatusBadge from '@/components/quotes/table/QuoteStatusBadge';
import PriceSection from '@/components/quotes/details/PriceSection';
import TimelineSection from '@/components/quotes/details/TimelineSection';
import PaymentSection from '@/components/quotes/details/PaymentSection';
import DescriptionSection from '@/components/quotes/details/DescriptionSection';
import QuoteDetailsSkeleton from '@/components/quotes/details/QuoteDetailsSkeleton';
import ProjectInfo from './components/ProjectInfo';
import { useContactInfo } from '@/hooks/leads/useContactInfo';

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
  
  const { clientInfo, isLoading: isLoadingClientInfo } = useContactInfo(projectId);
  const [clientName, setClientName] = useState<string>('Client');
  const [clientEmail, setClientEmail] = useState<string | null>(null);
  const [clientPhone, setClientPhone] = useState<string | null>(null);

  useEffect(() => {
    if (clientInfo) {
      if (clientInfo.contact_name) {
        setClientName(clientInfo.contact_name);
      }
      
      setClientEmail(clientInfo.email);
      setClientPhone(clientInfo.phone_number);
    }
  }, [clientInfo]);

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
            clientName={clientName}
            clientEmail={clientEmail}
            clientPhone={clientPhone}
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
