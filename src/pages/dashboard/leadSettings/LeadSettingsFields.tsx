
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { LeadSettingsFormValues } from './schema';
import { RoleLocationGroup } from './components/RoleLocationGroup';
import { WorkDetailsGroup } from './components/WorkDetailsGroup';
import { PreferencesGroup } from './components/PreferencesGroup';

const LeadSettingsFields: React.FC<{ form: UseFormReturn<LeadSettingsFormValues> }> = ({ form }) => {
  return (
    <div className="space-y-8">
      <RoleLocationGroup form={form} />
      <WorkDetailsGroup form={form} />
      <PreferencesGroup form={form} />
    </div>
  );
};

export default LeadSettingsFields;
