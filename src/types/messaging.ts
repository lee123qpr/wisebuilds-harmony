
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

export interface Conversation {
  id: string;
  client_id: string;
  freelancer_id: string;
  project_id: string;
  created_at: string;
  last_message_time: string;
  project_title?: string;
  client_info?: {
    company_name: string;
    logo_url?: string;
  };
  freelancer_info?: {
    first_name: string;
    last_name: string;
    profile_photo?: string;
  };
}
