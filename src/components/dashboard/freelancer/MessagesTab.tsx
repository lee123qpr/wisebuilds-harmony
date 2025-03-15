
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, User, Phone, Mail, RefreshCcw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import EmptyStateCard from './EmptyStateCard';

// Define interfaces for our data structures
interface ClientInfo {
  contact_name: string | null;
  email: string | null;
  company_name: string | null;
}

interface Conversation {
  id: string;
  client_id: string;
  freelancer_id: string;
  project_id: string;
  last_message_time: string;
  project_title: string;
  client_info: ClientInfo | null;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

// Use type assertion for Supabase queries
const MessagesTab: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const clientId = searchParams.get('clientId');
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  
  // Fetch user ID (freelancer ID in this case)
  const getCurrentUserId = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.user.id;
  };
  
  // Fetch conversations
  const fetchConversations = async () => {
    setIsLoading(true);
    const userId = await getCurrentUserId();
    
    if (!userId) {
      setIsLoading(false);
      return;
    }
    
    // Using any to work around type issues
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        id, 
        client_id, 
        freelancer_id, 
        project_id, 
        last_message_time,
        projects:project_id (title),
        client_info:client_id (
          contact_name,
          email,
          company_name
        )
      `)
      .eq('freelancer_id', userId)
      .order('last_message_time', { ascending: false }) as any;
    
    if (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Failed to load conversations",
        description: error.message,
        variant: "destructive"
      });
    } else {
      const formattedConversations = data.map((conv: any) => ({
        ...conv,
        project_title: conv.projects?.title || 'Unknown Project'
      }));
      setConversations(formattedConversations);
      
      // If there's a projectId and clientId in the URL, select or create that conversation
      if (projectId && clientId) {
        const existingConversation = formattedConversations.find(
          (c: Conversation) => c.project_id === projectId && c.client_id === clientId
        );
        
        if (existingConversation) {
          setSelectedConversation(existingConversation);
        } else {
          // Create a new conversation if it doesn't exist
          createNewConversation(userId, clientId, projectId);
        }
      } else if (formattedConversations.length > 0) {
        // Select the first conversation by default
        setSelectedConversation(formattedConversations[0]);
      }
    }
    setIsLoading(false);
  };
  
  // Create a new conversation
  const createNewConversation = async (freelancerId: string, clientId: string, projectId: string) => {
    // Get the project title
    const { data: projectData } = await supabase
      .from('projects')
      .select('title')
      .eq('id', projectId)
      .single();
    
    // Get client info
    const { data: clientData } = await supabase
      .from('client_profiles')
      .select('contact_name, email, company_name')
      .eq('id', clientId)
      .maybeSingle();
    
    // Using any to work around type issues
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        freelancer_id: freelancerId,
        client_id: clientId,
        project_id: projectId,
        last_message_time: new Date().toISOString()
      })
      .select()
      .single() as any;
    
    if (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Failed to create conversation",
        description: error.message,
        variant: "destructive"
      });
    } else {
      const newConversation = {
        ...data,
        project_title: projectData?.title || 'Unknown Project',
        client_info: clientData
      };
      
      setConversations(prev => [newConversation, ...prev]);
      setSelectedConversation(newConversation);
    }
  };
  
  // Fetch messages for a conversation
  const fetchMessages = async (conversationId: string) => {
    // Using any to work around type issues
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true }) as any;
    
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
      const unreadMessages = data?.filter((msg: Message) => 
        msg.sender_id !== userId && !msg.is_read
      ) || [];
      
      if (unreadMessages.length > 0) {
        const unreadIds = unreadMessages.map((msg: Message) => msg.id);
        await supabase
          .from('messages')
          .update({ is_read: true })
          .in('id', unreadIds);
      }
    }
  };
  
  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    setIsSending(true);
    const userId = await getCurrentUserId();
    
    // Using any to work around type issues
    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: selectedConversation.id,
        sender_id: userId,
        message: newMessage.trim(),
        is_read: false
      }) as any;
    
    if (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive"
      });
    } else {
      // Update last message time
      await supabase
        .from('conversations')
        .update({ last_message_time: new Date().toISOString() })
        .eq('id', selectedConversation.id);
      
      setNewMessage('');
      fetchMessages(selectedConversation.id);
    }
    setIsSending(false);
  };
  
  // Load conversations on component mount
  useEffect(() => {
    fetchConversations();
    
    // Set up realtime subscription for new messages
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
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);
  
  // Handle key press for sending messages
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4 h-[calc(100vh-240px)]">
        <div className="col-span-1 border rounded-md p-4">
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-16 w-full mb-2" />
          <Skeleton className="h-16 w-full mb-2" />
          <Skeleton className="h-16 w-full" />
        </div>
        <div className="col-span-2 border rounded-md p-4">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <div className="space-y-2 mb-4">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-10 w-1/2 ml-auto" />
            <Skeleton className="h-10 w-3/4" />
          </div>
          <Skeleton className="h-12 w-full mt-auto" />
        </div>
      </div>
    );
  }
  
  if (conversations.length === 0) {
    return (
      <EmptyStateCard
        title="No messages yet"
        description="When you contact clients, your conversations will appear here."
      />
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-240px)]">
      {/* Conversations list */}
      <div className="md:col-span-1 border rounded-md overflow-hidden flex flex-col">
        <div className="p-3 bg-muted/50 border-b flex justify-between items-center">
          <h3 className="font-medium">Conversations</h3>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={fetchConversations}
            title="Refresh conversations"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
        <div className="overflow-y-auto flex-grow">
          {conversations.map(conversation => (
            <div 
              key={conversation.id}
              className={`p-3 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                selectedConversation?.id === conversation.id ? 'bg-muted' : ''
              }`}
              onClick={() => setSelectedConversation(conversation)}
            >
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary rounded-full p-2">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="font-medium truncate">
                    {conversation.client_info?.contact_name || 'Unknown Client'}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {conversation.project_title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(conversation.last_message_time).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Chat area */}
      <div className="md:col-span-2 border rounded-md flex flex-col overflow-hidden">
        {selectedConversation ? (
          <>
            {/* Chat header */}
            <div className="p-3 bg-muted/50 border-b">
              <div className="font-medium">
                {selectedConversation.client_info?.contact_name || 'Unknown Client'}
              </div>
              <div className="text-sm text-muted-foreground">
                {selectedConversation.project_title}
              </div>
              
              {/* Client contact details */}
              <div className="flex flex-wrap gap-4 mt-2 text-xs">
                {selectedConversation.client_info?.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    <span>{selectedConversation.client_info.email}</span>
                  </div>
                )}
                {selectedConversation.client_info?.company_name && (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{selectedConversation.client_info.company_name}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map(message => {
                  // Use async IIFE to check user ID
                  const isCurrentUser = message.sender_id === (async () => await getCurrentUserId())() ? true : false;
                  
                  return (
                    <div 
                      key={message.id} 
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          isCurrentUser 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}
                      >
                        <div>{message.message}</div>
                        <div className="text-xs opacity-75 mt-1">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            {/* Message input */}
            <div className="p-3 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={isSending}
                  className="flex-grow"
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!newMessage.trim() || isSending}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Card className="w-3/4 p-6 text-center">
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">
                Choose a conversation from the list to view messages
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesTab;
