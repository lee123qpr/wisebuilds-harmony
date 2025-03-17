
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import EmptyStateCard from '../freelancer/EmptyStateCard';
import { useConversations } from '@/hooks/messages/useConversations';
import MessagesTabSkeleton from '../freelancer/messages/MessagesTabSkeleton';
import MessagesLayout from '../freelancer/messages/MessagesLayout';

const BusinessMessagesTab: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const freelancerId = searchParams.get('freelancerId');
  const conversationId = searchParams.get('conversation');
  
  const { 
    conversations, 
    selectedConversation, 
    setSelectedConversation, 
    isLoading, 
    fetchConversations 
  } = useConversations(projectId, freelancerId, true); // Pass true to indicate business client
  
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
        description="When freelancers contact you, your conversations will appear here."
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

export default BusinessMessagesTab;
