
import React from 'react';
import QuoteDetailsHeader from './QuoteDetailsHeader';
import QuoteDetailsSkeleton from '@/components/quotes/details/QuoteDetailsSkeleton';

interface QuoteDetailsLoadingProps {
  projectId: string;
}

const QuoteDetailsLoading: React.FC<QuoteDetailsLoadingProps> = ({ projectId }) => {
  return (
    <>
      <QuoteDetailsHeader 
        projectId={projectId} 
        projectTitle={undefined}
      />
      <QuoteDetailsSkeleton />
    </>
  );
};

export default QuoteDetailsLoading;
