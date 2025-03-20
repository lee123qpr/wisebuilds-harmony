
import React from 'react';
import ViewQuoteDetails from '@/components/quotes/ViewQuoteDetails';

interface QuoteDetailsViewProps {
  showQuoteDetails: boolean;
  hasSubmittedQuote: boolean;
  projectId: string;
  projectTitle: string;
}

const QuoteDetailsView: React.FC<QuoteDetailsViewProps> = ({
  showQuoteDetails,
  hasSubmittedQuote,
  projectId,
  projectTitle
}) => {
  if (!showQuoteDetails || !hasSubmittedQuote) {
    return null;
  }
  
  return (
    <ViewQuoteDetails 
      projectId={projectId} 
      projectTitle={projectTitle}
    />
  );
};

export default QuoteDetailsView;
