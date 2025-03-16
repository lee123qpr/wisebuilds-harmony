
import { Json } from "@/integrations/supabase/types";

export interface FreelancerApplication {
  id: string;
  user_id: string;
  project_id: string;
  message?: string;
  created_at: string;
  updated_at?: string;
  freelancer_profile?: FreelancerProfile;
}

export interface FreelancerProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  profile_photo?: string;
  job_title?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  rating?: number;
  reviews_count?: number;
  verified?: boolean;
  hourly_rate?: string;
  day_rate?: string;
  email?: string;
  phone_number?: string;
}

export interface ProjectApplication {
  id: string;
  projectId: string;
  userId: string;
  message: string;
  createdAt: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  jobTitle: string | null;
  location: string | null;
  profilePhoto: string | null;
}
