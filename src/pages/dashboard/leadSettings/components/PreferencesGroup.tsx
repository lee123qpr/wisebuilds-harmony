
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { LeadSettingsFormValues } from '../schema';
import { RequirementsCheckboxes } from './RequirementsCheckboxes';
import BackButton from '@/components/common/BackButton';

interface PreferencesGroupProps {
  form: UseFormReturn<LeadSettingsFormValues>;
}

export const PreferencesGroup: React.FC<PreferencesGroupProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <BackButton 
          to="/dashboard/freelancer"
          variant="outline"
          className="mb-4"
        />
      </div>
      <RequirementsCheckboxes form={form} />
    </div>
  );
};
