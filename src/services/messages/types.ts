
import { MessageAttachment } from '@/types/messaging';

export interface SendMessageParams {
  conversationId: string;
  message: string;
  attachments?: MessageAttachment[];
}

export interface MessageReadParams {
  messageIds: string[];
}

export interface FileUploadParams {
  file: File;
  userId: string;
}

export interface ClientContactInfo {
  contact_name: string | null;
  company_name: string | null;
  phone_number: string | null;
  email: string | null;
  website: string | null;
  company_address: string | null;
}
