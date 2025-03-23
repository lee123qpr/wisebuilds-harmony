
import React from 'react';
import { QuoteWithFreelancer } from '@/types/quotes';
import JobCard from './JobCard';
import EmptyStateCard from '../EmptyStateCard';

interface JobsListProps {
  jobs: QuoteWithFreelancer[];
  clientNames: Record<string, string>;
  onStatusUpdate: () => void;
  emptyTitle: string;
  emptyDescription: string;
  user?: any; // Add the user prop to the interface
}

const JobsList: React.FC<JobsListProps> = ({ 
  jobs, 
  clientNames, 
  onStatusUpdate, 
  emptyTitle, 
  emptyDescription,
  user // Add the user prop parameter
}) => {
  if (jobs.length === 0) {
    return (
      <EmptyStateCard
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {jobs.map((quote) => (
        <JobCard 
          key={quote.id}
          quote={quote}
          clientName={clientNames[quote.client_id] || 'Client'}
          onStatusUpdate={onStatusUpdate}
          user={user} // Pass the user prop to JobCard
        />
      ))}
    </div>
  );
};

export default JobsList;
