
import { useState, useEffect, useCallback } from 'react';
import { Conversation, Message, MessageAttachment } from '@/types/messaging';
import { fetchMessages, markMessagesAsRead, sendMessage, uploadMessageAttachment } from '@/services/messages';
import { updateConversationTime } from '@/services/conversations';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useMessages = (selectedConversation: Conversation | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const { toast } = useToast();

  // Get and store the current user ID
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getSession();
      setCurrentUserId(data.session?.user?.id || null);
    };
    
    getCurrentUser();
  }, []);

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
        .filter((msg: Message) => !msg.is_read && msg.sender_id !== currentUserId)
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
          if (newMsg.sender_id !== currentUserId && currentUserId) {
            markMessagesAsRead([newMsg.id]);
          }
        }
      )
      .subscribe();

    return () => {
      messagesSubscription.unsubscribe();
    };
  }, [selectedConversation, currentUserId]);

  // Function to handle file selection
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;
    
    // Check file sizes - limit to 10MB per file
    const validFiles = Array.from(files).filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 10MB size limit`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });
    
    setAttachments(prev => [...prev, ...validFiles]);
  }, [toast]);

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
        setUploadProgress({});
        
        // Upload each attachment
        for (const [index, file] of attachments.entries()) {
          // Update progress for this file
          setUploadProgress(prev => ({
            ...prev,
            [index]: 0
          }));
          
          try {
            // Upload the file
            const attachment = await uploadMessageAttachment(file);
            if (attachment) {
              uploadedAttachments.push(attachment);
              setUploadProgress(prev => ({
                ...prev,
                [index]: 100
              }));
            } else {
              // Handle failed upload
              toast({
                title: "Upload failed",
                description: `Failed to upload ${file.name}`,
                variant: "destructive"
              });
              setUploadProgress(prev => ({
                ...prev,
                [index]: -1 // -1 indicates error
              }));
            }
          } catch (error) {
            console.error(`Error uploading file ${file.name}:`, error);
            setUploadProgress(prev => ({
              ...prev,
              [index]: -1
            }));
          }
        }
        
        setIsUploading(false);
      }
      
      // Then send the message with attachments
      const success = await sendMessage(
        selectedConversation.id, 
        newMessage.trim(),
        uploadedAttachments
      );
      
      if (success) {
        setNewMessage('');
        setAttachments([]);
        setUploadProgress({});
        
        // Update the conversation's last message time
        await updateConversationTime(selectedConversation.id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "An unexpected error occurred while sending your message",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  }, [selectedConversation, newMessage, attachments, toast]);

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
    isUploading,
    uploadProgress
  };
};

export default useMessages;
