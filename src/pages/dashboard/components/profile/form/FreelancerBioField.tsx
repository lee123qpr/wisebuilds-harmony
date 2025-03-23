
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { freelancerProfileSchema } from '../freelancerSchema';
import * as z from 'zod';

type FreelancerBioFieldProps = {
  form: UseFormReturn<z.infer<typeof freelancerProfileSchema>>;
  disabled?: boolean;
};

const FreelancerBioField: React.FC<FreelancerBioFieldProps> = ({ form, disabled = false }) => {
  return (
    <FormField
      control={form.control}
      name="bio"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Professional Bio</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Tell clients about yourself and your experience..."
              className="min-h-[120px]"
              {...field}
              disabled={disabled}
            />
          </FormControl>
          <FormDescription>
            Provide a short professional bio to showcase your expertise
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FreelancerBioField;
