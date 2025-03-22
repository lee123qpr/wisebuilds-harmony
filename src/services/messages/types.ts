
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
}

