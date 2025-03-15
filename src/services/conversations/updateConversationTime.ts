
import { supabase } from '@/integrations/supabase/client';

/**
 * Updates a conversation's last message time
 */
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
