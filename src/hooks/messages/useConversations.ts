
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface ClientInfo {
  contact_name: string | null;
  email: string | null;
  company_name: string | null;
}

export interface Conversation {
  id: string;
  client_id: string;
  freelancer_id: string;
  project_id: string;
  last_message_time: string;
  project_title: string;
  client_info: ClientInfo | null;
}

export const useConversations = (projectId?: string | null, clientId?: string | null) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Fetch user ID (freelancer ID in this case)
  const getCurrentUserId = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.user.id;
  };
  
  // Create a new conversation
  const createNewConversation = async (freelancerId: string, clientId: string, projectId: string) => {
    try {
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
      
      // We need to use type assertion because conversations table isn't in the Supabase type definition
      const { data, error } = await (supabase
        .from('conversations') as any)
        .insert({
          freelancer_id: freelancerId,
          client_id: clientId,
          project_id: projectId,
          last_message_time: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating conversation:', error);
        toast({
          title: "Failed to create conversation",
          description: error.message,
          variant: "destructive"
        });
        return null;
      } else {
        const newConversation: Conversation = {
          ...data,
          project_title: projectData?.title || 'Unknown Project',
          client_info: clientData || null
        };
        
        setConversations(prev => [newConversation, ...prev]);
        setSelectedConversation(newConversation);
        return newConversation;
      }
    } catch (e) {
      console.error('Error in createNewConversation:', e);
      toast({
        title: "Failed to create conversation",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return null;
    }
  };
  
  // Fetch conversations
  const fetchConversations = async () => {
    setIsLoading(true);
    const userId = await getCurrentUserId();
    
    if (!userId) {
      setIsLoading(false);
      return;
    }
    
    try {
      // We need to use type assertion because conversations table isn't in the Supabase type definition
      const { data, error } = await (supabase
        .from('conversations') as any)
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
        .order('last_message_time', { ascending: false });
      
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
    } catch (e) {
      console.error('Error in fetchConversations:', e);
      toast({
        title: "Failed to load conversations",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    fetchConversations();
  }, [projectId, clientId]);

  return { 
    conversations, 
    selectedConversation, 
    setSelectedConversation, 
    isLoading, 
    fetchConversations 
  };
};
