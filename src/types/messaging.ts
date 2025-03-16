
export interface ClientInfo {
  contact_name: string | null;
  email: string | null;
  company_name: string | null;
  logo_url?: string | null;
  phone_number?: string | null;
  website?: string | null;
  company_address?: string | null;
}

export interface FreelancerInfo {
  full_name: string;
  business_name: string | null;
  profile_image: string | null;
  phone_number: string | null;
  email: string | null;
}

export interface Conversation {
  id: string;
  client_id: string;
  freelancer_id: string;
  project_id: string;
  last_message_time: string;
  project_title: string;
  client_info: ClientInfo | null;
  freelancer_info?: FreelancerInfo | null;
}

export interface MessageAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  path: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
  attachments?: MessageAttachment[];
}

// Re-export types from other files
export type { FreelancerProfile } from './applications';
