
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { LeadSettingsFormValues } from '../schema';
import { RequirementsCheckboxes } from './RequirementsCheckboxes';

interface PreferencesGroupProps {
  form: UseFormReturn<LeadSettingsFormValues>;
}

export const PreferencesGroup: React.FC<PreferencesGroupProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <RequirementsCheckboxes form={form} />
    </div>
  );
};
