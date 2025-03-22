
import React from 'react';
import { ApplicationWithProject } from '@/hooks/freelancer/useApplicationsWithQuotes';
import QuotesListSkeleton from './QuotesListSkeleton';
import QuotesListItem from './QuotesListItem';
import QuotesListEmpty from './QuotesListEmpty';

interface QuotesListProps {
  applications: ApplicationWithProject[] | undefined;
  isLoading: boolean;
}

const QuotesList: React.FC<QuotesListProps> = ({ applications, isLoading }) => {
  if (isLoading) {
    return <QuotesListSkeleton />;
  }
  
  if (!applications || applications.length === 0) {
    return <QuotesListEmpty />;
  }
  
  // Sort applications with newest at the top based on application_created_at
  const sortedApplications = [...applications].sort((a, b) => {
    return new Date(b.application_created_at).getTime() - new Date(a.application_created_at).getTime();
  });
  
  return (
    <div className="space-y-4">
      {sortedApplications.map((project) => (
        <QuotesListItem key={project.id} project={project} />
      ))}
    </div>
  );
};

export default QuotesList;
