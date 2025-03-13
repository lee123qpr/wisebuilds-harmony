
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { LeadSettingsFormValues } from './schema';
import { LocationField } from '@/components/location/LocationField';
import { RoleField } from './components/RoleField';
import { WorkTypeField } from './components/WorkTypeField';
import { BudgetDurationFields } from './components/BudgetDurationFields';
import { HiringStatusField } from './components/HiringStatusField';
import { RequirementsCheckboxes } from './components/RequirementsCheckboxes';
import { KeywordsField } from './components/KeywordsField';

const LeadSettingsFields: React.FC<{ form: UseFormReturn<LeadSettingsFormValues> }> = ({ form }) => {
  return (
    <div className="space-y-6">
      <RoleField form={form} />
      
      <LocationField 
        form={form} 
        name="location"
        label="Location"
        description="Where you want to work (UK and Ireland locations only)"
      />
      
      <WorkTypeField form={form} />
      
      <BudgetDurationFields form={form} />
      
      <HiringStatusField form={form} />

      <RequirementsCheckboxes form={form} />
      
      <KeywordsField form={form} />
    </div>
  );
};

export default LeadSettingsFields;
