
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

// Setup a listener for new messages
export const createMessagesListener = (
  userId: string,
  onNewMessage: (message: any) => void
): RealtimeChannel => {
  console.log('Setting up messages listener for user:', userId);
  
  return supabase
    .channel('public:messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `sender_id=neq.${userId}`
      },
      (payload) => {
        console.log('New message received:', payload.new);
        onNewMessage(payload.new);
      }
    )
    .subscribe();
};
