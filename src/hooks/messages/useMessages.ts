
import { useState, useEffect, useCallback } from 'react';
import { Conversation, Message, MessageAttachment } from '@/types/messaging';
import { fetchMessages, markMessagesAsRead, sendMessage, uploadMessageAttachment } from '@/services/messages';
import { updateConversationTime } from '@/services/conversations';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/context/NotificationsContext';

export const useMessages = (selectedConversation: Conversation | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getSession();
      setCurrentUserId(data.session?.user?.id || null);
    };
    
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (!selectedConversation) {
      setMessages([]);
      return;
    }

    const getMessages = async () => {
      const fetchedMessages = await fetchMessages(selectedConversation.id);
      setMessages(fetchedMessages);

      const unreadMessageIds = fetchedMessages
        .filter((msg: Message) => !msg.is_read && msg.sender_id !== currentUserId)
        .map((msg: Message) => msg.id);

      if (unreadMessageIds.length > 0) {
        markMessagesAsRead(unreadMessageIds);
      }
    };

    getMessages();

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
          
          if (newMsg.sender_id !== currentUserId && currentUserId) {
            markMessagesAsRead([newMsg.id]);
            
            // Add notification for message if it's from someone else
            const senderName = selectedConversation.freelancer_id === newMsg.sender_id
              ? selectedConversation.freelancer_name
              : selectedConversation.client_name;
              
            addNotification({
              type: 'message',
              title: 'New Message',
              description: `${senderName} sent you a message`,
              data: {
                conversation_id: selectedConversation.id,
                message_id: newMsg.id
              }
            });
          }
        }
      )
      .subscribe();

    return () => {
      messagesSubscription.unsubscribe();
    };
  }, [selectedConversation, currentUserId, addNotification]);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB
    
    const validFiles = Array.from(files).filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 30MB size limit. For larger files, consider using WeTransfer or similar services.`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });
    
    setAttachments(prev => [...prev, ...validFiles]);
  }, [toast]);

  const removeAttachment = useCallback((index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!selectedConversation || (!newMessage.trim() && attachments.length === 0)) return;
    
    setIsSending(true);
    
    try {
      let uploadedAttachments: MessageAttachment[] = [];
      
      if (attachments.length > 0) {
        setIsUploading(true);
        setUploadProgress({});
        
        for (const [index, file] of attachments.entries()) {
          setUploadProgress(prev => ({
            ...prev,
            [index]: 0
          }));
          
          try {
            const attachment = await uploadMessageAttachment(file);
            if (attachment) {
              uploadedAttachments.push(attachment);
              setUploadProgress(prev => ({
                ...prev,
                [index]: 100
              }));
            } else {
              toast({
                title: "Upload failed",
                description: `Failed to upload ${file.name}`,
                variant: "destructive"
              });
              setUploadProgress(prev => ({
                ...prev,
                [index]: -1
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
      
      const success = await sendMessage(
        selectedConversation.id, 
        newMessage.trim(),
        uploadedAttachments
      );
      
      if (success) {
        setNewMessage('');
        setAttachments([]);
        setUploadProgress({});
        
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

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isSending) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage, isSending]);

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
