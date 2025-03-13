
import * as z from 'zod';

export const leadSettingsSchema = z.object({
  role: z.string().min(1, 'Role is required'),
  location: z.string().min(1, 'Location is required'),
  max_budget: z.string().optional(),
  work_type: z.string().optional(),
  project_type: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  notifications_enabled: z.boolean().default(true),
  email_alerts: z.boolean().default(true),
});

export type LeadSettingsFormValues = z.infer<typeof leadSettingsSchema>;
