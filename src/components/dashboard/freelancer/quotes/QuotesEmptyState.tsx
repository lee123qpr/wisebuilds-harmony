
import React from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyStateCard from '../EmptyStateCard';

const QuotesEmptyState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <EmptyStateCard
      title="My Quotes"
      description="Once you purchase a lead, the project details and client contact information will appear here."
      buttonText="Browse Available Projects"
      buttonAction={() => navigate('/dashboard/freelancer')}
    />
  );
};

export default QuotesEmptyState;
