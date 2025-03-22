
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Set up a notification channel with better error handling
 */
export const setupNotificationChannel = (
  userId: string,
  onNotification: (payload: any) => void
): RealtimeChannel => {
  try {
    console.log('Setting up notifications listener for user:', userId);
    
    const channel = supabase
      .channel(`user-notifications-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Notification received:', payload);
          onNotification(payload);
        }
      )
      .subscribe((status) => {
        console.log('Notification channel status:', status);
        
        // If the channel subscription fails, try to reconnect after a delay
        if (status === 'CHANNEL_ERROR') {
          console.warn('Notification channel error, attempting to reconnect in 5s');
          setTimeout(() => {
            try {
              channel.subscribe();
            } catch (error) {
              console.error('Failed to resubscribe to notification channel:', error);
            }
          }, 5000);
        }
      });
      
    return channel;
  } catch (error) {
    console.error('Error setting up notification channel:', error);
    // Return a dummy channel that won't throw when removed
    return {
      subscribe: () => ({ channel: null }),
      on: () => ({ channel: null }),
      off: () => ({ channel: null }),
      send: () => ({ channel: null }),
      unsubscribe: () => {},
    } as unknown as RealtimeChannel;
  }
};
