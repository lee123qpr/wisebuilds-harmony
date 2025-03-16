
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LeadSettingsFormValues } from '../schema';
import { roleOptions } from '@/components/projects/new-project/constants';

interface RoleFieldProps {
  form: UseFormReturn<LeadSettingsFormValues>;
}

export const RoleField: React.FC<RoleFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="role"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Role Required</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select required role" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {roleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>
            Select the role you're interested in
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
