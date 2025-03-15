
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Conversation } from '@/types/messaging';
import { 
  fetchConversations, 
  createConversation, 
  getCurrentUserId 
} from '@/services/conversations';

export const useConversations = (projectId?: string | null, clientId?: string | null) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Create a new conversation
  const createNewConversation = async (freelancerId: string, clientId: string, projectId: string) => {
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
      const data = await fetchConversations(userId);
      setConversations(data);
      
      // If there's a projectId and clientId in the URL, select or create that conversation
      if (projectId && clientId) {
        const existingConversation = data.find(
          (c: Conversation) => c.project_id === projectId && c.client_id === clientId
        );
        
        if (existingConversation) {
          setSelectedConversation(existingConversation);
        } else {
          // Create a new conversation if it doesn't exist
          await createNewConversation(userId, clientId, projectId);
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
  }, [projectId, clientId]);

  return { 
    conversations, 
    selectedConversation, 
    setSelectedConversation, 
    isLoading, 
    fetchConversations: fetchConversationsList 
  };
};
