
import * as z from 'zod';

export const freelancerProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(100, { message: 'Name cannot exceed 100 characters' }),
  profession: z
    .string()
    .min(2, { message: 'Profession must be at least 2 characters long' })
    .max(100, { message: 'Profession cannot exceed 100 characters' }),
  location: z
    .string()
    .min(2, { message: 'Location must be at least 2 characters long' })
    .max(100, { message: 'Location cannot exceed 100 characters' }),
  bio: z
    .string()
    .max(500, { message: 'Bio cannot exceed 500 characters' })
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
  hourlyRate: z
    .string()
    .max(20, { message: 'Hourly rate cannot exceed 20 characters' })
    .optional()
    .or(z.literal('')),
  availability: z
    .string()
    .max(50, { message: 'Availability cannot exceed 50 characters' })
    .optional()
    .or(z.literal('')),
  skills: z
    .array(z.string())
    .optional()
    .or(z.literal([])),
  experience: z
    .string()
    .max(50, { message: 'Experience cannot exceed 50 characters' })
    .optional()
    .or(z.literal('')),
});
