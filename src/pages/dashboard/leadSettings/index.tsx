
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Toaster } from '@/components/ui/toaster';
import NewLeadSettingsForm from './NewLeadSettingsForm';
import LeadSettingsHeader from './LeadSettingsHeader';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

const LeadSettings = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Invalidate lead settings query to ensure we get fresh data
  React.useEffect(() => {
    if (user) {
      queryClient.invalidateQueries({ queryKey: ['leadSettings'] });
    }
  }, [user, queryClient]);
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth/login');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <MainLayout>
        <div className="container py-8 flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return null; // Will redirect due to the effect above
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <LeadSettingsHeader />
        <NewLeadSettingsForm />
        <Toaster />
      </div>
    </MainLayout>
  );
};

export default LeadSettings;
