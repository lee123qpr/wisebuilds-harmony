
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import EmptyStateCard from '../freelancer/EmptyStateCard';
import { useConversations } from '@/hooks/messages/useConversations';
import MessagesTabSkeleton from '../freelancer/messages/MessagesTabSkeleton';
import MessagesLayout from '../freelancer/messages/MessagesLayout';
import MessagesHeader from './messages/MessagesHeader';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

const BusinessMessagesTab: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const freelancerId = searchParams.get('freelancerId');
  const conversationId = searchParams.get('conversation');
  const { user } = useAuth();
  
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
  
  // Setup real-time listener for new conversations
  useEffect(() => {
    const userId = user?.id;
    if (!userId) return;
    
    const channel = supabase
      .channel(`business-conversations-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversations',
          filter: `client_id=eq.${userId}`
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchConversations, user]);
  
  if (isLoading) {
    return <MessagesTabSkeleton />;
  }
  
  if (conversations.length === 0) {
    return (
      <>
        <MessagesHeader conversationCount={0} />
        <EmptyStateCard
          title="No messages yet"
          description="When freelancers contact you, your conversations will appear here."
        />
      </>
    );
  }
  
  return (
    <div className="space-y-4">
      <MessagesHeader conversationCount={conversations.length} />
      <MessagesLayout
        conversations={conversations}
        selectedConversation={selectedConversation}
        setSelectedConversation={setSelectedConversation}
        fetchConversations={fetchConversations}
        isLoading={isLoading}
      />
    </div>
  );
};

export default BusinessMessagesTab;
