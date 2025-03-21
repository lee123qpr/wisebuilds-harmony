
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export const useUnreadMessages = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [hasNewMessages, setHasNewMessages] = useState<boolean>(false);

  useEffect(() => {
    if (!user) return;

    const fetchUnreadCount = async () => {
      try {
        // Use a simpler query with count to avoid type instantiation issues
        const response = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('recipient_id', user.id)
          .eq('is_read', false);

        const count = response.count || 0;
        if (response.error) throw response.error;
        
        setUnreadCount(count);
        setHasNewMessages(count > 0);
      } catch (error) {
        console.error('Error fetching unread message count:', error);
      }
    };

    fetchUnreadCount();

    // Set up real-time listener for new messages
    const messagesChannel = supabase
      .channel('unread-messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages', 
          filter: `recipient_id=eq.${user.id}` 
        },
        () => {
          console.log('New message received');
          fetchUnreadCount();
        }
      )
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`
        },
        () => {
          console.log('Message updated');
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, [user]);

  // Function to mark all messages as read
  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('recipient_id', user.id)
        .eq('is_read', false);

      if (error) throw error;
      
      setUnreadCount(0);
      setHasNewMessages(false);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  return {
    unreadCount,
    hasNewMessages,
    markAllAsRead
  };
};
