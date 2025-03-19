
import React from 'react';
import { QuoteWithFreelancer } from '@/types/quotes';
import ProjectQuotesComparisonTable from '@/components/quotes/ProjectQuotesComparisonTable';

interface QuotesContentProps {
  quotes: QuoteWithFreelancer[];
}

const QuotesContent: React.FC<QuotesContentProps> = ({ quotes }) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Quotes for Your Project</h2>
      </div>
      <ProjectQuotesComparisonTable quotes={quotes} />
    </div>
  );
};

export default QuotesContent;
