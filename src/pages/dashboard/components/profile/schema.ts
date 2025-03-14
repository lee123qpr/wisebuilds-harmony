
import * as z from 'zod';

export const clientProfileSchema = z.object({
  companyName: z
    .string()
    .min(2, { message: 'Company name must be at least 2 characters long' })
    .max(100, { message: 'Company name cannot exceed 100 characters' }),
  contactName: z
    .string()
    .min(2, { message: 'Contact name must be at least 2 characters long' })
    .max(100, { message: 'Contact name cannot exceed 100 characters' }),
  companyAddress: z
    .string()
    .min(5, { message: 'Address must be at least 5 characters long' })
    .max(200, { message: 'Address cannot exceed 200 characters' }),
  companyDescription: z
    .string()
    .max(500, { message: 'Description cannot exceed 500 characters' })
    .optional()
    .or(z.literal('')),
  phoneNumber: z
    .string()
    .min(5, { message: 'Phone number must be at least 5 characters long' })
    .max(20, { message: 'Phone number cannot exceed 20 characters' }),
  website: z
    .string()
    .transform(val => {
      // If empty string, return as is
      if (!val) return val;
      // Check if the URL has a protocol, if not add https://
      return val.match(/^https?:\/\//) ? val : `https://${val}`;
    })
    .optional()
    .or(z.literal('')),
  companyType: z
    .string()
    .max(100, { message: 'Company type cannot exceed 100 characters' })
    .optional()
    .or(z.literal('')),
  companyTurnover: z
    .string()
    .max(50, { message: 'Company turnover cannot exceed 50 characters' })
    .optional()
    .or(z.literal('')),
  employeeSize: z
    .string()
    .max(50, { message: 'Employee size cannot exceed 50 characters' })
    .optional()
    .or(z.literal('')),
  companySpecialism: z
    .string()
    .max(100, { message: 'Company specialism cannot exceed 100 characters' })
    .optional()
    .or(z.literal('')),
});

export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, { message: 'Rating must be at least 1' })
    .max(5, { message: 'Rating cannot exceed 5' }),
  reviewText: z
    .string()
    .min(10, { message: 'Review must be at least 10 characters long' })
    .max(500, { message: 'Review cannot exceed 500 characters' }),
});
