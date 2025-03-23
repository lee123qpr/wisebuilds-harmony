
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Message, MessageAttachment } from '@/types/messaging';
import { getCurrentUserId } from '@/services/conversations';
import { SendMessageParams, MessageReadParams } from './types';
import { uploadMessageAttachment } from './uploadService';

/**
 * Fetch messages for a conversation
 */
export const fetchMessages = async (conversationId: string): Promise<Message[]> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Failed to load messages",
        description: error.message,
        variant: "destructive"
      });
      return [];
    }
    
    // Convert JSON attachments to proper MessageAttachment arrays
    const messages = data?.map(msg => ({
      ...msg,
      attachments: msg.attachments ? (Array.isArray(msg.attachments) ? msg.attachments : [msg.attachments]) : undefined
    })) || [];
    
    return messages as Message[];
  } catch (e) {
    console.error('Error in fetchMessages:', e);
    toast({
      title: "Failed to load messages",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return [];
  }
};

/**
 * Mark messages as read
 */
export const markMessagesAsRead = async ({ messageIds }: MessageReadParams): Promise<void> => {
  if (messageIds.length === 0) return;
  
  try {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .in('id', messageIds);
    
    if (error) {
      console.error('Error marking messages as read:', error);
    }
  } catch (e) {
    console.error('Error in markMessagesAsRead:', e);
  }
};

/**
 * Send a new message
 */
export const sendMessage = async ({ conversationId, message, attachments = [] }: SendMessageParams): Promise<boolean> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Generate a better default message when sending attachments
    let messageText = message.trim();
    if (!messageText && attachments.length > 0) {
      const fileTypes = [...new Set(attachments.map(a => {
        if (a.type.startsWith('image/')) return 'image';
        if (a.type.includes('pdf')) return 'PDF';
        if (a.type.includes('word') || a.type.includes('document')) return 'document';
        if (a.type.includes('spreadsheet') || a.type.includes('excel')) return 'spreadsheet';
        return 'file';
      }))];
      
      if (fileTypes.length === 1) {
        messageText = `Sent ${attachments.length > 1 ? `${attachments.length} ${fileTypes[0]}s` : `an ${fileTypes[0]}`}`;
      } else {
        messageText = `Sent ${attachments.length} files`;
      }
    }
    
    // Create the message
    const { data: messageData, error: messageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: userId,
        message: messageText,
        attachments: attachments.length > 0 ? attachments : null
      })
      .select()
      .single();
    
    if (messageError) {
      console.error('Error sending message:', messageError);
      toast({
        title: "Failed to send message",
        description: messageError.message,
        variant: "destructive"
      });
      return false;
    }
    
    // Update conversation last_message_at
    const { error: updateError } = await supabase
      .from('conversations')
      .update({ 
        last_message_time: new Date().toISOString(),
        last_message: messageText
      })
      .eq('id', conversationId);
    
    if (updateError) {
      console.error('Error updating conversation:', updateError);
    }
    
    return true;
  } catch (e) {
    console.error('Error in sendMessage:', e);
    toast({
      title: "Failed to send message",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return false;
  }
};

/**
 * Upload attachments for a message
 */
export const uploadMessageAttachments = async (
  files: File[],
  userId: string
): Promise<MessageAttachment[]> => {
  try {
    const attachments: MessageAttachment[] = [];
    
    for (const file of files) {
      const attachment = await uploadMessageAttachment({ file, userId });
      if (attachment) {
        attachments.push(attachment);
      }
    }
    
    return attachments;
  } catch (error) {
    console.error('Error uploading message attachments:', error);
    return [];
  }
};
