
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { LeadSettingsFormValues } from '../schema';
import { LocationField } from '@/components/location/LocationField';
import { RoleField } from './RoleField';

interface RoleLocationGroupProps {
  form: UseFormReturn<LeadSettingsFormValues>;
}

export const RoleLocationGroup: React.FC<RoleLocationGroupProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <RoleField form={form} />
      
      <LocationField 
        form={form} 
        name="location"
        label="Location"
        description="Where you want to work"
      />
    </div>
  );
};
