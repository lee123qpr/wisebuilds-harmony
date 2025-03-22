
import { supabase } from '@/integrations/supabase/client';
import { Notification } from './types';
import { User } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

export const fetchNotifications = async (userId: string): Promise<Notification[]> => {
  if (!userId) return [];
  
  try {
    // Check if the table exists
    const { data: exists, error: checkError } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .limit(1);
      
    if (checkError) {
      console.error('Error checking notifications table:', checkError);
      return [];
    }
    
    // Fetch notifications from the table
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
    
    return (data as Notification[]) || [];
  } catch (error) {
    console.error('Error in fetchNotifications:', error);
    return [];
  }
};

export const markNotificationAsRead = async (id: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in markNotificationAsRead:', error);
    return false;
  }
};

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
    console.error('Error in markAllNotificationsAsRead:', error);
    return false;
  }
};

export const addNotificationToDatabase = async (
  user: User | null, 
  notificationData: Omit<Notification, 'id' | 'created_at' | 'read'>
): Promise<Notification | null> => {
  if (!user) return null;
  
  try {
    // Insert into the notifications table
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: user.id,
        type: notificationData.type,
        title: notificationData.title,
        description: notificationData.description,
        data: notificationData.data || {},
        read: false
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding notification:', error);
      return null;
    }
    
    // Show toast notification
    toast({
      title: notificationData.title,
      description: notificationData.description,
      variant: "default"
    });
    
    return data as Notification;
  } catch (error) {
    console.error('Error in addNotification:', error);
    return null;
  }
};
