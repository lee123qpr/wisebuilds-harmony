
import { useAuth } from '@/context/AuthContext';
import { useNotificationsState } from './useNotificationsState';
import { useNotificationActions } from './useNotificationActions';
import { useEffect, useRef } from 'react';
import { setupListeners } from '@/services/notifications/realTimeListeners';
import { fetchNotifications } from '@/services/notifications/notificationService';

export const useNotificationsService = () => {
  const { user } = useAuth();
  const initialized = useRef(false);
  const listenerCleanupRef = useRef<(() => void) | null>(null);
  
  const {
    notifications,
    setNotifications,
    isLoading,
    setIsLoading,
    unreadCount,
    addNotificationToState
  } = useNotificationsState();

  const { markAsRead, markAllAsRead } = useNotificationActions(
    user?.id,
    notifications,
    setNotifications
  );

  // Set up notification listeners - only once per user session
  useEffect(() => {
    if (!user || initialized.current) return;

    console.log('Initializing notification service for user:', user.id);
    initialized.current = true;

    // Function to load notifications
    const loadNotifications = async () => {
      try {
        setIsLoading(true);
        const data = await fetchNotifications(user.id);
        console.log('Fetched notifications:', data.length);
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Load initial notifications
    loadNotifications();

    // Set up real-time listeners
    const onNotification = (payload: any) => {
      console.log('Real-time notification received:', payload);
      if (payload.new) {
        addNotificationToState(payload.new);
      }
    };

    // Set up real-time listeners for all notification types
    listenerCleanupRef.current = setupListeners(user.id, onNotification);

    return () => {
      console.log('Cleaning up notification service');
      if (listenerCleanupRef.current) {
        listenerCleanupRef.current();
        listenerCleanupRef.current = null;
      }
      initialized.current = false;
    };
  }, [user, setNotifications, setIsLoading, addNotificationToState]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    isLoading,
    addNotification: addNotificationToState
  };
};
