
import React from 'react';
import LeadSettings from '@/pages/dashboard/leadSettings';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LeadSettingsPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth/login');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect due to the effect above
  }

  // This component renders the main LeadSettings component
  // It serves as a bridge for the new route structure
  return <LeadSettings />;
};

export default LeadSettingsPage;
