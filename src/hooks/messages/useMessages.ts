
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Conversation } from './useConversations';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export const useMessages = (selectedConversation: Conversation | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  // Fetch user ID (freelancer ID in this case)
  const getCurrentUserId = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.user.id;
  };

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId: string) => {
    try {
      // We need to use type assertion because messages table isn't in the Supabase type definition
      const { data, error } = await (supabase
        .from('messages') as any)
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Failed to load messages",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setMessages(data || []);
        
        // Mark messages as read
        const userId = await getCurrentUserId();
        const unreadMessages = (data?.filter((msg: Message) => 
          msg.sender_id !== userId && !msg.is_read
        ) || []) as Message[];
        
        if (unreadMessages.length > 0) {
          const unreadIds = unreadMessages.map((msg: Message) => msg.id);
          await (supabase
            .from('messages') as any)
            .update({ is_read: true })
            .in('id', unreadIds);
        }
      }
    } catch (e) {
      console.error('Error in fetchMessages:', e);
      toast({
        title: "Failed to load messages",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    setIsSending(true);
    try {
      const userId = await getCurrentUserId();
      
      // We need to use type assertion because messages table isn't in the Supabase type definition
      const { error } = await (supabase
        .from('messages') as any)
        .insert({
          conversation_id: selectedConversation.id,
          sender_id: userId,
          message: newMessage.trim(),
          is_read: false
        });
      
      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Failed to send message",
          description: error.message,
          variant: "destructive"
        });
      } else {
        // Update last message time
        await (supabase
          .from('conversations') as any)
          .update({ last_message_time: new Date().toISOString() })
          .eq('id', selectedConversation.id);
        
        setNewMessage('');
        fetchMessages(selectedConversation.id);
      }
    } catch (e) {
      console.error('Error in sendMessage:', e);
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
          const newMessage = payload.new as Message;
          if (selectedConversation?.id === newMessage.conversation_id) {
            setMessages(prev => [...prev, newMessage]);
          }
        }
      )
      .subscribe();
    
    // Fetch initial messages
    fetchMessages(selectedConversation.id);
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation]);

  // Handle key press for sending messages
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    isSending,
    sendMessage,
    handleKeyPress
  };
};
