
import * as z from 'zod';
import { UploadedFile } from '@/components/projects/file-upload/types';

export const freelancerProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(100, { message: 'Name cannot exceed 100 characters' }),
  profession: z
    .string()
    .min(2, { message: 'Profession must be at least 2 characters long' })
    .max(100, { message: 'Profession cannot exceed 100 characters' }),
  previousEmployers: z
    .array(
      z.object({
        employerName: z.string().min(2, { message: 'Employer name must be at least 2 characters long' }),
        startDate: z.date(),
        endDate: z.date().nullable().optional(),
        current: z.boolean().default(false),
        position: z.string().min(2, { message: 'Position must be at least 2 characters long' }),
      })
    )
    .default([]),
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
    .max(6, { message: 'You can select up to 6 skills' })
    .default([]),
  experience: z
    .string()
    .max(50, { message: 'Experience cannot exceed 50 characters' })
    .optional()
    .or(z.literal('')),
  qualifications: z
    .array(z.string())
    .default([]),
  accreditations: z
    .array(z.string())
    .default([]),
  indemnityInsurance: z
    .object({
      hasInsurance: z.boolean().default(false),
      coverLevel: z.string().optional().or(z.literal('')),
    })
    .default({ hasInsurance: false, coverLevel: '' }),
  previousWork: z
    .array(
      z.object({
        name: z.string(),
        url: z.string(),
        type: z.string(),
        size: z.number(),
        path: z.string(),
      })
    )
    .default([]),
  idVerified: z.boolean().default(false),
});

// Export the type for the FreelancerProfileData
export type FreelancerProfileData = {
  first_name: string;
  last_name: string;
  display_name: string;
  job_title: string | null;
  location: string | null;
  bio: string | null;
  email: string | null;
  phone_number: string | null;
  website: string | null;
  hourly_rate: string | null;
  availability: string | null;
  skills: string[] | null;
  experience: string | null;
  qualifications: string[] | null;
  accreditations: string[] | null;
  has_indemnity_insurance: boolean;
  indemnity_insurance: any | null;
  previous_work: any[] | null;
  previous_employers: any[] | null;
  profile_photo: string | null;
  id_verified?: boolean;
  member_since?: string | null;
  jobs_completed?: number;
};

export type FreelancerProfileFormValues = z.infer<typeof freelancerProfileSchema>;
