
import React from 'react';
import { QuoteWithFreelancer } from '@/types/quotes';
import QuoteListItem from './QuoteListItem';
import EmptyQuoteState from './EmptyQuoteState';

interface QuotesListProps {
  quotes: QuoteWithFreelancer[];
  activeTab: string;
  user: any;
}

const QuotesList: React.FC<QuotesListProps> = ({ quotes, activeTab, user }) => {
  if (quotes.length === 0) {
    return <EmptyQuoteState activeTab={activeTab} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {quotes.map((quote) => (
        <QuoteListItem key={quote.id} quote={quote} user={user} />
      ))}
    </div>
  );
};

export default QuotesList;
