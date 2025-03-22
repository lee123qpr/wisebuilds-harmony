
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQuotes } from '@/hooks/quotes/useQuotes';
import { Tabs, TabsContent } from '@/components/ui/tabs';

// Import the smaller components
import LoadingSkeleton from './quotes/LoadingSkeleton';
import NoQuotesMessage from './quotes/NoQuotesMessage';
import QuoteTabsNav from './quotes/QuoteTabsNav';
import QuotesList from './quotes/QuotesList';
import QuotesHeader from './quotes/QuotesHeader';

const QuotesTab: React.FC = () => {
  const { user } = useAuth();
  
  // Fetch quotes for this client, forcefully excluding quotes for completed projects
  const { data: quotes, isLoading, refetch } = useQuotes({
    forClient: true,
    includeAllQuotes: true, // Always get all quotes regardless of status
    excludeCompletedProjects: true, // Always exclude quotes for completed projects
    refreshInterval: 30000 // Change from 5000 (5 seconds) to 30000 (30 seconds)
  });
  
  const [activeTab, setActiveTab] = useState('pending'); // Changed default tab to pending to see new quotes first
  
  // Force refresh when component mounts but don't set up additional refresh interval
  useEffect(() => {
    console.log("BusinessQuotesTab: Forcing quotes refresh on mount");
    refetch();
  }, [refetch]);
  
  // Log quotes data for debugging
  useEffect(() => {
    if (quotes) {
      console.log(`BusinessQuotesTab: Got ${quotes.length} quotes`, quotes);
    }
  }, [quotes]);
  
  // Filter quotes based on tab
  const filteredQuotes = quotes?.filter(quote => {
    if (activeTab === 'accepted') return quote.status === 'accepted' && quote.project?.status !== 'completed';
    if (activeTab === 'pending') return quote.status === 'pending';
    if (activeTab === 'declined') return quote.status === 'declined';
    return true;
  }) || [];
  
  const tabCounts = {
    accepted: quotes?.filter(q => q.status === 'accepted' && q.project?.status !== 'completed')?.length || 0,
    pending: quotes?.filter(q => q.status === 'pending')?.length || 0,
    declined: quotes?.filter(q => q.status === 'declined')?.length || 0
  };
  
  const handleStatusUpdate = () => {
    refetch();
  };
  
  if (isLoading) {
    return <LoadingSkeleton />;
  }
  
  // Only show NoQuotesMessage if quotes array is actually empty or null
  if (!quotes || quotes.length === 0) {
    return <NoQuotesMessage />;
  }
  
  const totalQuotes = quotes.length;
  
  return (
    <div className="space-y-4">
      <QuotesHeader totalQuotes={totalQuotes} />
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <QuoteTabsNav tabCounts={tabCounts} />
        
        <TabsContent value={activeTab} className="mt-4">
          <QuotesList 
            quotes={filteredQuotes} 
            activeTab={activeTab} 
            user={user} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuotesTab;
