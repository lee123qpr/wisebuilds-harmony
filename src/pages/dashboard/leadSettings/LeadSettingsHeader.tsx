
import React from 'react';
import BackButton from '@/components/common/BackButton';

const LeadSettingsHeader: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-2">
        <BackButton to="/dashboard/freelancer" />
        <h1 className="text-3xl font-bold">Lead Settings</h1>
      </div>
      <p className="text-muted-foreground">Configure your preferences for project leads</p>
    </div>
  );
};

export default LeadSettingsHeader;
