
import React from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyStateCard from './EmptyStateCard';

const ApplicationsTab: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <EmptyStateCard
      title="My Applications"
      description="You haven't applied to any projects yet."
      buttonText="Browse Available Projects"
      buttonAction={() => navigate('/marketplace')}
    />
  );
};

export default ApplicationsTab;
