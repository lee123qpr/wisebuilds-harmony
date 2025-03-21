
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface UnreadMessagesResponse {
  unreadCount: number;
  hasNewMessages: boolean;
}

export const useUnreadMessages = (): UnreadMessagesResponse & { markAllAsRead: () => Promise<void> } => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const { user } = useAuth();
  
  const fetchUnreadCount = async () => {
    if (!user) return;
    
    try {
      // Get all conversations involving the current user
      const { data: conversations, error: conversationsError } = await supabase
        .from('conversations')
        .select('id')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);
      
      if (conversationsError) {
        console.error('Error fetching conversations:', conversationsError);
        return;
      }
      
      if (!conversations || conversations.length === 0) {
        setUnreadCount(0);
        setHasNewMessages(false);
        return;
      }
      
      // Get conversation IDs
      const conversationIds = conversations.map(c => c.id);
      
      // For each conversation, count unread messages
      const { count, error: messagesError } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .in('conversation_id', conversationIds)
        .eq('is_read', false)
        .neq('sender_id', user.id);
      
      if (messagesError) {
        console.error('Error counting unread messages:', messagesError);
        return;
      }
      
      setUnreadCount(count || 0);
      setHasNewMessages(count > 0);
    } catch (error) {
      console.error('Error in useUnreadMessages:', error);
    }
  };
  
  // Function to mark all messages as read
  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      // Get all conversations involving the current user
      const { data: conversations, error: conversationsError } = await supabase
        .from('conversations')
        .select('id')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);
      
      if (conversationsError || !conversations || conversations.length === 0) {
        return;
      }
      
      // Get conversation IDs
      const conversationIds = conversations.map(c => c.id);
      
      // Mark all messages in these conversations as read
      const { error: updateError } = await supabase
        .from('messages')
        .update({ is_read: true })
        .in('conversation_id', conversationIds)
        .neq('sender_id', user.id)
        .eq('is_read', false);
      
      if (updateError) {
        console.error('Error marking messages as read:', updateError);
        return;
      }
      
      // Reset counts
      setUnreadCount(0);
      setHasNewMessages(false);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };
  
  // Set up listeners for new messages
  useEffect(() => {
    if (!user) return;
    
    fetchUnreadCount();
    
    // Listen for new messages
    const channel = supabase
      .channel('messages-channel')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `is_read=eq.false`
      }, (payload) => {
        // Only count if the message is not from the current user
        if (payload.new.sender_id !== user.id) {
          fetchUnreadCount();
        }
      })
      .subscribe();
    
    // Listen for message updates (e.g., when messages are marked as read)
    const updateChannel = supabase
      .channel('messages-update-channel')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages'
      }, () => {
        fetchUnreadCount();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(updateChannel);
    };
  }, [user]);
  
  return { unreadCount, hasNewMessages, markAllAsRead };
};
