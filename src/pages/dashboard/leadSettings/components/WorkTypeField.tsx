
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LeadSettingsFormValues } from '../schema';
import { workTypeOptions } from '@/components/projects/new-project/constants';

interface WorkTypeFieldProps {
  form: UseFormReturn<LeadSettingsFormValues>;
}

export const WorkTypeField: React.FC<WorkTypeFieldProps> = ({ form }) => {
  console.log('Work type field value:', form.watch('work_type'));
  
  return (
    <FormField
      control={form.control}
      name="work_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Work Type</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            value={field.value || undefined} 
            defaultValue={field.value || undefined}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select work type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              {workTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>
            Specify if you prefer remote, on-site, or hybrid work
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
