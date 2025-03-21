
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import EmptyStateCard from './EmptyStateCard';
import { useConversations } from '@/hooks/messages/useConversations';
import MessagesTabSkeleton from './messages/MessagesTabSkeleton';
import MessagesLayout from './messages/MessagesLayout';
import { useUnreadMessages } from '@/hooks/messages/useUnreadMessages';

const MessagesTab: React.FC = () => {
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
  
  if (isLoading) {
    return <MessagesTabSkeleton />;
  }
  
  if (conversations.length === 0) {
    return (
      <EmptyStateCard
        title="No messages yet"
        description="When you contact clients, your conversations will appear here."
      />
    );
  }
  
  return (
    <MessagesLayout
      conversations={conversations}
      selectedConversation={selectedConversation}
      setSelectedConversation={setSelectedConversation}
      fetchConversations={fetchConversations}
      isLoading={isLoading}
    />
  );
};

export default MessagesTab;
