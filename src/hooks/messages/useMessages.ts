
import { useState, useEffect } from 'react';
import { fetchMessages, markMessagesAsRead } from '@/services/messages';
import { Message } from '@/types/messaging';

export const useMessages = (
  conversationId: string | undefined,
  currentUserId: string | undefined
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to get messages
  const getMessages = async () => {
    if (!conversationId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const fetchedMessages = await fetchMessages(conversationId);
      setMessages(fetchedMessages as Message[]);
      
      // Mark messages from other users as read
      const unreadMessageIds = fetchedMessages
        .filter(msg => !msg.is_read && msg.sender_id !== currentUserId)
        .map(msg => msg.id);
        
      if (unreadMessageIds.length > 0) {
        await markMessagesAsRead(unreadMessageIds);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages on mount and when conversationId changes
  useEffect(() => {
    getMessages();
    
    // Set up polling for new messages (every 5 seconds)
    const interval = setInterval(() => {
      getMessages();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [conversationId]);

  return {
    messages,
    loading,
    error,
    refreshMessages: getMessages
  };
};
