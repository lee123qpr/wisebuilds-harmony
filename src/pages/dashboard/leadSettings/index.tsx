
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import LeadSettingsForm from './LeadSettingsForm';
import LeadSettingsHeader from './LeadSettingsHeader';
import { Toaster } from '@/components/ui/toaster';

const LeadSettings = () => {
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
