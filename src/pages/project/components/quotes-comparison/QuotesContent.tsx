
import React from 'react';
import { QuoteWithFreelancer } from '@/types/quotes';
import ProjectQuotesComparisonTable from '@/components/quotes/ProjectQuotesComparisonTable';
import QuoteCard from '@/components/quotes/QuoteCard';

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
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Individual Quote Details</h2>
        <div className="space-y-6">
          {quotes.map((quote) => (
            <QuoteCard key={quote.id} quote={quote} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuotesContent;
