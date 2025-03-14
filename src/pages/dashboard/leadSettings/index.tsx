
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import LeadSettingsForm from './LeadSettingsForm';
import LeadSettingsHeader from './LeadSettingsHeader';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const LeadSettings = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Debug: Log current location and authentication state
  React.useEffect(() => {
    console.log('Current route:', location.pathname);
    console.log('Auth state in LeadSettings:', { user, authLoading });
  }, [user, authLoading, location]);

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
        <LeadSettingsForm />
        <Toaster />
      </div>
    </MainLayout>
  );
};

export default LeadSettings;
