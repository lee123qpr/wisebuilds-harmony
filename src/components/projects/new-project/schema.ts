
import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  role: z.string().min(1, 'Role is required'),
  requiresInsurance: z.boolean().default(false),
  location: z.string().min(3, 'Location is required'),
  workType: z.string().min(1, 'Work type is required'),
  duration: z.string().min(1, 'Duration is required'),
  budget: z.string().min(1, 'Budget is required'),
  startDate: z.date({
    required_error: 'Start date is required',
  }),
  hiringStatus: z.string().min(1, 'Hiring status is required'),
  requiresSiteVisits: z.boolean().default(false),
  requiresEquipment: z.boolean().default(false),
  documents: z.any().optional(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
