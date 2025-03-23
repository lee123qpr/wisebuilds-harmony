
import { useAuth } from '@/context/AuthContext';
import { useNotificationsState } from './useNotificationsState';
import { useNotificationActions } from './useNotificationActions';
import { useNotificationListeners } from './useNotificationListeners';
import { useEffect, useRef } from 'react';

export const useNotificationsService = () => {
  const { user } = useAuth();
  const initialized = useRef(false);
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

  // Set up notification listeners - only once per session
  useEffect(() => {
    if (!initialized.current) {
      // Set up notification listeners
      useNotificationListeners();
      initialized.current = true;
    }
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    isLoading,
    addNotification: addNotificationToState
  };
};
