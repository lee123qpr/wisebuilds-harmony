
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ClientInfo } from '@/hooks/messages/useConversations';

// Define types
export interface Conversation {
  id: string;
  client_id: string;
  freelancer_id: string;
  project_id: string;
  last_message_time: string;
  project_title: string;
  client_info: ClientInfo | null;
}

// Get current user ID helper
export const getCurrentUserId = async (): Promise<string | null> => {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id || null;
};

// Fetch all conversations for a user
export const fetchConversations = async (userId: string) => {
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
      return [];
    }
    
    const formattedConversations = data.map((conv: any) => ({
      ...conv,
      project_title: conv.projects?.title || 'Unknown Project'
    }));
    
    return formattedConversations;
  } catch (e) {
    console.error('Error in fetchConversations:', e);
    toast({
      title: "Failed to load conversations",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return [];
  }
};

// Create a new conversation
export const createConversation = async (freelancerId: string, clientId: string, projectId: string) => {
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
    }
    
    const newConversation: Conversation = {
      ...data,
      project_title: projectData?.title || 'Unknown Project',
      client_info: clientData || null
    };
    
    return newConversation;
  } catch (e) {
    console.error('Error in createConversation:', e);
    toast({
      title: "Failed to create conversation",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

// Update conversation's last message time
export const updateConversationTime = async (conversationId: string) => {
  try {
    return await (supabase
      .from('conversations') as any)
      .update({ last_message_time: new Date().toISOString() })
      .eq('id', conversationId);
  } catch (error) {
    console.error('Error updating conversation time:', error);
    return { error };
  }
};
