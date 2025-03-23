
import { useAuth } from '@/context/AuthContext';
import { useNotificationsState } from './useNotificationsState';
import { useNotificationActions } from './useNotificationActions';
import { useEffect } from 'react';
import { fetchNotifications } from '@/services/notifications/notificationService';
import { setupListeners } from '@/services/notifications/realTimeListeners';

export const useNotificationsService = () => {
  const { user } = useAuth();
  const {
    notifications,
    setNotifications,
    isLoading,
    unreadCount,
    addNotificationToState
  } = useNotificationsState();

  const { markAsRead, markAllAsRead } = useNotificationActions(
    user?.id,
    notifications,
    setNotifications
  );

  // Set up notification listeners and fetch initial notifications
  useEffect(() => {
    if (!user) return;

    let isMounted = true;
    
    // Fetch initial notifications
    const loadNotifications = async () => {
      try {
        const fetchedNotifications = await fetchNotifications(user.id);
        if (isMounted) {
          setNotifications(fetchedNotifications);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    
    loadNotifications();
    
    // Set up real-time listeners with cleanup
    const cleanup = setupListeners(user.id, (payload) => {
      if (isMounted && payload.new) {
        addNotificationToState(payload.new);
      }
    });
    
    // Clean up listeners and set mounted flag
    return () => {
      isMounted = false;
      cleanup();
    };
  }, [user, setNotifications, addNotificationToState]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    isLoading,
    addNotification: addNotificationToState
  };
};

