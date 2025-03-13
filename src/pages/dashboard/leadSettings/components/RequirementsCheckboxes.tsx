
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { LeadSettingsFormValues } from '../schema';

interface RequirementsCheckboxesProps {
  form: UseFormReturn<LeadSettingsFormValues>;
}

export const RequirementsCheckboxes: React.FC<RequirementsCheckboxesProps> = ({ form }) => {
  return (
    <div className="space-y-3">
      <FormLabel>Specific Requirements</FormLabel>
      <div className="space-y-2">
        <FormField
          control={form.control}
          name="requires_insurance"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Include Projects Requiring Insurance</FormLabel>
                <FormDescription>
                  Check if you're willing to work on projects that require professional indemnity insurance
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="requires_site_visits"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Include Projects Requiring Site Visits</FormLabel>
                <FormDescription>
                  Check if you're available for projects that require site visits
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
