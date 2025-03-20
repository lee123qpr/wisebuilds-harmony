
import { useState } from 'react';
import { useFreelancerQuote } from '@/hooks/quotes/useFreelancerQuote';

export const useProjectQuote = (projectId: string) => {
  const [showQuoteDetails, setShowQuoteDetails] = useState(false);
  
  // Check if the freelancer has already submitted a quote
  const { data: existingQuote, isLoading: isCheckingQuote } = useFreelancerQuote({
    projectId
  });
  
  const hasSubmittedQuote = !!existingQuote;
  
  const handleRefresh = () => {
    setShowQuoteDetails(true);
  };
  
  return {
    existingQuote,
    isCheckingQuote,
    hasSubmittedQuote,
    showQuoteDetails,
    setShowQuoteDetails,
    handleRefresh
  };
};
