
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { LeadSettingsFormValues } from '../schema';
import { WorkTypeField } from './WorkTypeField';
import { BudgetDurationFields } from './BudgetDurationFields';
import { HiringStatusField } from './HiringStatusField';

interface WorkDetailsGroupProps {
  form: UseFormReturn<LeadSettingsFormValues>;
}

export const WorkDetailsGroup: React.FC<WorkDetailsGroupProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <WorkTypeField form={form} />
      <BudgetDurationFields form={form} />
      <HiringStatusField form={form} />
    </div>
  );
};
