
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { LeadSettingsFormValues } from '../schema';
import { RequirementsCheckboxes } from './RequirementsCheckboxes';
import { KeywordsField } from './KeywordsField';

interface PreferencesGroupProps {
  form: UseFormReturn<LeadSettingsFormValues>;
}

export const PreferencesGroup: React.FC<PreferencesGroupProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <RequirementsCheckboxes form={form} />
      <KeywordsField form={form} />
    </div>
  );
};
