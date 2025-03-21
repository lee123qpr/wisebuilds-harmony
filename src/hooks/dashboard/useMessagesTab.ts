
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useConversations } from '@/hooks/messages/useConversations';
import { useUnreadMessages } from '@/hooks/messages/useUnreadMessages';

export const useMessagesTab = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const clientId = searchParams.get('clientId');
  const conversationId = searchParams.get('conversation');
  
  const { markAllAsRead } = useUnreadMessages();
  
  const { 
    conversations, 
    selectedConversation, 
    setSelectedConversation, 
    isLoading, 
    fetchConversations 
  } = useConversations(projectId, clientId);
  
  // Mark messages as read when tab is opened
  useEffect(() => {
    markAllAsRead();
  }, [markAllAsRead]);
  
  // Set the selected conversation based on URL parameter
  useEffect(() => {
    if (conversationId && conversations.length > 0) {
      const conversation = conversations.find(c => c.id === conversationId);
      if (conversation) {
        setSelectedConversation(conversation);
      }
    }
  }, [conversationId, conversations, setSelectedConversation]);

  return {
    conversations,
    selectedConversation,
    setSelectedConversation,
    isLoading,
    fetchConversations
  };
};
