
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Conversation } from '@/types/messaging';
import { useMessages } from '@/hooks/messages/useMessages';
import ChatHeader from './ChatHeader';
import MessagesList from './MessagesList';
import MessageInput from './MessageInput';
import { useAuth } from '@/context/AuthContext';

interface ChatAreaProps {
  selectedConversation: Conversation | null;
  onBackClick?: () => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ selectedConversation, onBackClick }) => {
  const { user } = useAuth();
  const currentUserId = user?.id || '';
  
  const { 
    messages, 
    newMessage, 
    setNewMessage, 
    isSending, 
    sendMessage, 
    handleKeyPress,
    handleFileSelect,
    removeAttachment,
    attachments,
    isUploading,
    uploadProgress
  } = useMessages(selectedConversation);

  if (!selectedConversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full md:w-3/4 p-4 md:p-6 text-center">
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
      <ChatHeader conversation={selectedConversation} onBackClick={onBackClick} />
      
      <div className="flex-grow overflow-y-auto p-2 md:p-4 pb-1">
        <MessagesList messages={messages} currentUserId={currentUserId} />
      </div>
      
      <MessageInput
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onSend={sendMessage}
        onKeyDown={handleKeyPress}
        isSending={isSending}
        onFileSelect={handleFileSelect}
        attachments={attachments}
        onRemoveAttachment={removeAttachment}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
      />
    </div>
  );
};

export default ChatArea;
