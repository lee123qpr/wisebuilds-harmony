
import React from 'react';
import EmptyStateCard from './EmptyStateCard';

const MessagesTab: React.FC = () => {
  return (
    <EmptyStateCard
      title="Messages"
      description="You don't have any messages yet."
    />
  );
};

export default MessagesTab;
