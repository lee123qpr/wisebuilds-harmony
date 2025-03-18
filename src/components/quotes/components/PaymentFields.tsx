
import React from 'react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from '../schema/quoteFormSchema';

interface PaymentFieldsProps {
  form: UseFormReturn<QuoteFormValues>;
}

const PaymentFields: React.FC<PaymentFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="preferredPaymentMethod"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferred Payment Method</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Bank Transfer, PayPal" {...field} />
            </FormControl>
            <FormDescription>
              How would you prefer to be paid for this project?
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="paymentTerms"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Payment Terms</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Payment on completion, 50% upfront" {...field} />
            </FormControl>
            <FormDescription>
              What are your payment terms for this project?
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default PaymentFields;
