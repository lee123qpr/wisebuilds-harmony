
import { useAuth } from '@/context/AuthContext';
import { useNotificationsState } from './useNotificationsState';
import { useNotificationActions } from './useNotificationActions';
import { useNotificationListeners } from './useNotificationListeners';

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

  const { addNotification } = useNotificationListeners(
    user,
    setNotifications,
    setIsLoading,
    addNotificationToState,
    updateNotificationInState
  );

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    isLoading,
    addNotification
  };
};
