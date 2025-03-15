
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Conversation } from '@/hooks/messages/useConversations';
import { useMessages } from '@/hooks/messages/useMessages';
import ChatHeader from './ChatHeader';
import MessagesList from './MessagesList';
import MessageInput from './MessageInput';
import { supabase } from '@/integrations/supabase/client';

interface ChatAreaProps {
  selectedConversation: Conversation | null;
}

const ChatArea: React.FC<ChatAreaProps> = ({ selectedConversation }) => {
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const { 
    messages, 
    newMessage, 
    setNewMessage, 
    isSending, 
    sendMessage, 
    handleKeyPress 
  } = useMessages(selectedConversation);

  // Get current user ID
  useEffect(() => {
    const getUserId = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user.id) {
        setCurrentUserId(data.session.user.id);
      }
    };
    getUserId();
  }, []);

  if (!selectedConversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-3/4 p-6 text-center">
          <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
          <p className="text-muted-foreground">
            Choose a conversation from the list to view messages
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader conversation={selectedConversation} />
      
      <div className="flex-grow overflow-y-auto p-4">
        <MessagesList messages={messages} currentUserId={currentUserId} />
      </div>
      
      <MessageInput
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onSend={sendMessage}
        onKeyDown={handleKeyPress}
        isSending={isSending}
      />
    </div>
  );
};

export default ChatArea;
