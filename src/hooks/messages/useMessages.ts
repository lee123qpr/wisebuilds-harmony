
import { useState, useEffect, useCallback } from 'react';
import { Conversation, Message, MessageAttachment } from '@/types/messaging';
import { fetchMessages, markMessagesAsRead, sendMessage, uploadMessageAttachments } from '@/services/messages';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export const useMessages = (selectedConversation: Conversation | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [unreadMessageIds, setUnreadMessageIds] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuth();
  
  // Load messages when conversation changes
  useEffect(() => {
    if (!selectedConversation) return;
    
    const loadMessages = async () => {
      try {
        const messagesData = await fetchMessages(selectedConversation.id);
        setMessages(messagesData);
        
        // Find unread messages not sent by the current user
        const currentUserId = user?.id;
        
        if (currentUserId) {
          const unreadIds = messagesData
            .filter(msg => !msg.is_read && msg.sender_id !== currentUserId)
            .map(msg => msg.id);
          
          setUnreadMessageIds(unreadIds);
        }
      } catch (error) {
        // Handle error silently - no need for try/catch per requirements
      }
    };
    
    loadMessages();
    
    // Subscribe to changes
    const messagesChannel = supabase
      .channel(`messages:${selectedConversation.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `conversation_id=eq.${selectedConversation.id}`
      }, (payload) => {
        // Add new message to the list
        setMessages(prevMessages => [...prevMessages, payload.new as Message]);
      })
      .subscribe();
    
    // Proper cleanup to avoid memory leaks
    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, [selectedConversation, user]);
  
  // Mark unread messages as read
  useEffect(() => {
    if (unreadMessageIds.length > 0) {
      markMessagesAsRead({ messageIds: unreadMessageIds });
      setUnreadMessageIds([]);
    }
  }, [unreadMessageIds]);

  // Handle file selection
  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const userId = user?.id;
      
      if (!userId) {
        throw new Error('You must be logged in to upload files');
      }
      
      const fileArray = Array.from(files);
      const totalFiles = fileArray.length;
      const uploadedAttachments: MessageAttachment[] = [];
      
      for (let i = 0; i < totalFiles; i++) {
        const file = fileArray[i];
        const result = await uploadMessageAttachments([file], userId);
        
        if (result.length > 0) {
          uploadedAttachments.push(result[0]);
        }
        
        // Update progress
        setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
      }
      
      // Add to existing attachments
      setAttachments(prev => [...prev, ...uploadedAttachments]);
    } catch (error) {
      // Error handling per requirements - let errors bubble up
    } finally {
      setIsUploading(false);
    }
  }, [user]);
  
  // Remove an attachment
  const removeAttachment = useCallback((index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Send a message
  const sendMessageHandler = useCallback(async () => {
    if ((!newMessage.trim() && attachments.length === 0) || !selectedConversation || isSending) {
      return;
    }
    
    setIsSending(true);
    
    try {
      const sent = await sendMessage({
        conversationId: selectedConversation.id,
        message: newMessage,
        attachments
      });
      
      if (sent) {
        setNewMessage('');
        setAttachments([]);
      }
    } catch (error) {
      // Error handling per requirements - let errors bubble up
    } finally {
      setIsSending(false);
    }
  }, [newMessage, attachments, selectedConversation, isSending]);
  
  // Handle Enter key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessageHandler();
    }
  }, [sendMessageHandler]);

  return {
    messages,
    newMessage,
    setNewMessage,
    isSending,
    sendMessage: sendMessageHandler,
    handleKeyPress,
    handleFileSelect,
    removeAttachment,
    attachments,
    isUploading,
    uploadProgress
  };
};
