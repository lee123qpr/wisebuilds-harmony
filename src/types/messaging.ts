
import { ClientInfo } from '@/services/conversations/utils/getClientInfo';
import { FreelancerInfo } from '@/services/conversations/utils/getFreelancerInfo';

export interface Conversation {
  id: string;
  client_id: string;
  freelancer_id: string;
  project_id: string;
  last_message_time: string;
  project_title?: string;
  client_info?: ClientInfo;
  freelancer_info?: FreelancerInfo;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  path?: string;
}

// Re-export the ClientInfo and FreelancerInfo interfaces to make them available
export { ClientInfo } from '@/services/conversations/utils/getClientInfo';
export { FreelancerInfo } from '@/services/conversations/utils/getFreelancerInfo';
