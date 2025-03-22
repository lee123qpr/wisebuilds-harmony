
import { useState, useEffect, useCallback } from 'react';
import { Conversation, Message, MessageAttachment } from '@/types/messaging';
import { fetchMessages, markMessagesAsRead, sendMessage } from '@/services/messages/messageService';
import { uploadMessageAttachment } from '@/services/messages/uploadService';
import { updateConversationTime } from '@/services/conversations';

export const useMessages = (selectedConversation: Conversation | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  
  // Fetch messages when conversation changes
  useEffect(() => {
    const getMessages = async () => {
      if (selectedConversation) {
        const conversationMessages = await fetchMessages(selectedConversation.id);
        setMessages(conversationMessages);
      }
    };
    
    getMessages();
  }, [selectedConversation]);
  
  // Mark messages as read
  useEffect(() => {
    if (messages.length > 0) {
      const unreadMessages = messages.filter(msg => !msg.is_read).map(msg => msg.id);
      if (unreadMessages.length > 0) {
        markMessagesAsRead({ messageIds: unreadMessages });
      }
    }
  }, [messages]);
  
  // Handle file selection
  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || !selectedConversation) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    const totalFiles = files.length;
    let uploadedCount = 0;
    const newAttachments: MessageAttachment[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const attachment = await uploadMessageAttachment({ file });
      
      if (attachment) {
        newAttachments.push(attachment);
      }
      
      uploadedCount++;
      setUploadProgress(Math.round((uploadedCount / totalFiles) * 100));
    }
    
    setAttachments(prev => [...prev, ...newAttachments]);
    setIsUploading(false);
  }, [selectedConversation]);
  
  // Remove attachment
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };
  
  // Send message
  const handleSendMessage = useCallback(async () => {
    if (!selectedConversation) return;
    
    if (newMessage.trim() === '' && attachments.length === 0) return;
    
    setIsSending(true);
    
    const success = await sendMessage({
      conversationId: selectedConversation.id,
      message: newMessage,
      attachments
    });
    
    if (success) {
      setNewMessage('');
      setAttachments([]);
      
      // Update conversation time
      await updateConversationTime(selectedConversation.id);
      
      // Fetch updated messages
      const updatedMessages = await fetchMessages(selectedConversation.id);
      setMessages(updatedMessages);
    }
    
    setIsSending(false);
  }, [newMessage, attachments, selectedConversation]);
  
  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return {
    messages,
    newMessage,
    setNewMessage,
    isSending,
    sendMessage: handleSendMessage,
    handleKeyPress,
    handleFileSelect,
    removeAttachment,
    attachments,
    isUploading,
    uploadProgress
  };
};
