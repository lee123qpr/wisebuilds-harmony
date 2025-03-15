
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { freelancerProfileSchema } from '../freelancerSchema';
import * as z from 'zod';

type FreelancerWorkDetailsFieldsProps = {
  form: UseFormReturn<z.infer<typeof freelancerProfileSchema>>;
  disabled?: boolean;
};

const FreelancerWorkDetailsFields: React.FC<FreelancerWorkDetailsFieldsProps> = ({ form, disabled = false }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="hourlyRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hourly Rate (£)</FormLabel>
              <FormControl>
                <Input placeholder="Enter your hourly rate" {...field} disabled={disabled} />
              </FormControl>
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
                disabled={disabled} 
                value={field.value || ""} 
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Weekends only">Weekends only</SelectItem>
                  <SelectItem value="Evenings only">Evenings only</SelectItem>
                  <SelectItem value="Fully booked">Fully booked</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="experience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Years of Experience</FormLabel>
            <Select 
              disabled={disabled} 
              value={field.value || ""} 
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Less than 1 year">Less than 1 year</SelectItem>
                <SelectItem value="1-3 years">1-3 years</SelectItem>
                <SelectItem value="4-6 years">4-6 years</SelectItem>
                <SelectItem value="7-10 years">7-10 years</SelectItem>
                <SelectItem value="10+ years">10+ years</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default FreelancerWorkDetailsFields;
