
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
  attachments?: MessageAttachment[];
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
  id_verified?: boolean;
  location?: string | null;
  // Add properties for consistency
  id?: string;
  name?: string;
  profilePhoto?: string;
  jobTitle?: string;
  job_title?: string; // This property is used in some components
  isVerified?: boolean;
}

export interface ClientInfo {
  company_name?: string;
  contact_name?: string;
  profile_image?: string | null;
  logo_url?: string | null;
  email?: string | null;
  phone_number?: string | null;
}

// Add the missing Message, Conversation, and MessageAttachment types
export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
  attachments?: MessageAttachment[];
}

export interface Conversation {
  id: string;
  client_id: string;
  freelancer_id: string;
  project_id: string;
  created_at?: string;
  last_message_time: string;
  project_title?: string;
  client_info?: ClientInfo;
  freelancer_info?: FreelancerInfo;
}

export interface MessageAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  path: string;
}
