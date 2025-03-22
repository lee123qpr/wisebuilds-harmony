
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

// Experience options
const experienceOptions = [
  "Less than 1 year",
  "1-2 years",
  "3-5 years",
  "5-10 years",
  "10+ years"
];

// Availability options
const availabilityOptions = [
  "Full-time",
  "Part-time",
  "Weekends only",
  "Evenings only",
  "Flexible hours"
];

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
              <Select 
                onValueChange={field.onChange} 
                value={field.value || ""} 
                disabled={disabled}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your availability" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availabilityOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Your typical working schedule
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
              <Select 
                onValueChange={field.onChange} 
                value={field.value || ""} 
                disabled={disabled}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {experienceOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Your years of professional experience
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
