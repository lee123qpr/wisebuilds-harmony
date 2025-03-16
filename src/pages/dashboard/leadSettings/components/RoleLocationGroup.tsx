
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { LeadSettingsFormValues } from '../schema';
import { RoleField } from './RoleField';
import { LocationFieldWithRemote } from './LocationFieldWithRemote';

interface RoleLocationGroupProps {
  form: UseFormReturn<LeadSettingsFormValues>;
}

export const RoleLocationGroup: React.FC<RoleLocationGroupProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <RoleField form={form} />
      <LocationFieldWithRemote form={form} />
    </div>
  );
};
