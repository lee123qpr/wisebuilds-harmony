
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { freelancerProfileSchema } from '../freelancerSchema';
import * as z from 'zod';

type FreelancerIndemnityFieldProps = {
  form: UseFormReturn<z.infer<typeof freelancerProfileSchema>>;
  disabled?: boolean;
};

const FreelancerIndemnityField: React.FC<FreelancerIndemnityFieldProps> = ({ form, disabled = false }) => {
  const hasInsurance = form.watch('indemnityInsurance.hasInsurance');

  return (
    <div className="space-y-4 p-4 border rounded-md bg-gray-50">
      <h3 className="text-md font-medium">Professional Indemnity Insurance</h3>
      
      <FormField
        control={form.control}
        name="indemnityInsurance.hasInsurance"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <FormLabel>Professional Indemnity Insured</FormLabel>
              <FormDescription>
                Do you have professional indemnity insurance?
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {hasInsurance && (
        <FormField
          control={form.control}
          name="indemnityInsurance.coverLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Level of Cover</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g. £2,000,000" 
                  {...field} 
                  disabled={disabled} 
                />
              </FormControl>
              <FormDescription>
                Specify your level of professional indemnity insurance coverage
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default FreelancerIndemnityField;
