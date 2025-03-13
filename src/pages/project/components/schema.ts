
import * as z from 'zod';

export const projectSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  role: z.string().min(1, 'Role is required'),
  location: z.string().min(1, 'Location is required'),
  work_type: z.string(),
  duration: z.string(),
  budget: z.string(),
  requires_insurance: z.boolean().default(false),
  requires_site_visits: z.boolean().default(false),
  requires_equipment: z.boolean().default(false),
  start_date: z.string().optional(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
