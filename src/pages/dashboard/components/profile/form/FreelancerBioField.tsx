
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
          <FormLabel className="text-base font-semibold">Professional Bio</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Tell clients about yourself and your experience..."
              className="min-h-[160px] resize-y border-gray-300 focus:border-primary focus:ring-primary text-base"
              {...field}
              disabled={disabled}
            />
          </FormControl>
          <FormDescription className="mt-2 text-sm text-muted-foreground">
            Provide a professional bio highlighting your expertise, experience, and what makes you stand out (max 500 characters)
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FreelancerBioField;
