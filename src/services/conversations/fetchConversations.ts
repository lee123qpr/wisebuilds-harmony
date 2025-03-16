
import { supabase } from '@/integrations/supabase/client';
import { Conversation, ClientInfo, FreelancerInfo } from '@/types/messaging';
import { getClientInfo } from './utils/getClientInfo';
import { getFreelancerInfo } from './utils/getFreelancerInfo';

/**
 * Fetches all conversations for a user
 * @param userId The ID of the current user
 * @param isBusinessClient Whether the current user is a business client
 */
export const fetchConversations = async (userId: string, isBusinessClient: boolean = false): Promise<Conversation[]> => {
  try {
    // Determine which field to filter by based on user type
    const filterField = isBusinessClient ? 'client_id' : 'freelancer_id';
    
    // First fetch all conversations
    const { data: conversationsData, error: conversationsError } = await supabase
      .from('conversations')
      .select(`
        id, 
        client_id, 
        freelancer_id, 
        project_id, 
        last_message_time,
        projects:project_id (title)
      `)
      .eq(filterField, userId)
      .order('last_message_time', { ascending: false });
    
    if (conversationsError) {
      console.error('Error fetching conversations:', conversationsError);
      return [];
    }
    
    if (!conversationsData) {
      return [];
    }
    
    // Then fetch partner info separately for each conversation
    const formattedConversations = await Promise.all(conversationsData.map(async (conv) => {
      if (isBusinessClient) {
        // For business clients, get freelancer info
        const freelancerInfo = await getFreelancerInfo(conv.freelancer_id);
        
        return {
          ...conv,
          project_title: conv.projects?.title || 'Unknown Project',
          freelancer_info: freelancerInfo,
          // Add client_info for compatibility with existing components
          client_info: {
            contact_name: freelancerInfo.full_name || 'Freelancer',
            company_name: freelancerInfo.business_name,
            logo_url: freelancerInfo.profile_image,
            email: freelancerInfo.email,
            phone_number: freelancerInfo.phone_number,
            website: null,
            company_address: null
          }
        };
      } else {
        // For freelancers, get client info (existing functionality)
        const clientInfo = await getClientInfo(conv.client_id);
        
        return {
          ...conv,
          project_title: conv.projects?.title || 'Unknown Project',
          client_info: clientInfo
        };
      }
    }));
    
    return formattedConversations;
  } catch (e) {
    console.error('Error in fetchConversations:', e);
    return [];
  }
};
