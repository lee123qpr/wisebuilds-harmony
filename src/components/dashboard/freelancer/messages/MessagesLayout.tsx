
import React from 'react';
import { Conversation } from '@/types/messaging';
import ConversationsList from './ConversationsList';
import ChatArea from './ChatArea';

interface MessagesLayoutProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  setSelectedConversation: (conversation: Conversation) => void;
  fetchConversations: () => void;
  isLoading: boolean;
}

const MessagesLayout: React.FC<MessagesLayoutProps> = ({
  conversations,
  selectedConversation,
  setSelectedConversation,
  fetchConversations,
  isLoading
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-180px)]">
      {/* Conversations list */}
      <div className="md:col-span-1 h-full overflow-hidden border rounded-md">
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

export default MessagesLayout;
