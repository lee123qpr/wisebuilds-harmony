
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

// Create a notification listener for new and updated notifications
export const createNotificationsListener = (
  userId: string,
  onNewNotification: (notification: any) => void,
  onNotificationUpdate: (notification: any) => void
): RealtimeChannel => {
  console.log('Setting up notifications listener for user:', userId);
  return supabase
    .channel('public:notifications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('New notification received:', payload.new);
        onNewNotification(payload.new);
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('Notification updated:', payload.new);
        onNotificationUpdate(payload.new);
      }
    )
    .subscribe();
};
