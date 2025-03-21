
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import JobsList from '../../freelancer/jobs/JobsList';
import { QuoteWithFreelancer } from '@/types/quotes';

interface JobTabsContentProps {
  activeJobs: QuoteWithFreelancer[];
  completedJobs: QuoteWithFreelancer[];
  freelancerNames: Record<string, string>;
  handleStatusUpdate: () => void;
  activeTab: string;
}

const JobTabsContent: React.FC<JobTabsContentProps> = ({
  activeJobs,
  completedJobs,
  freelancerNames,
  handleStatusUpdate,
  activeTab
}) => {
  return (
    <>
      <TabsContent value="active">
        <JobsList 
          jobs={activeJobs}
          clientNames={freelancerNames}
          onStatusUpdate={handleStatusUpdate}
          emptyTitle="Active Hires"
          emptyDescription="You don't have any active hires at the moment. When you accept a quote from a freelancer, they will appear here."
        />
      </TabsContent>
      
      <TabsContent value="completed">
        <JobsList 
          jobs={completedJobs}
          clientNames={freelancerNames}
          onStatusUpdate={handleStatusUpdate}
          emptyTitle="Completed Hires"
          emptyDescription="You haven't completed any hires yet. Hires will appear here after both you and the freelancer mark them as complete."
        />
      </TabsContent>
    </>
  );
};

export default JobTabsContent;
