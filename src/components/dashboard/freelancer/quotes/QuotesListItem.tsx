
import React from 'react';
import PurchasedProjectCard from '../PurchasedProjectCard';
import { ApplicationWithProject } from '@/hooks/freelancer/useApplicationsWithQuotes';

interface QuotesListItemProps {
  project: ApplicationWithProject;
}

const QuotesListItem: React.FC<QuotesListItemProps> = ({ project }) => {
  return (
    <PurchasedProjectCard 
      key={project.id}
      project={{
        ...project,
        quote_status: project.quote_status
      }}
    />
  );
};

export default QuotesListItem;
