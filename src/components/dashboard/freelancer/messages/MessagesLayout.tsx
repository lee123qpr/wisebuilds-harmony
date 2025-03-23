
import React from 'react';
import { Conversation } from '@/types/messaging';
import ConversationsList from './ConversationsList';
import ChatArea from './ChatArea';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  // Simplified rendering logic for mobile
  const showConversationsList = !isMobile || !selectedConversation;
  const showChatArea = !isMobile || selectedConversation;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 h-[calc(100vh-180px)] max-h-[800px]">
      {showConversationsList && (
        <div className="col-span-1 h-full overflow-hidden border rounded-md">
          <ConversationsList
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={setSelectedConversation}
            onRefresh={fetchConversations}
            isLoading={isLoading}
          />
        </div>
      )}
      
      {showChatArea && (
        <div className="col-span-1 md:col-span-2 border rounded-md flex flex-col overflow-hidden">
          <ChatArea 
            selectedConversation={selectedConversation} 
            onBackClick={isMobile ? () => setSelectedConversation(null) : undefined}
          />
        </div>
      )}
    </div>
  );
};

export default MessagesLayout;
