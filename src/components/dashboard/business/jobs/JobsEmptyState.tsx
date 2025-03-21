
import React from 'react';
import EmptyStateCard from '../../freelancer/EmptyStateCard';

const JobsEmptyState: React.FC = () => {
  return (
    <EmptyStateCard
      title="My Hires"
      description="You don't have any active hires at the moment. When you accept a quote from a freelancer, they will appear here."
    />
  );
};

export default JobsEmptyState;
