
import { z } from 'zod';

export const businessSchema = z.object({
  companyName: z.string().min(2, { message: 'Company name must be at least 2 characters' }),
  contactName: z.string().min(2, { message: 'Contact name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  companyAddress: z.string().min(5, { message: 'Please enter your company address' }),
  companyDescription: z.string().min(10, { message: 'Please provide a brief company description' }).max(500, { message: 'Company description cannot exceed 500 characters' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string().min(8, { message: 'Please confirm your password' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type BusinessFormValues = z.infer<typeof businessSchema>;
