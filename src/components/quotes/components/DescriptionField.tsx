
import React from 'react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from '../schema/quoteFormSchema';

interface DescriptionFieldProps {
  form: UseFormReturn<QuoteFormValues>;
}

const DescriptionField: React.FC<DescriptionFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Describe your approach to this project..."
              className="min-h-32"
              {...field} 
            />
          </FormControl>
          <FormDescription>
            Explain how you'll approach the project, your experience, and why you're the best fit
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DescriptionField;
