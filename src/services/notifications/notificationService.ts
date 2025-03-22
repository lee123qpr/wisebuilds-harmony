
import { supabase } from '@/integrations/supabase/client';
import { Notification } from '../notifications/types';

// Maximum number of notifications to fetch
const NOTIFICATION_LIMIT = 20;

/**
 * Fetch notifications for a user
 */
export const fetchNotifications = async (userId: string, limit = NOTIFICATION_LIMIT): Promise<Notification[]> => {
  try {
    // Check if the notifications table exists and is accessible
    const { count, error: checkError } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .limit(1);
    
    if (checkError) {
      throw checkError;
    }
    
    // Proceed with fetching notifications
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    // Don't throw here, return empty array to prevent UI crashes
    return [];
  }
};

/**
 * Set up real-time listeners for notifications
 */
export const setupNotificationsListeners = (userId: string, callback: (notification: Notification) => void) => {
  // Create a channel for notification updates
  const channel = supabase
    .channel(`notifications-for-${userId}`)
    .on(
      'postgres_changes',
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('Real-time notification received:', payload);
        if (payload.new) {
          callback(payload.new as Notification);
        }
      }
    )
    .subscribe((status) => {
      console.log('Notifications subscription status:', status);
    });
  
  // Return cleanup function
  return () => {
    supabase.removeChannel(channel);
  };
};
