
import { Json } from "@/integrations/supabase/types";

export interface Application {
  id: string;
  freelancer_id: string;
  freelancer_first_name?: string;
  freelancer_last_name?: string;
  freelancer_display_name?: string;
  freelancer_profile_photo?: string;
  freelancer_job_title?: string;
  freelancer_skills?: string[];
  freelancer_verified?: boolean;
  freelancer_email_verified?: boolean;
  freelancer_rating?: number;
  freelancer_reviews_count?: number;
  project_id: string;
  cover_letter?: string;
  created_at: string;
  updated_at?: string;
}

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
  user_id?: string;
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
  contact_phone?: string;
  website?: string;
  member_since?: string;
  jobs_completed?: number;
  experience?: string;
  availability?: string;
  qualifications?: string[];
  accreditations?: string[];
  work_type?: string;
  travel_distance?: string;
  role?: string;
  avatar_url?: string;
  rate?: string;
  indemnity_insurance?: {
    hasInsurance: boolean;
    coverLevel?: string;
  } | boolean;
  previous_employers?: {
    employerName: string;
    position: string;
    startDate: string;
    endDate?: string;
    current: boolean;
  }[] | string[];
  previous_work?: {
    name: string;
    url: string;
    type: string;
    size: number;
    path: string;
  }[] | string[];
  created_at?: string;
}
