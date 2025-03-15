
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Conversation } from '@/services/conversations';
import { 
  Message, 
  fetchMessages, 
  markMessagesAsRead, 
  sendMessage 
} from '@/services/messages';
import { updateConversationTime, getCurrentUserId } from '@/services/conversations';

export const useMessages = (selectedConversation: Conversation | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  // Fetch messages for a conversation
  const fetchConversationMessages = async (conversationId: string) => {
    try {
      const data = await fetchMessages(conversationId);
      setMessages(data);
      
      // Mark messages as read
      const userId = await getCurrentUserId();
      if (userId) {
        const unreadMessages = data.filter((msg: Message) => 
          msg.sender_id !== userId && !msg.is_read
        );
        
        if (unreadMessages.length > 0) {
          const unreadIds = unreadMessages.map((msg: Message) => msg.id);
          await markMessagesAsRead(unreadIds);
        }
      }
    } catch (e) {
      console.error('Error in fetchConversationMessages:', e);
    }
  };

  // Send a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    setIsSending(true);
    try {
      const success = await sendMessage(selectedConversation.id, newMessage);
      
      if (success) {
        // Update last message time
        await updateConversationTime(selectedConversation.id);
        
        setNewMessage('');
        fetchConversationMessages(selectedConversation.id);
      }
    } catch (e) {
      console.error('Error in handleSendMessage:', e);
      toast({
        title: "Failed to send message",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
    setIsSending(false);
  };

  // Set up listener for new messages
  useEffect(() => {
    if (!selectedConversation) return;

    // Subscribe to new messages
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' }, 
        payload => {
          const newMsg = payload.new as Message;
          if (selectedConversation?.id === newMsg.conversation_id) {
            setMessages(prev => [...prev, newMsg]);
          }
        }
      )
      .subscribe();
    
    // Fetch initial messages
    fetchConversationMessages(selectedConversation.id);
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation]);

  // Handle key press for sending messages
  const handleKeyPress = (e: React.KeyboardEvent) => {
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
    handleKeyPress
  };
};
