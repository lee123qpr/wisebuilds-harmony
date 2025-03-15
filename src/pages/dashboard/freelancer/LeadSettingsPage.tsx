
import React from 'react';
import LeadSettings from '@/pages/dashboard/leadSettings';

const LeadSettingsPage = () => {
  // This component directly renders the newly rebuilt LeadSettings component
  // The authentication and redirect logic is now within the LeadSettings component
  return <LeadSettings />;
};

export default LeadSettingsPage;
