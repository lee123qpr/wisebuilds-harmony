
import React, { useEffect } from 'react';
import { useApplicationsWithQuotes } from '@/hooks/freelancer/useApplicationsWithQuotes';
import QuotesEmptyState from './quotes/QuotesEmptyState';
import QuotesInfoAlert from './quotes/QuotesInfoAlert';
import QuoteStatsSummary from './quotes/QuoteStatsSummary';
import QuotesList from './quotes/QuotesList';
import { Bookmark } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const QuotesTab: React.FC = () => {
  const {
    applications,
    isLoading,
    error,
    refetch
  } = useApplicationsWithQuotes();
  
  // Force refresh when tab becomes visible
  useEffect(() => {
    refetch();
  }, [refetch]);
  
  if (error) {
    console.error('Error loading applications:', error);
  }
  
  // Filter out completed applications/quotes
  const activeApplications = applications?.filter(app => {
    // Filter out applications where the quote has been marked as complete
    // A quote is complete when it has a completed_at timestamp set
    return !app.completed_at;
  });
  
  // If no applications or still loading with no data yet
  if (!isLoading && (!activeApplications || activeApplications.length === 0)) {
    return <QuotesEmptyState />;
  }
  
  // Count accepted quotes for the info alert - do this without making another API call
  const acceptedCount = activeApplications?.filter(p => p.quote_status === 'accepted').length || 0;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Bookmark className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold tracking-tight">
          My Quotes
          <Badge variant="secondary" className="ml-2 text-sm font-medium">
            {activeApplications?.length || 0}
          </Badge>
        </h2>
      </div>
      <p className="text-muted-foreground mb-4">
        Projects you've purchased contact information for
      </p>
      
      <QuotesInfoAlert acceptedCount={acceptedCount} />
      
      {/* Quote status summary */}
      <QuoteStatsSummary applications={activeApplications} />
      
      {/* List of quotes - applications are sorted in the QuotesList component */}
      <QuotesList 
        applications={activeApplications}
        isLoading={isLoading}
      />
    </div>
  );
};

export default QuotesTab;
