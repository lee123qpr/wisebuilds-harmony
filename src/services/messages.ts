
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { getCurrentUserId } from './conversations';

// Define types
export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

// Fetch messages for a conversation
export const fetchMessages = async (conversationId: string) => {
  try {
    // We need to use type assertion because messages table isn't in the Supabase type definition
    const { data, error } = await (supabase
      .from('messages') as any)
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
    
    return data || [];
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

// Mark messages as read
export const markMessagesAsRead = async (messageIds: string[]) => {
  if (messageIds.length === 0) return;
  
  try {
    const { error } = await (supabase
      .from('messages') as any)
      .update({ is_read: true })
      .in('id', messageIds);
    
    if (error) {
      console.error('Error marking messages as read:', error);
    }
  } catch (e) {
    console.error('Error in markMessagesAsRead:', e);
  }
};

// Send a new message
export const sendMessage = async (conversationId: string, message: string) => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Send the message
    const { error } = await (supabase
      .from('messages') as any)
      .insert({
        conversation_id: conversationId,
        sender_id: userId,
        message: message.trim(),
        is_read: false
      });
    
    if (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive"
      });
      return false;
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
