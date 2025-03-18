
import { z } from 'zod';

export const quoteFormSchema = z.object({
  priceType: z.enum(['fixed', 'estimated', 'day_rate']),
  fixedPrice: z.string().optional(),
  estimatedPrice: z.string().optional(),
  dayRate: z.string().optional(),
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
}).refine((data) => {
  if (data.priceType === 'fixed') {
    return !!data.fixedPrice && data.fixedPrice.trim().length > 0;
  }
  return true;
}, {
  message: 'Fixed price is required when price type is fixed',
  path: ['fixedPrice'],
}).refine((data) => {
  if (data.priceType === 'estimated') {
    return !!data.estimatedPrice && data.estimatedPrice.trim().length > 0;
  }
  return true;
}, {
  message: 'Estimated price is required when price type is estimated',
  path: ['estimatedPrice'],
}).refine((data) => {
  if (data.priceType === 'day_rate') {
    return !!data.dayRate && data.dayRate.trim().length > 0;
  }
  return true;
}, {
  message: 'Day rate is required when price type is day rate',
  path: ['dayRate'],
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;
