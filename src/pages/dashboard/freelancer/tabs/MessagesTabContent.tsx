
import React from 'react';
import EmptyStateCard from '@/components/dashboard/freelancer/EmptyStateCard';
import MessagesTabSkeleton from '@/components/dashboard/freelancer/messages/MessagesTabSkeleton';
import MessagesLayout from '@/components/dashboard/freelancer/messages/MessagesLayout';
import { useMessagesTab } from '@/hooks/dashboard/useMessagesTab';

const MessagesTabContent: React.FC = () => {
  const {
    conversations,
    selectedConversation,
    setSelectedConversation,
    isLoading,
    fetchConversations
  } = useMessagesTab();
  
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

export default MessagesTabContent;
