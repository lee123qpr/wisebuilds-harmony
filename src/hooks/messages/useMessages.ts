
import { useState, useEffect, useCallback } from 'react';
import { fetchMessages, markMessagesAsRead, sendMessage as sendMessageService, uploadMessageAttachment } from '@/services/messages';
import { Message, MessageAttachment } from '@/types/messaging';

export const useMessages = (
  conversationId: string | undefined,
  currentUserId: string | undefined
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Function to get messages
  const getMessages = async () => {
    if (!conversationId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const fetchedMessages = await fetchMessages(conversationId);
      setMessages(fetchedMessages as Message[]);
      
      // Mark messages from other users as read
      const unreadMessageIds = fetchedMessages
        .filter(msg => !msg.is_read && msg.sender_id !== currentUserId)
        .map(msg => msg.id);
        
      if (unreadMessageIds.length > 0) {
        await markMessagesAsRead(unreadMessageIds);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection for attachments
  const handleFileSelect = useCallback(async (files: FileList) => {
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const uploadResult = await uploadMessageAttachment(file);
        return uploadResult;
      });
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);
      
      const results = await Promise.all(uploadPromises);
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Filter out null results and add successful uploads to attachments
      const successfulUploads = results.filter((result): result is MessageAttachment => result !== null);
      setAttachments(prev => [...prev, ...successfulUploads]);
    } catch (err) {
      console.error('Error uploading files:', err);
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  }, []);

  // Remove attachment
  const removeAttachment = useCallback((attachmentId: string) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
  }, []);

  // Send message
  const sendMessage = useCallback(async () => {
    if (!conversationId || (!newMessage.trim() && attachments.length === 0)) return;
    
    setIsSending(true);
    try {
      const success = await sendMessageService(conversationId, newMessage, attachments);
      
      if (success) {
        setNewMessage('');
        setAttachments([]);
        // Refresh the messages
        await getMessages();
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsSending(false);
    }
  }, [conversationId, newMessage, attachments, getMessages]);

  // Handle key press (Enter to send)
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // Fetch messages on mount and when conversationId changes
  useEffect(() => {
    getMessages();
    
    // Set up polling for new messages (every 5 seconds)
    const interval = setInterval(() => {
      getMessages();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [conversationId]);

  return {
    messages,
    loading,
    error,
    refreshMessages: getMessages,
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
  };
};
