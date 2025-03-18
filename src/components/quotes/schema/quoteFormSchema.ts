
import { z } from 'zod';

export const quoteFormSchema = z.object({
  priceType: z.enum(['fixed', 'estimated', 'day_rate']),
  fixedPrice: z.string().optional().refine(val => val === undefined || val.length > 0, { 
    message: 'Fixed price is required when price type is fixed'
  }),
  estimatedPrice: z.string().optional().refine(val => val === undefined || val.length > 0, { 
    message: 'Estimated price is required when price type is estimated'
  }),
  dayRate: z.string().optional().refine(val => val === undefined || val.length > 0, { 
    message: 'Day rate is required when price type is day rate'
  }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  availableStartDate: z.date({
    required_error: 'Please select a start date',
  }),
  estimatedDuration: z.string().min(1, { message: 'Estimated duration is required' }),
  durationUnit: z.enum(['days', 'weeks', 'months'], {
    required_error: 'Please select a duration unit',
  }),
  preferredPaymentMethod: z.string().min(1, { message: 'Preferred payment method is required' }),
  paymentTerms: z.string().min(1, { message: 'Payment terms are required' }),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;
