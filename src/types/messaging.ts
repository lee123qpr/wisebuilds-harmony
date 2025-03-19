
export interface ConversationWithProfile {
  id: string;
  client_id: string;
  project_id: string;
  freelancer_id: string;
  created_at: string;
  last_message_time: string;
  last_message?: string;
  unread_count?: number;
  client_name?: string;
  client_profile_image?: string;
  freelancer_name?: string;
  freelancer_profile_image?: string;
  project_title?: string;
  isClient?: boolean;
}

export interface MessageWithSender {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
  sender_name?: string;
  sender_profile_image?: string;
  is_current_user?: boolean;
  attachments?: any;
}

export interface FreelancerInfo {
  full_name: string;
  profile_image: string | null;
  email?: string | null;
  email_verified?: boolean;
  phone_number?: string | null;
  member_since?: string | null;
  jobs_completed?: number;
  rating?: number | null;
  reviews_count?: number;
  verified?: boolean;
  location?: string | null;
}

export interface ClientInfo {
  company_name?: string;
  contact_name?: string;
  profile_image?: string | null;
  email?: string | null;
  phone_number?: string | null;
}
