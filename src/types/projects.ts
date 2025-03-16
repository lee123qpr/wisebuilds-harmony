
import { Json } from "@/integrations/supabase/types";

// Shared interface for project leads
export interface ProjectLead {
  id: string;
  title: string;
  description: string;
  budget: string;
  role: string;
  created_at: string;
  location: string;
  work_type: string;
  tags?: string[];
  duration: string;
  hiring_status: string;
  requires_equipment: boolean;
  requires_security_check: boolean;
  requires_insurance: boolean;
  requires_qualifications: boolean;
  published: boolean;
  client_id: string;
  client_name?: string;
  client_company?: string;
  start_date?: string;
  applications: number;
  documents: Json | null;
  requires_site_visits: boolean;
  status: string;
  updated_at: string;
  user_id: string;
}
