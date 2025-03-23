
import { supabase } from '@/integrations/supabase/client';
import { setupNotificationChannel } from './listeners/notificationListeners';
import { RealtimeChannel } from '@supabase/supabase-js';

// Map to track active channels by user ID to prevent duplicate subscriptions
const activeChannels = new Map<string, RealtimeChannel[]>();

/**
 * Set up all real-time listeners for notifications
 */
export const setupListeners = (userId: string, onNotification: (payload: any) => void) => {
  if (!userId) {
    console.warn('Cannot set up listeners: No user ID provided');
    return () => {};
  }
  
  // Check if we already have active channels for this user
  if (activeChannels.has(userId) && activeChannels.get(userId)?.length > 0) {
    console.log('Listeners already set up for user', userId);
    return () => {
      // Return existing cleanup function
      const channels = activeChannels.get(userId) || [];
      channels.forEach(channel => {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.warn('Error removing channel:', error);
        }
      });
      activeChannels.delete(userId);
    };
  }
  
  // Clean up any existing channels for this user to prevent duplicates
  if (activeChannels.has(userId)) {
    const channels = activeChannels.get(userId) || [];
    channels.forEach(channel => {
      try {
        supabase.removeChannel(channel);
      } catch (error) {
        console.warn('Error removing channel:', error);
      }
    });
  }
  
  // Set up new channels with error handling
  const channels: RealtimeChannel[] = [];
  
  try {
    // Notification channel
    const notificationChannel = setupNotificationChannel(userId, onNotification);
    channels.push(notificationChannel);
    
    // Store active channels for this user
    activeChannels.set(userId, channels);
    
    // Return cleanup function
    return () => {
      channels.forEach(channel => {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.warn('Error removing channel during cleanup:', error);
        }
      });
      activeChannels.delete(userId);
    };
  } catch (error) {
    console.error('Error setting up real-time listeners:', error);
    return () => {};
  }
};
