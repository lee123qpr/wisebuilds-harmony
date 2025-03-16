
import type { Json } from '@/integrations/supabase/types';

export interface MessageAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  attachments: MessageAttachment[] | Json | null;
}

export interface ClientInfo {
  id: string;
  company_name: string | null;
  contact_name: string | null;
  logo_url?: string | null;
  email?: string | null;
  phone_number?: string | null;
  location?: string | null;
}

export interface FreelancerInfo {
  id: string;
  display_name: string;
  first_name?: string;
  last_name?: string;
  profile_photo?: string | null;
  email?: string | null;
  phone_number?: string | null;
  member_since?: string | null;
  jobs_completed?: number;
  rating?: number | null;
  reviews_count?: number;
  email_verified?: boolean;
}

export interface Conversation {
  id: string;
  client_id: string;
  freelancer_id: string;
  project_id: string;
  created_at: string;
  last_message_time: string;
  project_title?: string;
  client_info?: ClientInfo;
  freelancer_info?: FreelancerInfo;
}
