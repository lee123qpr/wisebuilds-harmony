
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { freelancerProfileSchema } from '../freelancerSchema';
import * as z from 'zod';

type FreelancerIndemnityFieldProps = {
  form: UseFormReturn<z.infer<typeof freelancerProfileSchema>>;
  disabled?: boolean;
};

const coverLevels = [
  "£100,000",
  "£250,000",
  "£500,000",
  "£1,000,000",
  "£2,000,000",
  "£5,000,000",
  "£10,000,000+"
];

const FreelancerIndemnityField: React.FC<FreelancerIndemnityFieldProps> = ({ form, disabled = false }) => {
  const hasInsurance = form.watch('indemnityInsurance.hasInsurance');

  return (
    <div className="space-y-4">
      <h4 className="text-md font-medium">Professional Indemnity Insurance</h4>
      
      <FormField
        control={form.control}
        name="indemnityInsurance.hasInsurance"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Do you have Professional Indemnity Insurance?
              </FormLabel>
              <FormDescription>
                Many clients require this for professional services
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
              <FormLabel>Cover Level</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value || ""} 
                disabled={disabled}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your insurance cover level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {coverLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                The maximum amount your insurance will cover
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
