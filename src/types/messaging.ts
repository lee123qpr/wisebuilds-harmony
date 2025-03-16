
export interface MessageAttachment {
  id?: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Message {
  id: string;
  message: string;
  created_at: string;
  sender_id: string;
  is_read: boolean;
  conversation_id: string;
  attachments?: MessageAttachment[];
}

export interface ClientInfo {
  id: string;
  company_name?: string | null;
  contact_name?: string | null;
  logo_url?: string | null;
  email?: string | null;
  phone_number?: string | null;
  location?: string | null;
}

export interface FreelancerInfo {
  id: string;
  display_name?: string | null;
  profile_image?: string | null;
  email?: string | null;
  phone_number?: string | null;
  member_since?: string | null;
  jobs_completed?: number;
  rating?: number;
  reviews_count?: number;
  email_verified?: boolean;
}

export interface Conversation {
  id: string;
  project_id: string;
  freelancer_id: string;
  client_id: string;
  last_message_time: string;
  freelancer_info?: FreelancerInfo;
  client_info?: ClientInfo;
  project_info?: ProjectInfo;
  project_title?: string;
  unread_count?: number;
}

export interface ProjectInfo {
  id: string;
  title: string;
  role?: string;
  budget?: string;
}
