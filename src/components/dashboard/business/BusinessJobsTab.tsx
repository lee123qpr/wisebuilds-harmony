
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQuotes } from '@/hooks/quotes/useQuotes';
import { Tabs } from '@/components/ui/tabs';
import { useFreelancerNames } from '@/hooks/clients/useFreelancerNames';

// Import our new components
import JobsHeader from './jobs/JobsHeader';
import JobsTabsList from './jobs/JobsTabsList';
import JobTabsContent from './jobs/JobTabsContent';
import JobsEmptyState from './jobs/JobsEmptyState';
import JobsLoadingSkeleton from './jobs/JobsLoadingSkeleton';

const BusinessJobsTab: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('active');
  
  // Fetch quotes with accepted status for this client (including completed ones)
  const { data: allQuotes, isLoading, refetch } = useQuotes({
    forClient: true,
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
  
  // Get freelancer names for the quotes
  const { freelancerNames } = useFreelancerNames([...activeJobs, ...completedJobs]);
  
  const handleStatusUpdate = () => {
    refetch();
  };

  if (isLoading) {
    return <JobsLoadingSkeleton />;
  }

  if (activeJobs.length === 0 && completedJobs.length === 0) {
    return <JobsEmptyState />;
  }

  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
      <div className="space-y-4">
        <JobsHeader 
          activeJobsCount={activeJobs.length} 
          completedJobsCount={completedJobs.length} 
        />
        
        <JobsTabsList 
          activeJobsCount={activeJobs.length} 
          completedJobsCount={completedJobs.length} 
        />
        
        <JobTabsContent 
          activeJobs={activeJobs} 
          completedJobs={completedJobs} 
          freelancerNames={freelancerNames} 
          handleStatusUpdate={handleStatusUpdate} 
          activeTab={activeTab}
        />
      </div>
    </Tabs>
  );
};

export default BusinessJobsTab;
