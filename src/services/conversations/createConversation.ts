
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Conversation } from '@/types/messaging';
import { getClientInfo } from './utils/getClientInfo';

/**
 * Creates a new conversation
 */
export const createConversation = async (freelancerId: string, clientId: string, projectId: string) => {
  try {
    // Get the project title
    const { data: projectData } = await supabase
      .from('projects')
      .select('title')
      .eq('id', projectId)
      .single();
    
    // Get client info using our utility function
    const clientInfo = await getClientInfo(clientId);
    
    // Create the conversation
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
      client_info: clientInfo
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
