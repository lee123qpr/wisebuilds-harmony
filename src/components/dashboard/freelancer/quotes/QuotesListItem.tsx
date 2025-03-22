
import React from 'react';
import PurchasedProjectCard from '../PurchasedProjectCard';
import { ApplicationWithProject } from '@/hooks/freelancer/useApplicationsWithQuotes';
import { cn } from '@/lib/utils';

interface QuotesListItemProps {
  project: ApplicationWithProject;
}

const QuotesListItem: React.FC<QuotesListItemProps> = ({ project }) => {
  // Define status-based styles
  const getStatusStyles = (status?: string) => {
    switch (status) {
      case 'accepted':
        return 'border-l-4 border-green-500 bg-green-50';
      case 'pending':
        return 'border-l-4 border-amber-500 bg-yellow-50';
      case 'declined':
        return 'border-l-4 border-red-500 bg-red-50';
      default:
        return 'border-l-4 border-gray-500 bg-gray-50';
    }
  };

  return (
    <div className={cn("rounded-md overflow-hidden", getStatusStyles(project.quote_status))}>
      <PurchasedProjectCard 
        key={project.id}
        project={{
          ...project,
          quote_status: project.quote_status
        }}
      />
    </div>
  );
};

export default QuotesListItem;
