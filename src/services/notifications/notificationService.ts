
import { supabase } from '@/integrations/supabase/client';
import { Notification, NotificationType } from './types';

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
    
    // Cast the type to ensure compatibility
    return (data || []).map(notification => ({
      ...notification,
      type: notification.type as NotificationType
    }));
  } catch (error) {
    console.error('Error fetching notifications:', error);
    // Don't throw here, return empty array to prevent UI crashes
    return [];
  }
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (notificationId: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

/**
 * Mark all notifications as read for a user
 */
export const markAllNotificationsAsRead = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return false;
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
          // Cast the type to ensure compatibility
          const notification = {
            ...payload.new,
            type: payload.new.type as NotificationType
          } as Notification;
          callback(notification);
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
