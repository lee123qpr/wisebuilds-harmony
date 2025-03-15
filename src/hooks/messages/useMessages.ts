
import { useState, useEffect, useCallback } from 'react';
import { Conversation, Message, MessageAttachment } from '@/types/messaging';
import { fetchMessages, markMessagesAsRead, sendMessage, uploadMessageAttachment } from '@/services/messages';
import { updateConversationTime } from '@/services/conversations';

export const useMessages = (selectedConversation: Conversation | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch messages when the conversation changes
  useEffect(() => {
    if (!selectedConversation) {
      setMessages([]);
      return;
    }

    const getMessages = async () => {
      const fetchedMessages = await fetchMessages(selectedConversation.id);
      setMessages(fetchedMessages);

      // Mark unread messages as read
      const unreadMessageIds = fetchedMessages
        .filter((msg: Message) => !msg.is_read)
        .map((msg: Message) => msg.id);

      if (unreadMessageIds.length > 0) {
        markMessagesAsRead(unreadMessageIds);
      }
    };

    getMessages();

    // Set up real-time subscription to messages
    const messagesSubscription = supabase
      .channel(`messages:${selectedConversation.id}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversation.id}`
        }, 
        payload => {
          const newMsg = payload.new as Message;
          setMessages(prev => [...prev, newMsg]);
          
          // Mark as read if it's not from the current user
          if (newMsg.sender_id !== supabase.auth.getUser()?.data?.user?.id) {
            markMessagesAsRead([newMsg.id]);
          }
        }
      )
      .subscribe();

    return () => {
      messagesSubscription.unsubscribe();
    };
  }, [selectedConversation]);

  // Function to handle file selection
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;
    setAttachments(prev => [...prev, ...Array.from(files)]);
  }, []);

  // Function to remove an attachment
  const removeAttachment = useCallback((index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Function to handle sending a message
  const handleSendMessage = useCallback(async () => {
    if (!selectedConversation || (!newMessage.trim() && attachments.length === 0)) return;
    
    setIsSending(true);
    
    try {
      let uploadedAttachments: MessageAttachment[] = [];
      
      // First upload any attachments
      if (attachments.length > 0) {
        setIsUploading(true);
        
        // Upload each attachment
        for (const file of attachments) {
          const attachment = await uploadMessageAttachment(file);
          if (attachment) {
            uploadedAttachments.push(attachment);
          }
        }
        
        setIsUploading(false);
      }
      
      // Then send the message with attachments
      const success = await sendMessage(
        selectedConversation.id, 
        newMessage.trim() || (attachments.length > 0 ? 'Sent attachments' : ''),
        uploadedAttachments
      );
      
      if (success) {
        setNewMessage('');
        setAttachments([]);
        
        // Update the conversation's last message time
        await updateConversationTime(selectedConversation.id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  }, [selectedConversation, newMessage, attachments]);

  // Handle Enter key press to send message
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isSending && newMessage.trim()) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage, isSending, newMessage]);

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
    isUploading
  };
};

export default useMessages;
