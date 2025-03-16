
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Conversation, ClientInfo, FreelancerInfo } from '@/types/messaging';
import { getClientInfo } from './conversations/utils/getClientInfo';
import { getFreelancerInfo } from './conversations/utils/getFreelancerInfo';
import { updateConversationTime } from './conversations/updateConversationTime';

// Get the current authenticated user's ID
export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.user.id || null;
  } catch (error) {
    console.error('Error getting current user ID:', error);
    return null;
  }
};

// Create a new conversation
export const createConversation = async (
  freelancerId: string,
  clientId: string,
  projectId: string
): Promise<Conversation | null> => {
  try {
    // First, check if a conversation already exists for this combination
    const { data: existingConversation, error: checkError } = await supabase
      .from('conversations')
      .select('*')
      .eq('freelancer_id', freelancerId)
      .eq('client_id', clientId)
      .eq('project_id', projectId)
      .maybeSingle();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking for existing conversation:', checkError);
      toast({
        title: "Error",
        description: "Could not create conversation",
        variant: "destructive"
      });
      return null;
    }
    
    // If conversation already exists, return it with client and freelancer info
    if (existingConversation) {
      // Get the project title
      const { data: projectData } = await supabase
        .from('projects')
        .select('title')
        .eq('id', projectId)
        .single();
      
      // Get client and freelancer info
      const clientInfo = await getClientInfo(clientId);
      const freelancerInfo = await getFreelancerInfo(freelancerId);
      
      // Return the existing conversation with additional info
      return {
        ...existingConversation,
        project_title: projectData?.title,
        client_info: clientInfo || undefined,
        freelancer_info: freelancerInfo
      };
    }
    
    // Create a new conversation
    const { data: newConversation, error: insertError } = await supabase
      .from('conversations')
      .insert({
        freelancer_id: freelancerId,
        client_id: clientId,
        project_id: projectId
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('Error creating conversation:', insertError);
      toast({
        title: "Error",
        description: "Could not create conversation",
        variant: "destructive"
      });
      return null;
    }
    
    // Get the project title
    const { data: projectData } = await supabase
      .from('projects')
      .select('title')
      .eq('id', projectId)
      .single();
    
    // Get client and freelancer info
    const clientInfo = await getClientInfo(clientId);
    const freelancerInfo = await getFreelancerInfo(freelancerId);
    
    // Return the new conversation with additional info
    return {
      ...newConversation,
      project_title: projectData?.title,
      client_info: clientInfo || undefined,
      freelancer_info: freelancerInfo
    };
  } catch (error) {
    console.error('Error in createConversation:', error);
    toast({
      title: "Error",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

// Export other functions from their respective modules
export { fetchMessages } from './messages';
export { updateConversationTime };
