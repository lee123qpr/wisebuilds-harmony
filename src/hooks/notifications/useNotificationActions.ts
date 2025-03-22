
import { Notification } from '@/services/notifications/types';
import { 
  markNotificationAsRead,
  markAllNotificationsAsRead,
  fetchNotifications
} from '@/services/notifications';

export const useNotificationActions = (
  userId: string | undefined,
  notifications: Notification[],
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>
) => {
  
  const markAsRead = async (id: string) => {
    if (!userId) return;
    
    // First update the local state for immediate feedback
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
    
    // Then update the database
    const success = await markNotificationAsRead(id, userId);
    
    if (!success) {
      // Revert the local change if DB update failed
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: false } 
            : notification
        )
      );
    }
  };

  const markAllAsRead = async () => {
    if (!userId) return;
    
    // First update the local state for immediate feedback
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    
    // Then update the database
    const success = await markAllNotificationsAsRead(userId);
    
    if (!success) {
      // Revert by fetching fresh data
      const data = await fetchNotifications(userId);
      setNotifications(data);
    }
  };

  return {
    markAsRead,
    markAllAsRead
  };
};
