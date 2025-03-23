
import { useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotificationsState } from './useNotificationsState';
import { fetchNotifications } from '@/services/notifications/notificationService';
import { setupListeners } from '@/services/notifications/realTimeListeners';
import { Notification } from '@/services/notifications/types';

// Maximum number of retries for network operations
const MAX_RETRIES = 2;
// Delay between retries in milliseconds (exponential backoff)
const RETRY_DELAY_BASE = 2000;

export function useNotificationListeners() {
  const { user } = useAuth();
  const { 
    setNotifications, 
    addNotificationToState
  } = useNotificationsState();

  // Fetch notifications with retry mechanism
  const initializeNotifications = useCallback(async () => {
    if (!user) return;
    
    console.log('Initializing notifications for user:', user.id);
    
    let retries = 0;
    let success = false;
    
    while (retries < MAX_RETRIES && !success) {
      try {
        const notifications = await fetchNotifications(user.id);
        console.log('Fetched notifications:', notifications.length);
        setNotifications(notifications);
        success = true;
      } catch (error) {
        console.error('Error checking notifications table:', error);
        retries++;
        
        if (retries < MAX_RETRIES) {
          // Exponential backoff
          const delay = RETRY_DELAY_BASE * Math.pow(2, retries - 1);
          console.log(`Retrying in ${delay}ms (attempt ${retries} of ${MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          // If all retries fail, initialize with empty notifications
          console.log('All retries failed, initializing with empty notifications');
          setNotifications([]);
        }
      }
    }
  }, [user, setNotifications]);

  // Set up all listeners when user is available
  useEffect(() => {
    if (!user) return;
    
    console.log('Setting up notification listeners for user:', user.id);
    
    // Initialize notifications (with retry mechanism)
    initializeNotifications();
    
    // Handle real-time notifications
    const onNotification = (payload: any) => {
      console.log('New notification received:', payload);
      if (payload.new) {
        const notification = payload.new as Notification;
        addNotificationToState(notification);
      }
    };
    
    // Set up real-time listeners for all notification types
    const cleanup = setupListeners(user.id, onNotification);
    
    return () => {
      console.log('Cleaning up notification channels');
      cleanup();
    };
  }, [user, addNotificationToState, initializeNotifications]);
}
