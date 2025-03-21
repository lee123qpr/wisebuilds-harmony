
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export const useUnreadMessages = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Fetch initial unread messages count
    const fetchUnreadMessages = async () => {
      try {
        const { count, error } = await supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('receiver_id', user.id)
          .eq('is_read', false);
          
        if (error) {
          console.error('Error fetching unread messages:', error);
          return;
        }
        
        setUnreadCount(count || 0);
        setHasNewMessages(count > 0);
      } catch (error) {
        console.error('Error in fetchUnreadMessages:', error);
      }
    };

    fetchUnreadMessages();

    // Set up real-time listener for new messages
    const channel = supabase
      .channel('unread-messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `receiver_id=eq.${user.id}` 
        },
        (payload) => {
          console.log('New message received:', payload);
          setUnreadCount(prev => prev + 1);
          setHasNewMessages(true);
        }
      )
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'messages',
          filter: `receiver_id=eq.${user.id}` 
        },
        () => {
          // Refetch count when messages are updated (marked as read)
          fetchUnreadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('receiver_id', user.id)
        .eq('is_read', false);
        
      if (error) {
        console.error('Error marking messages as read:', error);
        return;
      }
      
      setUnreadCount(0);
      setHasNewMessages(false);
    } catch (error) {
      console.error('Error in markAllAsRead:', error);
    }
  };

  return {
    unreadCount,
    hasNewMessages,
    markAllAsRead
  };
};
