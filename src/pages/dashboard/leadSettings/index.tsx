
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import LeadSettingsForm from './LeadSettingsForm';
import LeadSettingsHeader from './LeadSettingsHeader';

const LeadSettings = () => {
  return (
    <MainLayout>
      <div className="container py-8">
        <LeadSettingsHeader />
        <LeadSettingsForm />
      </div>
    </MainLayout>
  );
};

export default LeadSettings;
