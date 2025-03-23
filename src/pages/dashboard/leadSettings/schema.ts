
import * as z from 'zod';

export const leadSettingsSchema = z.object({
  role: z.string().min(1, 'Role is required'),
  location: z.string().min(1, 'Location is required'),
  budget: z.string().optional(),
  duration: z.string().optional(),
  work_type: z.string().optional(),
  project_type: z.array(z.string()).optional(),
  hiring_status: z.string().optional(),
  requires_insurance: z.boolean().default(false),
  requires_site_visits: z.boolean().default(false),
  notifications_enabled: z.boolean().default(true),
  email_alerts: z.boolean().default(true),
});

export type LeadSettingsFormValues = z.infer<typeof leadSettingsSchema>;
