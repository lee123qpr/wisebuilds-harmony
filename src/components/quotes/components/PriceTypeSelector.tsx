
import React from 'react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from '../schema/quoteFormSchema';

interface PriceTypeSelectorProps {
  form: UseFormReturn<QuoteFormValues>;
}

const PriceTypeSelector: React.FC<PriceTypeSelectorProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="priceType"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Price Type</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fixed" id="fixed" />
                <Label htmlFor="fixed">Fixed Price</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="estimated" id="estimated" />
                <Label htmlFor="estimated">Estimated Price</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="day_rate" id="day_rate" />
                <Label htmlFor="day_rate">Day Rate</Label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormDescription>
            Select your preferred pricing approach for this project
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PriceTypeSelector;
