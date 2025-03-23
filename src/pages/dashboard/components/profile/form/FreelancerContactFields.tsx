
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { freelancerProfileSchema } from '../freelancerSchema';
import * as z from 'zod';

type FreelancerContactFieldsProps = {
  form: UseFormReturn<z.infer<typeof freelancerProfileSchema>>;
  disabled?: boolean;
};

const FreelancerContactFields: React.FC<FreelancerContactFieldsProps> = ({ form, disabled = false }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input placeholder="Enter phone number" {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website</FormLabel>
            <FormControl>
              <Input placeholder="example.com" {...field} disabled={disabled} />
            </FormControl>
            <FormDescription>Enter domain without http:// (it will be added automatically)</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default FreelancerContactFields;
