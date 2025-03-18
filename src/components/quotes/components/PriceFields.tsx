
import React from 'react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from '../schema/quoteFormSchema';

interface PriceFieldsProps {
  form: UseFormReturn<QuoteFormValues>;
  priceType: 'fixed' | 'estimated' | 'day_rate';
}

const PriceFields: React.FC<PriceFieldsProps> = ({ form, priceType }) => {
  if (priceType === 'fixed') {
    return (
      <FormField
        control={form.control}
        name="fixedPrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fixed Price (£)</FormLabel>
            <FormControl>
              <Input placeholder="£0.00" {...field} />
            </FormControl>
            <FormDescription>
              Enter the total fixed price for this project
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
  
  if (priceType === 'estimated') {
    return (
      <FormField
        control={form.control}
        name="estimatedPrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estimated Price (£)</FormLabel>
            <FormControl>
              <Input placeholder="£0.00" {...field} />
            </FormControl>
            <FormDescription>
              Enter an estimated price range for this project
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
  
  if (priceType === 'day_rate') {
    return (
      <FormField
        control={form.control}
        name="dayRate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Day Rate (£)</FormLabel>
            <FormControl>
              <Input placeholder="£0.00" {...field} />
            </FormControl>
            <FormDescription>
              Enter your day rate for this project
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
  
  return null;
};

export default PriceFields;
