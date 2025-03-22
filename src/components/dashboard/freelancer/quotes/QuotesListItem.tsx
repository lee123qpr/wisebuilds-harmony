
import React from 'react';
import PurchasedProjectCard from '../PurchasedProjectCard';
import { ApplicationWithProject } from '@/hooks/freelancer/useApplicationsWithQuotes';
import { cn } from '@/lib/utils';
import { formatRole } from '@/utils/projectFormatters';

interface QuotesListItemProps {
  project: ApplicationWithProject;
}

const QuotesListItem: React.FC<QuotesListItemProps> = ({ project }) => {
  // Define status-based styles
  const getStatusStyles = (status?: string) => {
    switch (status) {
      case 'accepted':
        return 'border-2 border-green-500 bg-green-50';
      case 'pending':
        return 'border-2 border-amber-500 bg-yellow-50';
      case 'declined':
        return 'border-2 border-red-500 bg-red-50';
      default:
        return 'border-2 border-gray-300 bg-gray-50';
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
