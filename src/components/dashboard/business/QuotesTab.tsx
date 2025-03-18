
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useQuotes } from '@/hooks/quotes/useQuotes';
import QuoteCard from '@/components/quotes/QuoteCard';
import EmptyStateCard from '@/components/dashboard/freelancer/EmptyStateCard';
import { Skeleton } from '@/components/ui/skeleton';

const BusinessQuotesTab: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  
  const { quotes, isLoading } = useQuotes({ 
    projectId: projectId || undefined,
    forClient: true 
  });
  
  if (isLoading) {
    return <QuotesTabSkeleton />;
  }
  
  if (quotes.length === 0) {
    return (
      <EmptyStateCard
        title="No quotes yet"
        description="When freelancers submit quotes for your projects, they will appear here."
      />
    );
  }
  
  return (
    <div className="space-y-4">
      {quotes.map((quote) => (
        <QuoteCard key={quote.id} quote={quote} />
      ))}
    </div>
  );
};

const QuotesTabSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="p-6">
        <div className="flex justify-between mb-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-6 w-1/6" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <Skeleton className="h-16 rounded-md" />
          <Skeleton className="h-16 rounded-md" />
          <Skeleton className="h-16 rounded-md" />
        </div>
      </Card>
    ))}
  </div>
);

export default BusinessQuotesTab;
