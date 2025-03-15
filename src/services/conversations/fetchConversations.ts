
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Conversation } from '@/types/messaging';
import { getClientInfo } from './utils/getClientInfo';

/**
 * Fetches all conversations for a user
 */
export const fetchConversations = async (userId: string) => {
  try {
    // First fetch all conversations
    const { data: conversationsData, error: conversationsError } = await (supabase
      .from('conversations') as any)
      .select(`
        id, 
        client_id, 
        freelancer_id, 
        project_id, 
        last_message_time,
        projects:project_id (title)
      `)
      .eq('freelancer_id', userId)
      .order('last_message_time', { ascending: false });
    
    if (conversationsError) {
      console.error('Error fetching conversations:', conversationsError);
      toast({
        title: "Failed to load conversations",
        description: conversationsError.message,
        variant: "destructive"
      });
      return [];
    }
    
    // Then fetch client info separately for each conversation
    const formattedConversations = await Promise.all(conversationsData.map(async (conv: any) => {
      // Get client info using our utility function
      const clientInfo = await getClientInfo(conv.client_id);
      
      return {
        ...conv,
        project_title: conv.projects?.title || 'Unknown Project',
        client_info: clientInfo
      };
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
