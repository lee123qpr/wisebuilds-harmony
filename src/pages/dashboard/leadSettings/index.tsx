
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import LeadSettingsForm from './LeadSettingsForm';

const LeadSettings = () => {
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Lead Settings</h1>
          <p className="text-muted-foreground">Configure your preferences for project leads</p>
        </div>
        
        <LeadSettingsForm />
      </div>
    </MainLayout>
  );
};

export default LeadSettings;
