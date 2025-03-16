
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Conversation } from '@/types/messaging';
import { getClientInfo } from './utils/getClientInfo';
import { getFreelancerInfo } from './utils/getFreelancerInfo';

export const fetchConversations = async (userId: string, isBusinessClient: boolean = false): Promise<Conversation[]> => {
  try {
    const field = isBusinessClient ? 'client_id' : 'freelancer_id';
    
    // Fetch all conversations for the user
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        projects(title)
      `)
      .eq(field, userId)
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
    
    // Process the conversations to include more information
    const processed = await Promise.all(data.map(async conversation => {
      const partnerId = isBusinessClient ? conversation.freelancer_id : conversation.client_id;
      
      // Get partner info (client or freelancer)
      const partnerInfo = isBusinessClient
        ? await getFreelancerInfo(partnerId)
        : await getClientInfo(partnerId);
      
      // Construct the conversation with additional info
      return {
        ...conversation,
        project_title: conversation.projects?.title,
        [isBusinessClient ? 'freelancer_info' : 'client_info']: partnerInfo
      };
    }));
    
    return processed as Conversation[];
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
