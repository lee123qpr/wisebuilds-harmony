
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
  email_verified?: boolean;
  hourly_rate?: string;
  day_rate?: string;
  email?: string;
  phone_number?: string;
  website?: string;
  member_since?: string;
  jobs_completed?: number;
  experience?: string;
  availability?: string;
  qualifications?: string[];
  accreditations?: string[];
  previous_employers?: {
    employerName: string;
    position: string;
    startDate: string;
    endDate?: string;
    current: boolean;
  }[];
  indemnity_insurance?: {
    hasInsurance: boolean;
    coverLevel?: string;
  };
  previousWork?: {
    name: string;
    url: string;
    type: string;
    size: number;
    path: string;
  }[];
}
