
import { useState } from 'react';
import { useQuotes } from '@/hooks/quotes/useQuotes';
import { useClientNames } from '@/hooks/clients/useClientNames';

export const useActiveJobs = () => {
  const [activeTab, setActiveTab] = useState('active');
  
  // Fetch quotes with accepted status for this freelancer (including completed ones)
  const { data: allQuotes, isLoading, refetch } = useQuotes({
    forClient: false,
    includeAllQuotes: false,
    refreshInterval: 10000
  });
  
  // Filter for active and completed jobs
  const activeJobs = allQuotes?.filter(quote => 
    quote.status === 'accepted' && !quote.completed_at
  ) || [];
  
  const completedJobs = allQuotes?.filter(quote => 
    quote.status === 'accepted' && quote.completed_at
  ) || [];
  
  // Get client names for the projects
  const { clientNames } = useClientNames([...activeJobs, ...completedJobs]);
  
  const handleStatusUpdate = () => {
    refetch();
  };

  return {
    activeJobs,
    completedJobs,
    clientNames,
    isLoading,
    activeTab,
    setActiveTab,
    handleStatusUpdate
  };
};
