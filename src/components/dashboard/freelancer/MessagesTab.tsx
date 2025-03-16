
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import EmptyStateCard from './EmptyStateCard';
import { useConversations } from '@/hooks/messages/useConversations';
import ConversationsList from './messages/ConversationsList';
import ChatArea from './messages/ChatArea';

const MessagesTab: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const clientId = searchParams.get('clientId');
  
  const { 
    conversations, 
    selectedConversation, 
    setSelectedConversation, 
    isLoading, 
    fetchConversations 
  } = useConversations(projectId, clientId);
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4 h-[calc(100vh-240px)]">
        <div className="col-span-1 border rounded-md p-4">
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-16 w-full mb-2" />
          <Skeleton className="h-16 w-full mb-2" />
          <Skeleton className="h-16 w-full" />
        </div>
        <div className="col-span-2 border rounded-md p-4">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <div className="space-y-2 mb-4">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-10 w-1/2 ml-auto" />
            <Skeleton className="h-10 w-3/4" />
          </div>
          <Skeleton className="h-12 w-full mt-auto" />
        </div>
      </div>
    );
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-240px)]">
      {/* Conversations list */}
      <div className="md:col-span-1 h-full">
        <ConversationsList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
          onRefresh={fetchConversations}
          isLoading={isLoading}
        />
      </div>
      
      {/* Chat area */}
      <div className="md:col-span-2 border rounded-md flex flex-col overflow-hidden">
        <ChatArea selectedConversation={selectedConversation} />
      </div>
    </div>
  );
};

export default MessagesTab;
