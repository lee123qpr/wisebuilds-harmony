
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { freelancerProfileSchema } from '../freelancerSchema';
import * as z from 'zod';
import FreelancerSkillsField from './FreelancerSkillsField';
import FreelancerQualificationsField from './FreelancerQualificationsField';
import FreelancerIndemnityField from './FreelancerIndemnityField';
import FreelancerPreviousEmployersField from './FreelancerPreviousEmployersField';

type FreelancerWorkDetailsFieldsProps = {
  form: UseFormReturn<z.infer<typeof freelancerProfileSchema>>;
  disabled?: boolean;
};

const FreelancerWorkDetailsFields: React.FC<FreelancerWorkDetailsFieldsProps> = ({ form, disabled = false }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="hourlyRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hourly Rate (Guide)</FormLabel>
              <FormControl>
                <Input placeholder="Enter your hourly rate" {...field} disabled={disabled} />
              </FormControl>
              <FormDescription>
                Your typical hourly rate as a guide for clients
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="availability"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Availability</FormLabel>
              <FormControl>
                <Input placeholder="Enter your availability" {...field} disabled={disabled} />
              </FormControl>
              <FormDescription>
                E.g. "Full-time", "Part-time", "Weekends only"
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience</FormLabel>
              <FormControl>
                <Input placeholder="Years of experience" {...field} disabled={disabled} />
              </FormControl>
              <FormDescription>
                E.g. "10+ years in residential architecture"
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FreelancerPreviousEmployersField form={form} disabled={disabled} />

      <FreelancerIndemnityField form={form} disabled={disabled} />

      <FreelancerSkillsField form={form} disabled={disabled} />

      <FreelancerQualificationsField form={form} disabled={disabled} />
    </div>
  );
};

export default FreelancerWorkDetailsFields;
