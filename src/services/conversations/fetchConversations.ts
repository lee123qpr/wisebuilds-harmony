
import { supabase } from '@/integrations/supabase/client';
import { Conversation } from '@/types/messaging';
import { getFreelancerInfo } from './utils/getFreelancerInfo';
import { getClientInfo } from './utils/getClientInfo';
import type { Json } from '@/integrations/supabase/types';

export const fetchConversations = async (
  userId: string, 
  isBusinessClient: boolean = false
): Promise<Conversation[]> => {
  try {
    const field = isBusinessClient ? 'client_id' : 'freelancer_id';
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        project_info:projects!inner(id, title)
      `)
      .eq(field, userId)
      .order('last_message_time', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Get details of conversation partners
    const conversationsWithDetails = await Promise.all(
      data.map(async (conversation) => {
        // For clients, get freelancer info
        // For freelancers, get client info
        const partnerId = isBusinessClient ? conversation.freelancer_id : conversation.client_id;
        
        let partnerInfo;
        if (isBusinessClient) {
          partnerInfo = await getFreelancerInfo(partnerId);
          return {
            ...conversation,
            freelancer_info: partnerInfo,
            project_title: conversation.project_info?.title || 'Unnamed Project'
          } as Conversation;
        } else {
          partnerInfo = await getClientInfo(partnerId);
          return {
            ...conversation,
            client_info: partnerInfo,
            project_title: conversation.project_info?.title || 'Unnamed Project'
          } as Conversation;
        }
      })
    );
    
    return conversationsWithDetails;
  } catch (e) {
    console.error('Error in fetchConversations:', e);
    return [];
  }
};
