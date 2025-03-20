
import React from 'react';
import PurchasedProjectCard from '../PurchasedProjectCard';
import { ApplicationWithProject } from '@/hooks/freelancer/useApplicationsWithQuotes';

interface QuotesListProps {
  applications: ApplicationWithProject[] | undefined;
  isLoading: boolean;
}

const QuotesList: React.FC<QuotesListProps> = ({ applications, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }
  
  if (!applications || applications.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      {applications.map((project) => (
        <PurchasedProjectCard 
          key={project.id}
          project={{
            ...project,
            quote_status: project.quote_status
          }}
        />
      ))}
    </div>
  );
};

export default QuotesList;
