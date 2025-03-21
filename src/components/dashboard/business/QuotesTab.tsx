
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQuotes } from '@/hooks/quotes/useQuotes';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { QuoteWithFreelancer } from '@/types/quotes';

// Import the smaller components
import LoadingSkeleton from './quotes/LoadingSkeleton';
import NoQuotesMessage from './quotes/NoQuotesMessage';
import QuoteTabsNav from './quotes/QuoteTabsNav';
import QuotesList from './quotes/QuotesList';

const QuotesTab: React.FC = () => {
  const { user } = useAuth();
  
  // Fetch quotes for this client
  const { data: quotes, isLoading, refetch } = useQuotes({
    forClient: true,
    includeAllQuotes: true
  });
  
  const [activeTab, setActiveTab] = useState('accepted');
  
  // Filter quotes based on tab
  const filteredQuotes = quotes?.filter(quote => {
    if (activeTab === 'accepted') return quote.status === 'accepted';
    if (activeTab === 'pending') return quote.status === 'pending';
    if (activeTab === 'declined') return quote.status === 'declined';
    return true;
  }) || [];
  
  const tabCounts = {
    accepted: quotes?.filter(q => q.status === 'accepted')?.length || 0,
    pending: quotes?.filter(q => q.status === 'pending')?.length || 0,
    declined: quotes?.filter(q => q.status === 'declined')?.length || 0
  };
  
  const handleStatusUpdate = () => {
    refetch();
  };
  
  if (isLoading) {
    return <LoadingSkeleton />;
  }
  
  if (!quotes || quotes.length === 0) {
    return <NoQuotesMessage />;
  }
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="accepted" value={activeTab} onValueChange={setActiveTab}>
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
