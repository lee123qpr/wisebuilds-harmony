
import { useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotificationsState } from './useNotificationsState';
import { useNotificationActions } from './useNotificationActions';
import { useNotificationEventHandlers } from './useNotificationEventHandlers';
import { fetchNotifications } from '@/services/notifications/notificationService';
import { setupListeners } from '@/services/notifications/realTimeListeners';
import { Notification } from '@/services/notifications/types';

// Maximum number of retries for network operations
const MAX_RETRIES = 3;
// Delay between retries in milliseconds (exponential backoff)
const RETRY_DELAY_BASE = 2000;

export const useNotificationsService = () => {
  const { user } = useAuth();
  const {
    notifications,
    setNotifications,
    isLoading,
    setIsLoading,
    unreadCount,
    addNotificationToState,
    updateNotificationInState
  } = useNotificationsState();

  const { markAsRead, markAllAsRead } = useNotificationActions(
    user?.id,
    notifications,
    setNotifications
  );

  const eventHandlers = useNotificationEventHandlers(
    user,
    addNotificationToState
  );

  // Fetch notifications with retry mechanism
  const initializeNotifications = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
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
          // If all retries fail, we still initialize with empty notifications to prevent UI issues
          console.log('All retries failed, initializing with empty notifications');
          setNotifications([]);
        }
      } finally {
        setIsLoading(false);
      }
    }
  }, [user, setNotifications, setIsLoading]);

  // Set up all listeners when user is available
  useEffect(() => {
    if (!user) return;
    
    console.log('Setting up real-time listeners for user:', user.id);
    
    // Initialize notifications (with retry mechanism)
    initializeNotifications();
    
    // Unified handler for all notification events
    const handleNotification = (payload: any) => {
      console.log('New notification received:', payload);
      if (payload.new) {
        const notification = payload.new as Notification;
        addNotificationToState(notification);
      }
    };
    
    // Set up real-time listeners for all notification types using the consolidated setup
    const cleanup = setupListeners(
      user.id, 
      handleNotification,
      eventHandlers.handleCreditBalanceUpdate,
      eventHandlers.handleCreditTransaction,
      eventHandlers.handleMessageEvent
    );
    
    return () => {
      console.log('Cleaning up notification channels');
      cleanup();
    };
  }, [user, addNotificationToState, initializeNotifications, eventHandlers]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    isLoading,
    addNotification: addNotificationToState
  };
};
