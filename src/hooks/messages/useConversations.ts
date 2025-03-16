
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Conversation } from '@/types/messaging';
import { createConversation, getCurrentUserId } from '@/services/conversations';
import { fetchConversations } from '@/services/conversations/fetchConversations';

export const useConversations = (
  projectId?: string | null, 
  partnerId?: string | null, 
  isBusinessClient: boolean = false
) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Create a new conversation
  const createNewConversation = async (currentUserId: string, partnerId: string, projectId: string) => {
    // For business client, currentUserId is the client_id and partnerId is the freelancer_id
    // For freelancer, currentUserId is the freelancer_id and partnerId is the client_id
    const clientId = isBusinessClient ? currentUserId : partnerId;
    const freelancerId = isBusinessClient ? partnerId : currentUserId;
    
    const newConversation = await createConversation(freelancerId, clientId, projectId);
    
    if (newConversation) {
      setConversations(prev => [newConversation, ...prev]);
      setSelectedConversation(newConversation);
    }
    
    return newConversation;
  };
  
  // Fetch conversations
  const fetchConversationsList = async () => {
    setIsLoading(true);
    const userId = await getCurrentUserId();
    
    if (!userId) {
      setIsLoading(false);
      return;
    }
    
    try {
      // Import from the new import path which accepts isBusinessClient parameter
      const data = await fetchConversations(userId, isBusinessClient);
      setConversations(data);
      
      // If there's a projectId and partnerId in the URL, select or create that conversation
      if (projectId && partnerId) {
        const existingConversation = data.find(
          (c: Conversation) => c.project_id === projectId && 
            (isBusinessClient ? c.freelancer_id === partnerId : c.client_id === partnerId)
        );
        
        if (existingConversation) {
          setSelectedConversation(existingConversation);
        } else {
          // Create a new conversation if it doesn't exist
          await createNewConversation(userId, partnerId, projectId);
        }
      } else if (data.length > 0) {
        // Select the first conversation by default
        setSelectedConversation(data[0]);
      }
    } catch (e) {
      console.error('Error in fetchConversationsList:', e);
      toast({
        title: "Failed to load conversations",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    fetchConversationsList();
  }, [projectId, partnerId]);

  return { 
    conversations, 
    selectedConversation, 
    setSelectedConversation, 
    isLoading, 
    fetchConversations: fetchConversationsList 
  };
};
