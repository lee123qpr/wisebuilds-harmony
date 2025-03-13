
import React from 'react';
import EmptyStateCard from './EmptyStateCard';

const ActiveJobsTab: React.FC = () => {
  return (
    <EmptyStateCard
      title="Active Jobs"
      description="You don't have any active jobs at the moment."
    />
  );
};

export default ActiveJobsTab;
