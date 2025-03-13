
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LeadSettingsFormValues } from '../schema';
import { hiringStatusOptions } from '@/components/projects/new-project/constants';

interface HiringStatusFieldProps {
  form: UseFormReturn<LeadSettingsFormValues>;
}

export const HiringStatusField: React.FC<HiringStatusFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="hiring_status"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Hiring Status</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select hiring status" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {hiringStatusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>
            Filter projects by hiring status
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
