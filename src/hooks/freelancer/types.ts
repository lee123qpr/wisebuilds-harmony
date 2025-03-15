
import { Json } from "@/integrations/supabase/types";

export interface LeadSettings {
  id: string;
  role: string;
  location: string;
  work_type?: string;
  max_budget?: string;
  budget?: string;
  duration?: string;
  project_type?: string[] | string;
  keywords?: string[] | string;
  hiring_status?: string;
  requires_insurance?: boolean;
  requires_site_visits?: boolean;
  notifications_enabled: boolean;
  email_alerts?: boolean;
}
